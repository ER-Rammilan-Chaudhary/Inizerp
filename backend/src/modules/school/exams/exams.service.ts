import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreateExamData {
  academicYearId?: string | null;
  name: string;
  startDate: Date;
  endDate: Date;
  description?: string | null;
  examType?: string | null;
}

interface UpdateExamData {
  academicYearId?: string | null;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string | null;
  examType?: string | null;
}

const examSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  name: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  description: true,
  examType: true,
  updatedAt: true,

  results: {
    select: {
      id: true,
      studentId: true,
      subjectId: true,
      marks: true,
      totalMarks: true,
      grade: true,
    },
  },
} as const;

const validateAcademicYear = async (
  schoolId: string,
  academicYearId?: string | null,
) => {
  if (!academicYearId) {
    return;
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id: academicYearId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found");
  }
};

export const getExams = async (schoolId: string) => {
  return prisma.exam.findMany({
    where: {
      schoolId,
    },
    select: {
      id: true,
      schoolId: true,
      academicYearId: true,
      name: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      description: true,
      examType: true,
      updatedAt: true,
      _count: {
        select: {
          results: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });
};

export const getExamById = async (schoolId: string, examId: string) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      schoolId,
    },
    select: examSelect,
  });

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  return exam;
};

export const createExam = async (schoolId: string, data: CreateExamData) => {
  if (data.startDate > data.endDate) {
    throw new ApiError(
      400,
      "End date must be greater than or equal to start date",
    );
  }

  await validateAcademicYear(schoolId, data.academicYearId);

  return prisma.exam.create({
    data: {
      schoolId,
      academicYearId: data.academicYearId ?? null,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description ?? null,
      examType: data.examType ?? null,
    },
    select: examSelect,
  });
};

export const updateExam = async (
  schoolId: string,
  examId: string,
  data: UpdateExamData,
) => {
  const existing = await prisma.exam.findFirst({
    where: {
      id: examId,
      schoolId,
    },
    select: {
      id: true,
      academicYearId: true,
      name: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Exam not found");
  }

  const academicYearId =
    data.academicYearId !== undefined
      ? data.academicYearId
      : existing.academicYearId;

  const startDate =
    data.startDate !== undefined ? data.startDate : existing.startDate;

  const endDate = data.endDate !== undefined ? data.endDate : existing.endDate;

  if (startDate > endDate) {
    throw new ApiError(
      400,
      "End date must be greater than or equal to start date",
    );
  }

  await validateAcademicYear(schoolId, academicYearId);

  const examData: Prisma.ExamUncheckedUpdateInput = {};

  if (data.academicYearId !== undefined) {
    examData.academicYearId = data.academicYearId;
  }

  if (data.name !== undefined) {
    examData.name = data.name;
  }

  if (data.startDate !== undefined) {
    examData.startDate = data.startDate;
  }

  if (data.endDate !== undefined) {
    examData.endDate = data.endDate;
  }

  if (data.description !== undefined) {
    examData.description = data.description;
  }

  if (data.examType !== undefined) {
    examData.examType = data.examType;
  }

  if (Object.keys(examData).length === 0) {
    return getExamById(schoolId, examId);
  }

  return prisma.exam.update({
    where: {
      id: examId,
    },
    data: examData,
    select: examSelect,
  });
};

export const deleteExam = async (schoolId: string, examId: string) => {
  const existing = await prisma.exam.findFirst({
    where: {
      id: examId,
      schoolId,
    },
    select: {
      id: true,
      _count: {
        select: {
          results: true,
        },
      },
    },
  });

  if (!existing) {
    throw new ApiError(404, "Exam not found");
  }

  if (existing._count.results > 0) {
    throw new ApiError(
      409,
      "Exam cannot be deleted because results already exist",
    );
  }

  await prisma.exam.delete({
    where: {
      id: examId,
    },
  });

  return true;
};
