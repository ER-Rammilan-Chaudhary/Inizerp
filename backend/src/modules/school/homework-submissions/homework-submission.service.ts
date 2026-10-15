import { HomeworkSubmissionStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";
import type {
  CreateHomeworkSubmissionInput,
  HomeworkSubmissionListQuery,
  UpdateHomeworkSubmissionInput,
} from "./homework-submission.schema";

const submissionSelect = {
  id: true,
  schoolId: true,
  homeworkId: true,
  studentId: true,
  submittedAt: true,
  status: true,
  attachmentId: true,
  content: true,
  marks: true,
  remarks: true,
  gradedAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
} satisfies Prisma.HomeworkSubmissionSelect;

const getHomework = async (schoolId: string, homeworkId: string) => {
  const homework = await prisma.homework.findFirst({
    where: {
      id: homeworkId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      academicYearId: true,
      classId: true,
      sectionId: true,
      dueDate: true,
    },
  });

  if (!homework) {
    throw new ApiError(404, "Homework not found");
  }

  return homework;
};

const getStudent = async (schoolId: string, studentId: string) => {
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};

const validateStudentEnrollment = async (
  schoolId: string,
  homework: {
    academicYearId: string | null;
    classId: string;
    sectionId: string | null;
  },
  studentId: string,
) => {
  if (!homework.academicYearId) {
    throw new ApiError(
      400,
      "Homework must be assigned to an academic year before submission",
    );
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      schoolId,
      studentId,
      academicYearId: homework.academicYearId,
      classId: homework.classId,
      ...(homework.sectionId ? { sectionId: homework.sectionId } : {}),
      status: "ACTIVE",
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!enrollment) {
    throw new ApiError(
      400,
      "Student is not enrolled in the homework class and section",
    );
  }

  return enrollment;
};

export const getHomeworkSubmissionsService = async (
  schoolId: string,
  query: HomeworkSubmissionListQuery,
) => {
  const {
    page,
    limit,
    homeworkId,
    studentId,
    status,
    search,
    sortBy,
    sortOrder,
  } = query;

  const where: Prisma.HomeworkSubmissionWhereInput = {
    schoolId,
    isDeleted: false,
    ...(homeworkId ? { homeworkId } : {}),
    ...(studentId ? { studentId } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          student: {
            OR: [
              {
                admissionNo: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                user: {
                  fullName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          },
        }
      : {}),
  };

  const skip = (page - 1) * limit;

  const [total, data] = await prisma.$transaction([
    prisma.homeworkSubmission.count({
      where,
    }),

    prisma.homeworkSubmission.findMany({
      where,
      skip,
      take: limit,
      select: {
        ...submissionSelect,
        homework: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            classId: true,
            sectionId: true,
            subjectId: true,
          },
        },
        student: {
          select: {
            id: true,
            admissionNo: true,
            rollNo: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getHomeworkSubmissionByIdService = async (
  schoolId: string,
  submissionId: string,
) => {
  const submission = await prisma.homeworkSubmission.findFirst({
    where: {
      id: submissionId,
      schoolId,
      isDeleted: false,
    },
    select: {
      ...submissionSelect,
      homework: {
        select: {
          id: true,
          title: true,
          dueDate: true,
          classId: true,
          sectionId: true,
          subjectId: true,
        },
      },
      student: {
        select: {
          id: true,
          admissionNo: true,
          rollNo: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!submission) {
    throw new ApiError(404, "Homework submission not found");
  }

  return submission;
};

export const createHomeworkSubmissionService = async (
  schoolId: string,
  input: CreateHomeworkSubmissionInput,
) => {
  const homework = await getHomework(schoolId, input.homeworkId);

  await getStudent(schoolId, input.studentId);

  await validateStudentEnrollment(schoolId, homework, input.studentId);

  const existingSubmission = await prisma.homeworkSubmission.findFirst({
    where: {
      schoolId,
      homeworkId: input.homeworkId,
      studentId: input.studentId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (existingSubmission) {
    throw new ApiError(409, "Student has already submitted this homework");
  }

  const submittedAt = input.submittedAt ?? new Date();

  const status =
    submittedAt > homework.dueDate
      ? HomeworkSubmissionStatus.LATE
      : HomeworkSubmissionStatus.SUBMITTED;

  try {
    return await prisma.homeworkSubmission.create({
      data: {
        schoolId,
        homeworkId: input.homeworkId,
        studentId: input.studentId,
        submittedAt,
        status,
        attachmentId: input.attachmentId ?? null,
        content: input.content ?? null,
      },
      select: submissionSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Student has already submitted this homework");
    }

    throw error;
  }
};

export const updateHomeworkSubmissionService = async (
  schoolId: string,
  submissionId: string,
  input: UpdateHomeworkSubmissionInput,
) => {
  const existing = await prisma.homeworkSubmission.findFirst({
    where: {
      id: submissionId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      submittedAt: true,
      status: true,
      homework: {
        select: {
          dueDate: true,
        },
      },
    },
  });

  if (!existing) {
    throw new ApiError(404, "Homework submission not found");
  }

  const submittedAt = input.submittedAt ?? existing.submittedAt;

  let status = input.status;

  if (!status) {
    status =
      submittedAt > existing.homework.dueDate
        ? HomeworkSubmissionStatus.LATE
        : HomeworkSubmissionStatus.SUBMITTED;
  }

  const isGrading = input.marks !== undefined || input.remarks !== undefined;

  if (isGrading && status !== HomeworkSubmissionStatus.RETURNED) {
    status = HomeworkSubmissionStatus.GRADED;
  }

  const gradedAt =
    isGrading || status === HomeworkSubmissionStatus.GRADED
      ? new Date()
      : undefined;

  return prisma.homeworkSubmission.update({
    where: {
      id: submissionId,
    },
    data: {
      ...(input.submittedAt !== undefined
        ? { submittedAt: input.submittedAt }
        : {}),
      ...(input.attachmentId !== undefined
        ? { attachmentId: input.attachmentId }
        : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.marks !== undefined ? { marks: input.marks } : {}),
      ...(input.remarks !== undefined ? { remarks: input.remarks } : {}),
      status,
      ...(gradedAt ? { gradedAt } : {}),
    },
    select: submissionSelect,
  });
};

export const deleteHomeworkSubmissionService = async (
  schoolId: string,
  submissionId: string,
) => {
  const existing = await prisma.homeworkSubmission.findFirst({
    where: {
      id: submissionId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Homework submission not found");
  }

  await prisma.homeworkSubmission.update({
    where: {
      id: submissionId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
