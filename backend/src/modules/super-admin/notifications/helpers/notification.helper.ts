import {
  NotificationStatus,
  NotificationTargetType,
  Prisma,
  RoleEnum,
} from "@prisma/client";

export interface NotificationUserContext {
  userId: string;
  role: RoleEnum;
  schoolId: string | null;
  studentId?: string | null;
  parentStudentIds?: string[];
  classId?: string | null;
  sectionId?: string | null;
}

export const buildNotificationVisibilityWhere = (
  context: NotificationUserContext,
): Prisma.NotificationWhereInput => {
  const audienceConditions: Prisma.NotificationAudienceWhereInput[] = [
    {
      targetType: NotificationTargetType.GLOBAL,
    },
    {
      targetType: NotificationTargetType.USER,
      userId: context.userId,
    },
  ];

  if (context.schoolId) {
    audienceConditions.push({
      targetType: NotificationTargetType.SCHOOL,
      schoolId: context.schoolId,
    });

    audienceConditions.push({
      targetType: NotificationTargetType.ROLE,
      schoolId: context.schoolId,
      role: context.role,
    });

    if (context.studentId) {
      audienceConditions.push({
        targetType: NotificationTargetType.STUDENT,
        schoolId: context.schoolId,
        studentId: context.studentId,
      });
    }

    if (context.parentStudentIds?.length) {
      audienceConditions.push({
        targetType: NotificationTargetType.STUDENT,
        schoolId: context.schoolId,
        studentId: {
          in: context.parentStudentIds,
        },
      });
    }

    if (context.classId) {
      audienceConditions.push({
        targetType: NotificationTargetType.CLASS,
        schoolId: context.schoolId,
        classId: context.classId,
      });
    }

    if (context.sectionId) {
      audienceConditions.push({
        targetType: NotificationTargetType.SECTION,
        schoolId: context.schoolId,
        sectionId: context.sectionId,
      });
    }
  }

  const tenantCondition: Prisma.NotificationWhereInput = context.schoolId
    ? {
        OR: [
          {
            schoolId: null,
          },
          {
            schoolId: context.schoolId,
          },
        ],
      }
    : {
        schoolId: null,
      };

  return {
    isDeleted: false,
    status: NotificationStatus.SENT,
    ...tenantCondition,
    audiences: {
      some: {
        OR: audienceConditions,
      },
    },
  };
};

export const buildNotificationManagementWhere = (
  role: RoleEnum,
  schoolId?: string | null,
): Prisma.NotificationWhereInput => {
  const where: Prisma.NotificationWhereInput = {
    isDeleted: false,
  };

  if (role === RoleEnum.SCHOOL_ADMIN && schoolId) {
    where.schoolId = schoolId;
  }

  if (role === RoleEnum.SUPER_ADMIN && schoolId) {
    where.schoolId = schoolId;
  }

  return where;
};

export const isSchoolAdmin = (role: RoleEnum): boolean =>
  role === RoleEnum.SCHOOL_ADMIN;

export const isSuperAdmin = (role: RoleEnum): boolean =>
  role === RoleEnum.SUPER_ADMIN;

export const isSchoolRole = (role: RoleEnum): boolean =>
  role === RoleEnum.SCHOOL_ADMIN ||
  role === RoleEnum.TEACHER ||
  role === RoleEnum.STUDENT ||
  role === RoleEnum.PARENT;

export const isTargetAllowedForSchoolAdmin = (
  targetType: NotificationTargetType,
): boolean => targetType !== NotificationTargetType.GLOBAL;

export const isTargetAllowedForSuperAdmin = (
  targetType: NotificationTargetType,
): boolean => true;

export const getNotificationSchoolId = (
  role: RoleEnum,
  userSchoolId: string | null | undefined,
  requestedSchoolId: string | null | undefined,
): string | null => {
  if (role === RoleEnum.SUPER_ADMIN) {
    return requestedSchoolId ?? null;
  }

  if (role === RoleEnum.SCHOOL_ADMIN) {
    return userSchoolId ?? null;
  }

  return userSchoolId ?? null;
};

export const validateNotificationSchoolAccess = (
  role: RoleEnum,
  userSchoolId: string | null | undefined,
  notificationSchoolId: string | null | undefined,
): boolean => {
  if (role === RoleEnum.SUPER_ADMIN) {
    return true;
  }

  if (role === RoleEnum.SCHOOL_ADMIN) {
    return Boolean(
      userSchoolId &&
        notificationSchoolId &&
        userSchoolId === notificationSchoolId,
    );
  }

  return false;
};
