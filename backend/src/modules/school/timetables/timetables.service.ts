import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

import type {
  CreateTimetableInput,
  TimetableListQuery,
  UpdateTimetableInput,
} from "./timetables.schema";

const timetableSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  classId: true,
  sectionId: true,
  subjectId: true,
  teacherId: true,
  day: true,
  startTime: true,
  endTime: true,
  period: true,
  roomNo: true,
  createdAt: true,
  updatedAt: true,
  academicYear: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  class: {
    select: {
      id: true,
      name: true,
    },
  },
  section: {
    select: {
      id: true,
      name: true,
    },
  },
  subject: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  teacher: {
    select: {
      id: true,
      employeeId: true,
      designation: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  },
} satisfies Prisma.TimetableSelect;

type ConflictData = {
  academicYearId: string;
  classId: string;
  sectionId: string | null;
  day: string;
  period: number;
  teacherId: string;
  startTime: string;
  endTime: string;
  roomNo: string | null;
};

const validateClass = async (schoolId: string, classId: string) => {
  const classRecord = await prisma.class.findFirst({
    where: {
      id: classId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!classRecord) {
    throw new ApiError(404, "Class not found");
  }

  return classRecord;
};

const validateSection = async (
  schoolId: string,
  classId: string,
  sectionId: string,
) => {
  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      schoolId,
      classId,
    },
    select: {
      id: true,
    },
  });

  if (!section) {
    throw new ApiError(404, "Section not found for the selected class");
  }

  return section;
};

const validateSubject = async (schoolId: string, subjectId: string) => {
  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  return subject;
};

const validateTeacher = async (schoolId: string, teacherId: string) => {
  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return teacher;
};

const validateAcademicYear = async (
  schoolId: string,
  academicYearId: string,
) => {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      id: academicYearId,
      schoolId,
      isDeleted: false,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found or inactive");
  }

  return academicYear;
};

const getDefaultAcademicYear = async (schoolId: string) => {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      schoolId,
      isCurrent: true,
      isActive: true,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!academicYear) {
    throw new ApiError(
      400,
      "No current academic year is configured for this school",
    );
  }

  return academicYear.id;
};

const checkConflict = async (
  schoolId: string,
  data: ConflictData,
  excludeId?: string,
) => {
  const baseWhere = {
    schoolId,
    academicYearId: data.academicYearId,
    day: data.day,
    ...(excludeId
      ? {
          NOT: {
            id: excludeId,
          },
        }
      : {}),
  };

  const classConflict = await prisma.timetable.findFirst({
    where: {
      ...baseWhere,
      classId: data.classId,
      sectionId: data.sectionId,
      OR: [
        {
          period: data.period,
        },
        {
          startTime: {
            lt: data.endTime,
          },
          endTime: {
            gt: data.startTime,
          },
        },
      ],
    },
    select: {
      id: true,
      period: true,
      startTime: true,
      endTime: true,
    },
  });

  if (classConflict) {
    throw new ApiError(
      409,
      `This class section already has a timetable entry on this day (Period ${classConflict.period}, ${classConflict.startTime} - ${classConflict.endTime})`,
    );
  }

  const teacherConflict = await prisma.timetable.findFirst({
    where: {
      ...baseWhere,
      teacherId: data.teacherId,
      OR: [
        {
          period: data.period,
        },
        {
          startTime: {
            lt: data.endTime,
          },
          endTime: {
            gt: data.startTime,
          },
        },
      ],
    },
    select: {
      id: true,
      period: true,
      startTime: true,
      endTime: true,
      class: {
        select: {
          name: true,
        },
      },
    },
  });

  if (teacherConflict) {
    throw new ApiError(
      409,
      `Teacher already has a conflicting class scheduled for ${teacherConflict.class.name} (Period ${teacherConflict.period}, ${teacherConflict.startTime} - ${teacherConflict.endTime})`,
    );
  }

  if (data.roomNo) {
    const roomConflict = await prisma.timetable.findFirst({
      where: {
        ...baseWhere,
        roomNo: data.roomNo,
        OR: [
          {
            period: data.period,
          },
          {
            startTime: {
              lt: data.endTime,
            },
            endTime: {
              gt: data.startTime,
            },
          },
        ],
      },
      select: {
        id: true,
        period: true,
        startTime: true,
        endTime: true,
      },
    });

    if (roomConflict) {
      throw new ApiError(
        409,
        `Room "${data.roomNo}" is already assigned to another class during this time (Period ${roomConflict.period}, ${roomConflict.startTime} - ${roomConflict.endTime})`,
      );
    }
  }
};

