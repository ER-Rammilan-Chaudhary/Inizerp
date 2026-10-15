import { RoleEnum } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

export const ensureSchoolAccess = (
  userSchoolId: string | null | undefined,
  resourceSchoolId: string,
) => {
  if (!userSchoolId) {
    throw new ApiError(403, "School access required");
  }

  if (userSchoolId !== resourceSchoolId) {
    throw new ApiError(403, "Access denied");
  }

  return true;
};

export const ensureStudentAccess = async (
  userId: string,
  schoolId: string,
  studentId: string,
  role: RoleEnum,
) => {
  if (role === RoleEnum.SCHOOL_ADMIN) {
    return true;
  }

  if (role === RoleEnum.STUDENT) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        userId,
        schoolId,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      throw new ApiError(403, "You can only access your own data");
    }

    return true;
  }

  if (role === RoleEnum.PARENT) {
    const parent = await prisma.parent.findFirst({
      where: {
        userId,
        schoolId,
      },
      select: {
        id: true,
      },
    });

    if (!parent) {
      throw new ApiError(403, "Parent profile not found");
    }

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId,
        parentId: parent.id,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      throw new ApiError(403, "You can only access your child's data");
    }

    return true;
  }

  throw new ApiError(403, "Access denied");
};

export const ensureTeacherAccess = async (
  userId: string,
  schoolId: string,
  classId?: string,
  subjectId?: string,
) => {
  const teacher = await prisma.teacher.findFirst({
    where: {
      userId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    throw new ApiError(403, "Teacher profile not found");
  }

  if (!classId && !subjectId) {
    return true;
  }

  const timetable = await prisma.timetable.findFirst({
    where: {
      schoolId,
      teacherId: teacher.id,
      ...(classId ? { classId } : {}),
      ...(subjectId ? { subjectId } : {}),
    },
    select: {
      id: true,
    },
  });

  if (!timetable) {
    throw new ApiError(403, "You are not assigned to this class or subject");
  }

  return true;
};
