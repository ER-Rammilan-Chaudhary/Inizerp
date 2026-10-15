import { AdmissionStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { ApiError } from "../../../utils/ApiError";

export interface CreateAdmissionInput {
  academicYearId: string;
  applicationNo?: string;
  studentName: string;
  appliedClassId?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  remarks?: string | null;
}

export interface UpdateAdmissionInput {
  academicYearId?: string;
  applicationNo?: string;
  studentName?: string;
  appliedClassId?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  remarks?: string | null;
  status?: AdmissionStatus;
}


const admissionSelect = {
  id: true,
  schoolId: true,
  academicYearId: true,
  applicationNo: true,
  studentName: true,
  appliedClassId: true,
  guardianName: true,
  guardianPhone: true,
  status: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedById: true,
  remarks: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  isDeleted: true,
} satisfies Prisma.AdmissionSelect;

const validateAcademicYear = async (
  schoolId: string,
  academicYearId: string,
) => {
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
    throw new ApiError(400, "Academic year does not belong to this school");
  }
};

const validateClass = async (
  schoolId: string,
  classId: string | null | undefined,
) => {
  if (!classId) {
    return;
  }

  const schoolClass = await prisma.class.findFirst({
    where: {
      id: classId,
      schoolId,
    },
    select: {
      id: true,
    },
  });

  if (!schoolClass) {
    throw new ApiError(400, "Class does not belong to this school");
  }
};

export interface GetAdmissionsFilters {
  academicYearId?: string;
  appliedClassId?: string;
  status?: AdmissionStatus;
  search?: string;
}