export const getTimetables = async (
  schoolId: string,
  query: TimetableListQuery,
) => {
  const {
    page,
    limit,
    academicYearId,
    classId,
    sectionId,
    teacherId,
    subjectId,
    day,
    period,
  } = query;

  const where: Prisma.TimetableWhereInput = {
    schoolId,
    ...(academicYearId ? { academicYearId } : {}),
    ...(classId ? { classId } : {}),
    ...(sectionId ? { sectionId } : {}),
    ...(teacherId ? { teacherId } : {}),
    ...(subjectId ? { subjectId } : {}),
    ...(day ? { day } : {}),
    ...(period !== undefined ? { period } : {}),
  };

  const skip = (page - 1) * limit;

  const [total, data] = await prisma.$transaction([
    prisma.timetable.count({
      where,
    }),
    prisma.timetable.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        {
          day: "asc",
        },
        {
          period: "asc",
        },
        {
          startTime: "asc",
        },
      ],
      select: timetableSelect,
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

export const getTimetableById = async (
  schoolId: string,
  timetableId: string,
) => {
  const timetable = await prisma.timetable.findFirst({
    where: {
      id: timetableId,
      schoolId,
    },
    select: timetableSelect,
  });

  if (!timetable) {
    throw new ApiError(404, "Timetable entry not found");
  }

  return timetable;
};

export const createTimetable = async (
  schoolId: string,
  data: CreateTimetableInput,
) => {
  const academicYearId =
    data.academicYearId ?? (await getDefaultAcademicYear(schoolId));

  await validateClass(schoolId, data.classId);

  if (data.sectionId) {
    await validateSection(schoolId, data.classId, data.sectionId);
  }

  await validateSubject(schoolId, data.subjectId);

  await validateTeacher(schoolId, data.teacherId);

  await validateAcademicYear(schoolId, academicYearId);

  await checkConflict(schoolId, {
    academicYearId,
    classId: data.classId,
    sectionId: data.sectionId ?? null,
    day: data.day,
    period: data.period,
    teacherId: data.teacherId,
    startTime: data.startTime,
    endTime: data.endTime,
    roomNo: data.roomNo ?? null,
  });

  try {
    return await prisma.timetable.create({
      data: {
        schoolId,
        academicYearId,
        classId: data.classId,
        sectionId: data.sectionId ?? null,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        period: data.period,
        roomNo: data.roomNo ?? null,
      },
      select: timetableSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "A timetable entry already exists for the selected class, section, day and period",
      );
    }

    throw error;
  }
};

export const updateTimetable = async (
  schoolId: string,
  timetableId: string,
  data: UpdateTimetableInput,
) => {
  const existing = await prisma.timetable.findFirst({
    where: {
      id: timetableId,
      schoolId,
    },
  });

  if (!existing) {
    throw new ApiError(404, "Timetable entry not found");
  }

  const classId = data.classId ?? existing.classId;

  const subjectId = data.subjectId ?? existing.subjectId;

  const teacherId = data.teacherId ?? existing.teacherId;

  const day = data.day ?? existing.day;

  const startTime = data.startTime ?? existing.startTime;

  const endTime = data.endTime ?? existing.endTime;

  const period = data.period ?? existing.period;

  const sectionId =
    data.sectionId !== undefined ? data.sectionId : existing.sectionId;

  const academicYearId =
    data.academicYearId !== undefined
      ? data.academicYearId
      : existing.academicYearId;

  const roomNo = data.roomNo !== undefined ? data.roomNo : existing.roomNo;

  await validateClass(schoolId, classId);

  if (sectionId) {
    await validateSection(schoolId, classId, sectionId);
  }

  await validateSubject(schoolId, subjectId);

  await validateTeacher(schoolId, teacherId);

  if (!academicYearId) {
    throw new ApiError(400, "Academic year is required for a timetable");
  }

  await validateAcademicYear(schoolId, academicYearId);

  await checkConflict(
    schoolId,
    {
      academicYearId,
      classId,
      sectionId,
      day,
      period,
      teacherId,
      startTime,
      endTime,
      roomNo,
    },
    timetableId,
  );

  try {
    return await prisma.timetable.update({
      where: {
        id: timetableId,
      },
      data: {
        academicYearId,
        classId,
        sectionId,
        subjectId,
        teacherId,
        day,
        startTime,
        endTime,
        period,
        roomNo,
      },
      select: timetableSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "A timetable entry already exists for the selected class, section, day and period",
      );
    }

    throw error;
  }
};

export const deleteTimetable = async (
  schoolId: string,
  timetableId: string,
) => {
  const timetable = await prisma.timetable.findFirst({
    where: {
      id: timetableId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!timetable) {
    throw new ApiError(404, "Timetable entry not found");
  }

  await prisma.timetable.delete({
    where: {
      id: timetableId,
    },
  });

  return {
    id: timetableId,
  };
};

export interface PeriodItem {
  id: string;
  periodNumber?: number | null;
  name: string;
  type: "REGULAR" | "BREAK" | "LUNCH";
  startTime: string;
  endTime: string;
}

export const DEFAULT_PERIODS: PeriodItem[] = [
  { id: "p1", periodNumber: 1, name: "Period 1", type: "REGULAR", startTime: "08:00", endTime: "08:45" },
  { id: "p2", periodNumber: 2, name: "Period 2", type: "REGULAR", startTime: "08:45", endTime: "09:30" },
  { id: "p3", periodNumber: 3, name: "Period 3", type: "REGULAR", startTime: "09:30", endTime: "10:15" },
  { id: "p4", periodNumber: 4, name: "Period 4", type: "REGULAR", startTime: "10:30", endTime: "11:15" },
  { id: "p5", periodNumber: 5, name: "Period 5", type: "REGULAR", startTime: "11:15", endTime: "12:00" },
  { id: "p6", periodNumber: 6, name: "Period 6", type: "REGULAR", startTime: "12:00", endTime: "12:45" },
  { id: "l1", periodNumber: null, name: "Lunch Break", type: "LUNCH", startTime: "12:45", endTime: "13:15" },
  { id: "p7", periodNumber: 7, name: "Period 7", type: "REGULAR", startTime: "13:15", endTime: "14:00" },
];

export const getPeriods = async (schoolId: string): Promise<PeriodItem[]> => {
  const setting = await prisma.setting.findUnique({
    where: {
      schoolId_key: {
        schoolId,
        key: "period_master",
      },
    },
  });

  if (!setting || !Array.isArray(setting.value) || setting.value.length === 0) {
    return DEFAULT_PERIODS;
  }

  return setting.value as unknown as PeriodItem[];
};

export const savePeriods = async (
  schoolId: string,
  periods: PeriodItem[],
): Promise<PeriodItem[]> => {
  const setting = await prisma.setting.upsert({
    where: {
      schoolId_key: {
        schoolId,
        key: "period_master",
      },
    },
    update: {
      value: periods as unknown as Prisma.InputJsonValue,
    },
    create: {
      schoolId,
      key: "period_master",
      value: periods as unknown as Prisma.InputJsonValue,
    },
  });

  return setting.value as unknown as PeriodItem[];
};

export const addPeriod = async (
  schoolId: string,
  input: Omit<PeriodItem, "id">,
): Promise<PeriodItem[]> => {
  const currentPeriods = await getPeriods(schoolId);
  const nextId = `p_${Date.now()}`;
  const newPeriod: PeriodItem = {
    ...input,
    id: nextId,
  };
  const updated = [...currentPeriods, newPeriod].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );
  return savePeriods(schoolId, updated);
};

export const deletePeriod = async (
  schoolId: string,
  periodId: string,
): Promise<PeriodItem[]> => {
  const currentPeriods = await getPeriods(schoolId);
  const updated = currentPeriods.filter((p) => p.id !== periodId);
  if (updated.length === 0) {
    return savePeriods(schoolId, DEFAULT_PERIODS);
  }
  return savePeriods(schoolId, updated);
};

export const upsertTimetable = async (
  schoolId: string,
  data: CreateTimetableInput,
) => {
  const academicYearId =
    data.academicYearId ?? (await getDefaultAcademicYear(schoolId));

  const existing = await prisma.timetable.findFirst({
    where: {
      schoolId,
      academicYearId,
      classId: data.classId,
      sectionId: data.sectionId ?? null,
      day: data.day,
      period: data.period,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return updateTimetable(schoolId, existing.id, {
      ...data,
      academicYearId,
    });
  }

  return createTimetable(schoolId, {
    ...data,
    academicYearId,
  });
};

