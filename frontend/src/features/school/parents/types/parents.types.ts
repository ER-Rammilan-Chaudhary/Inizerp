export interface ParentUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  status: string;
  role: string;
  avatar?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface ParentStudent {
  id: string;
  admissionNo: string;
  rollNo?: string | null;
  dob?: string | null;
  gender?: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface Parent {
  id: string;
  schoolId: string;
  occupation?: string | null;
  address?: string | null;
  annualIncome?: number | null;
  createdAt: string;
  updatedAt: string;
  user: ParentUser;
  students: ParentStudent[];
}

export interface CreateParentPayload {
  fullName: string;
  email: string;
  phone?: string | null;
  password: string;
  occupation?: string | null;
  address?: string | null;
  annualIncome?: number | null;
  studentIds?: string[];
}

export interface UpdateParentPayload {
  fullName?: string;
  email?: string;
  phone?: string | null;
  password?: string;
  occupation?: string | null;
  address?: string | null;
  annualIncome?: number | null;
  studentIds?: string[];
}

export interface ParentsResponse {
  success: boolean;
  message: string;
  data: Parent[];
}

export interface ParentResponse {
  success: boolean;
  message: string;
  data: Parent;
}

export interface ParentFilterParams {
  search?: string;
  occupation?: string;
  sortBy?: "fullName" | "createdAt";
  sortOrder?: "asc" | "desc";
}