export const getAdmissionsService = async (
  schoolId: string,
  filters?: GetAdmissionsFilters,
) => {
  const where: Prisma.AdmissionWhereInput = {
    schoolId,
    isDeleted: false,
    ...(filters?.academicYearId && { academicYearId: filters.academicYearId }),
    ...(filters?.appliedClassId && { appliedClassId: filters.appliedClassId }),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.search && {
      OR: [
        { applicationNo: { contains: filters.search, mode: "insensitive" } },
        { studentName: { contains: filters.search, mode: "insensitive" } },
        { guardianName: { contains: filters.search, mode: "insensitive" } },
        { guardianPhone: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
  };

  const admissions = await prisma.admission.findMany({
    where,
    select: admissionSelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  const academicYears = await prisma.academicYear.findMany({
    where: { schoolId, isDeleted: false },
    select: { id: true, name: true, code: true, isCurrent: true },
  });

  const classes = await prisma.class.findMany({
    where: { schoolId },
    select: { id: true, name: true },
  });

  const yearMap = new Map(
    academicYears.map((y: { id: string; name: string; code: string; isCurrent: boolean }) => [y.id, y]),
  );
  const classMap = new Map(
    classes.map((c: { id: string; name: string }) => [c.id, c]),
  );

  return admissions.map((admission: typeof admissions[number]) => ({
    ...admission,
    academicYear: yearMap.get(admission.academicYearId) ?? null,
    appliedClass: admission.appliedClassId
      ? classMap.get(admission.appliedClassId) ?? null
      : null,
  }));
};

export const getAdmissionByIdService = async (
  schoolId: string,
  admissionId: string,
) => {
  const admission = await prisma.admission.findFirst({
    where: {
      id: admissionId,
      schoolId,
      isDeleted: false,
    },
    select: admissionSelect,
  });

  if (!admission) {
    throw new ApiError(404, "Admission not found");
  }

  const [academicYear, appliedClass] = await Promise.all([
    prisma.academicYear.findFirst({
      where: { id: admission.academicYearId, schoolId, isDeleted: false },
      select: { id: true, name: true, code: true, isCurrent: true },
    }),
    admission.appliedClassId
      ? prisma.class.findFirst({
          where: { id: admission.appliedClassId, schoolId },
          select: { id: true, name: true },
        })
      : null,
  ]);

  return {
    ...admission,
    academicYear: academicYear ?? null,
    appliedClass: appliedClass ?? null,
  };
};

export const getNextApplicationNoService = async (
  schoolId: string,
  academicYearId?: string,
): Promise<string> => {
  let yearPrefix = new Date().getFullYear().toString();

  if (academicYearId) {
    const year = await prisma.academicYear.findFirst({
      where: { id: academicYearId, schoolId, isDeleted: false },
      select: { name: true, code: true, startDate: true },
    });
    if (year) {
      const match = year.name.match(/\d{4}/) || year.code.match(/\d{4}/);
      if (match) {
        yearPrefix = match[0];
      } else if (year.startDate) {
        yearPrefix = new Date(year.startDate).getFullYear().toString();
      }
    }
  }

  const prefix = `APP-${yearPrefix}-`;

  const existingAdmissions = await prisma.admission.findMany({
    where: {
      schoolId,
      applicationNo: {
        startsWith: prefix,
      },
    },
    select: {
      applicationNo: true,
    },
  });

  let maxNum = 0;
  for (const item of existingAdmissions) {
    const suffix = item.applicationNo.slice(prefix.length);
    const num = parseInt(suffix, 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  }

  const nextSeq = maxNum + 1;
  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
};

export const createAdmissionService = async (
  schoolId: string,
  data: CreateAdmissionInput,
) => {
  await validateAcademicYear(schoolId, data.academicYearId);

  await validateClass(schoolId, data.appliedClassId);

  let finalApplicationNo = data.applicationNo?.trim();
  if (!finalApplicationNo) {
    finalApplicationNo = await getNextApplicationNoService(
      schoolId,
      data.academicYearId,
    );
  }

  const existingAdmission = await prisma.admission.findFirst({
    where: {
      schoolId,
      applicationNo: finalApplicationNo,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (existingAdmission) {
    throw new ApiError(409, "Application number already exists");
  }

  return prisma.admission.create({
    data: {
      schoolId,
      academicYearId: data.academicYearId,
      applicationNo: finalApplicationNo,
      studentName: data.studentName,
      appliedClassId: data.appliedClassId ?? null,
      guardianName: data.guardianName ?? null,
      guardianPhone: data.guardianPhone ?? null,
      remarks: data.remarks ?? null,
    },
    select: admissionSelect,
  });
};

export const updateAdmissionService = async (
  schoolId: string,
  admissionId: string,
  data: UpdateAdmissionInput,
) => {
  const admission = await prisma.admission.findFirst({
    where: {
      id: admissionId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
      academicYearId: true,
      applicationNo: true,
    },
  });

  if (!admission) {
    throw new ApiError(404, "Admission not found");
  }

  if (data.academicYearId !== undefined) {
    await validateAcademicYear(schoolId, data.academicYearId);
  }

  if (data.appliedClassId !== undefined) {
    await validateClass(schoolId, data.appliedClassId);
  }

  if (
    data.applicationNo !== undefined &&
    data.applicationNo !== admission.applicationNo
  ) {
    const existingAdmission = await prisma.admission.findFirst({
      where: {
        schoolId,
        applicationNo: data.applicationNo,
        id: {
          not: admissionId,
        },
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });

    if (existingAdmission) {
      throw new ApiError(409, "Application number already exists");
    }
  }

  return prisma.admission.update({
    where: {
      id: admissionId,
    },
    data: {
      ...(data.academicYearId !== undefined && {
        academicYearId: data.academicYearId,
      }),

      ...(data.applicationNo !== undefined && {
        applicationNo: data.applicationNo,
      }),

      ...(data.studentName !== undefined && {
        studentName: data.studentName,
      }),

      ...(data.appliedClassId !== undefined && {
        appliedClassId: data.appliedClassId,
      }),

      ...(data.guardianName !== undefined && {
        guardianName: data.guardianName,
      }),

      ...(data.guardianPhone !== undefined && {
        guardianPhone: data.guardianPhone,
      }),

      ...(data.remarks !== undefined && {
        remarks: data.remarks,
      }),

      ...(data.status !== undefined && {
        status: data.status,
        reviewedAt: new Date(),
      }),
    },
    select: admissionSelect,
  });
};

export const deleteAdmissionService = async (
  schoolId: string,
  admissionId: string,
) => {
  const admission = await prisma.admission.findFirst({
    where: {
      id: admissionId,
      schoolId,
      isDeleted: false,
    },
    select: {
      id: true,
    },
  });

  if (!admission) {
    throw new ApiError(404, "Admission not found");
  }

  await prisma.admission.update({
    where: {
      id: admissionId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
