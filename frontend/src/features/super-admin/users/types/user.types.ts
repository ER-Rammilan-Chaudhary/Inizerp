export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatar?: string | null;
  role: UserRole;
  status: UserStatus;
  schoolId: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;

  school: {
    id: string;
    name: string;
    code: string;
    status: string;
  } | null;
}

export interface UsersQuery {
  page?: number;
  limit?: number;
  role?: UserRole | "";
  search?: string;
  schoolId?: string;
  status?: UserStatus | "";
}

export interface UsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: { users: User[]; pagination: UsersPagination };
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
  status?: UserStatus;
  schoolId?: string;
}

export interface UpdateUserFormInput {
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: File | null;
  status?: UserStatus;
  schoolId?: string;
}

export interface ResetPasswordInput {
  password: string;
}
