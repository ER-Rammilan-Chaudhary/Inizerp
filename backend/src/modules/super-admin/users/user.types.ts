export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN";

export interface UserQuery {
  page?: string;
  limit?: string;
  search?: string;
  role?: UserRole;
  schoolId?: string;
  status?: UserStatus;
}

export interface CreateSchoolAdminInput {
  fullName: string;
  email: string;
  password: string;
  schoolId: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface UpdateSchoolAdminInput {
  fullName?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  status?: UserStatus;
  schoolId?: string;
}

export interface ResetPasswordInput {
  password: string;
}
