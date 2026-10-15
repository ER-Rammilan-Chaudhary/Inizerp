import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreateResultData {
  examId: string;
  studentId: string;
  subjectId: string;
  marks: number;
  totalMarks: number;
  grade?: string | null;
  remarks?: string | null;
}

interface UpdateResultData {
  marks?: number;
  totalMarks?: number;
  grade?: string | null;
  remarks?: string | null;
}

const resultSelect = {
  id: true,
  examId: true,
  studentId: true,
  subjectId: true,
  marks: true,
  totalMarks: true,
  grade: true,
  remarks: true,
  schoolId: true,
  academicYearId: true,
  createdAt: true,
  updatedAt: true,

  exam: {
    select: {
      id: true,
      name: true,
      examType: true,
      startDate: true,
      endDate: true,
      academicYearId: true,
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

  subject: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
} as const;

const validateReferences = async (schoolId: string, data: CreateResultData) => {
  const [exam, student, subject] = await Promise.all([
    prisma.exam.findFirst({
      where: {
        id: data.examId,
        schoolId,
      },
      select: {
        id: true,
        academicYearId: true,
      },
    }),

    prisma.student.findFirst({
      where: {
        id: data.studentId,
        schoolId,
        isDeleted: false,
        user: {
          isDeleted: false,
        },
      },
      select: {
        id: true,
      },
    }),

    prisma.subject.findFirst({
      where: {
        id: data.subjectId,
        schoolId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  if (exam.academicYearId) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId: data.studentId,
        academicYearId: exam.academicYearId,
        isDeleted: false,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!enrollment) {
      throw new ApiError(
        400,
        "Student is not actively enrolled in the exam academic year",
      );
    }
  }

  return exam;
};

export const getResults = async (schoolId: string) => {
  return prisma.result.findMany({
    where: {
      schoolId,
    },
    select: resultSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getResultById = async (schoolId: string, resultId: string) => {
  const result = await prisma.result.findFirst({
    where: {
      id: resultId,
      schoolId,
    },
    select: resultSelect,
  });

  if (!result) {
    throw new ApiError(404, "Result not found");
  }

  return result;
};

export const createResult = async (
  schoolId: string,
  data: CreateResultData,
) => {
  if (data.marks > data.totalMarks) {
    throw new ApiError(400, "Marks cannot be greater than total marks");
  }

  const exam = await validateReferences(schoolId, data);

  const existingResult = await prisma.result.findFirst({
    where: {
      examId: data.examId,
      studentId: data.studentId,
      subjectId: data.subjectId,
    },
    select: {
      id: true,
    },
  });

  if (existingResult) {
    throw new ApiError(
      409,
      "Result already exists for this exam, student and subject",
    );
  }

  try {
    return await prisma.result.create({
      data: {
        examId: data.examId,
        studentId: data.studentId,
        subjectId: data.subjectId,
        marks: new Prisma.Decimal(data.marks),
        totalMarks: new Prisma.Decimal(data.totalMarks),
        grade: data.grade ?? null,
        remarks: data.remarks ?? null,
        schoolId,
        academicYearId: exam.academicYearId ?? null,
      },
      select: resultSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "Result already exists for this exam, student and subject",
      );
    }

    throw error;
  }
};

export const updateResult = async (
  schoolId: string,
  resultId: string,
  data: UpdateResultData,
) => {
  const existing = await prisma.result.findFirst({
    where: {
      id: resultId,
      schoolId,
    },
    select: {
      id: true,
      marks: true,
      totalMarks: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Result not found");
  }

  const marks = data.marks !== undefined ? data.marks : Number(existing.marks);

  const totalMarks =
    data.totalMarks !== undefined
      ? data.totalMarks
      : Number(existing.totalMarks);

  if (marks > totalMarks) {
    throw new ApiError(400, "Marks cannot be greater than total marks");
  }

  const resultData: Prisma.ResultUncheckedUpdateInput = {};

  if (data.marks !== undefined) {
    resultData.marks = new Prisma.Decimal(data.marks);
  }

  if (data.totalMarks !== undefined) {
    resultData.totalMarks = new Prisma.Decimal(data.totalMarks);
  }

  if (data.grade !== undefined) {
    resultData.grade = data.grade;
  }

  if (data.remarks !== undefined) {
    resultData.remarks = data.remarks;
  }

  if (Object.keys(resultData).length === 0) {
    return getResultById(schoolId, resultId);
  }

  return prisma.result.update({
    where: {
      id: resultId,
    },
    data: resultData,
    select: resultSelect,
  });
};

export const deleteResult = async (schoolId: string, resultId: string) => {
  const existing = await prisma.result.findFirst({
    where: {
      id: resultId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Result not found");
  }

  await prisma.result.delete({
    where: {
      id: resultId,
    },
  });

  return true;
};
