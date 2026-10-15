import { AttendanceStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

interface CreateAttendanceData {
  studentId: string;
  classId: string;
  academicYearId?: string | null;
  attendanceDate: Date;
  status: AttendanceStatus;
  remarks?: string | null;
}

interface UpdateAttendanceData {
  studentId?: string;
  classId?: string;
  academicYearId?: string | null;
  attendanceDate?: Date;
  status?: AttendanceStatus;
  remarks?: string | null;
}

const attendanceSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  studentId: true,
  classId: true,
  attendanceDate: true,
  status: true,
  markedById: true,
  remarks: true,
  createdAt: true,
  updatedAt: true,

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

  class: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);

  normalized.setHours(0, 0, 0, 0);

  return normalized;
};

const validateAttendanceReferences = async (
  schoolId: string,
  studentId: string,
  classId: string,
  academicYearId?: string | null,
) => {
  const [student, classData] = await Promise.all([
    prisma.student.findFirst({
      where: {
        id: studentId,
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

    prisma.class.findFirst({
      where: {
        id: classId,
        schoolId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  if (academicYearId) {
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

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId,
        academicYearId,
        classId,
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
        "Student is not actively enrolled in the selected class and academic year",
      );
    }
  }
};

export const getAttendance = async (schoolId: string) => {
  return prisma.attendance.findMany({
    where: {
      schoolId,
    },
    select: attendanceSelect,
    orderBy: {
      attendanceDate: "desc",
    },
  });
};

export const getAttendanceById = async (
  schoolId: string,
  attendanceId: string,
) => {
  const attendance = await prisma.attendance.findFirst({
    where: {
      id: attendanceId,
      schoolId,
    },
    select: attendanceSelect,
  });

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  return attendance;
};

export const createAttendance = async (
  schoolId: string,
  markedById: string,
  data: CreateAttendanceData,
) => {
  const attendanceDate = normalizeDate(data.attendanceDate);

  await validateAttendanceReferences(
    schoolId,
    data.studentId,
    data.classId,
    data.academicYearId,
  );

  const existing = await prisma.attendance.findFirst({
    where: {
      schoolId,
      studentId: data.studentId,
      attendanceDate,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new ApiError(
      409,
      "Attendance already exists for this student and date",
    );
  }

  try {
    return await prisma.attendance.create({
      data: {
        schoolId,
        studentId: data.studentId,
        classId: data.classId,
        academicYearId: data.academicYearId ?? null,
        attendanceDate,
        status: data.status,
        markedById,
        remarks: data.remarks ?? null,
      },
      select: attendanceSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "Attendance already exists for this student and date",
      );
    }

    throw error;
  }
};

export const updateAttendance = async (
  schoolId: string,
  attendanceId: string,
  data: UpdateAttendanceData,
) => {
  const existing = await prisma.attendance.findFirst({
    where: {
      id: attendanceId,
      schoolId,
    },
    select: {
      id: true,
      studentId: true,
      classId: true,
      academicYearId: true,
      attendanceDate: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Attendance record not found");
  }

  const studentId = data.studentId ?? existing.studentId;
  const classId = data.classId ?? existing.classId;

  const academicYearId =
    data.academicYearId !== undefined
      ? data.academicYearId
      : existing.academicYearId;

  const attendanceDate =
    data.attendanceDate !== undefined
      ? normalizeDate(data.attendanceDate)
      : existing.attendanceDate;

  await validateAttendanceReferences(
    schoolId,
    studentId,
    classId,
    academicYearId,
  );

  const duplicate = await prisma.attendance.findFirst({
    where: {
      schoolId,
      studentId,
      attendanceDate,
      NOT: {
        id: attendanceId,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Attendance already exists for this student and date",
    );
  }

  const attendanceData: Prisma.AttendanceUncheckedUpdateInput = {};

  if (data.studentId !== undefined) {
    attendanceData.studentId = data.studentId;
  }

  if (data.classId !== undefined) {
    attendanceData.classId = data.classId;
  }

  if (data.academicYearId !== undefined) {
    attendanceData.academicYearId = data.academicYearId;
  }

  if (data.attendanceDate !== undefined) {
    attendanceData.attendanceDate = attendanceDate;
  }

  if (data.status !== undefined) {
    attendanceData.status = data.status;
  }

  if (data.remarks !== undefined) {
    attendanceData.remarks = data.remarks;
  }

  if (Object.keys(attendanceData).length === 0) {
    return getAttendanceById(schoolId, attendanceId);
  }

  try {
    return await prisma.attendance.update({
      where: {
        id: attendanceId,
      },
      data: attendanceData,
      select: attendanceSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "Attendance already exists for this student and date",
      );
    }

    throw error;
  }
};

export const deleteAttendance = async (
  schoolId: string,
  attendanceId: string,
) => {
  const existing = await prisma.attendance.findFirst({
    where: {
      id: attendanceId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Attendance record not found");
  }

  await prisma.attendance.delete({
    where: {
      id: attendanceId,
    },
  });

  return true;
};
