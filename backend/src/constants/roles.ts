import { RoleEnum } from "@prisma/client";

export { RoleEnum };

export const SUPER_ADMIN_ROLES = [RoleEnum.SUPER_ADMIN] as const;

export const SCHOOL_ADMIN_ROLES = [RoleEnum.SCHOOL_ADMIN] as const;

export const SCHOOL_USER_ROLES = [
  RoleEnum.SCHOOL_ADMIN,
  RoleEnum.TEACHER,
  RoleEnum.PARENT,
  RoleEnum.STUDENT,
] as const;
