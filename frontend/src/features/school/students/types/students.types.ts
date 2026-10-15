export interface StudentAcademicYearOption {
  id: string;
  name: string;
  code?: string | null;
}

export interface StudentClassOption {
  id: string;
  name: string;
}

export interface StudentSectionOption {
  id: string;
  name: string;
  capacity?: number | null;
  classId: string;
}

export interface StudentEnrollment {
  id: string;
  academicYearId: string;
  classId: string;
  sectionId?: string | null;
  rollNo?: string | null;
  status: string;
  enrolledAt: string;
  withdrawnAt?: string | null;
  academicYear: {
    id: string;
    name: string;
    code: string;
    isCurrent?: boolean;
  };
  class: {
    id: string;
    name: string;
  };
  section?: {
    id: string;
    name: string;
  } | null;
}

export interface StudentParent {
  id: string;
  occupation?: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export interface StudentUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  status: string;
  role: string;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface Student {
  id: string;
  schoolId: string;
  admissionNo: string;
  rollNo?: string | null;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  parentId?: string | null;
  guardianId?: string | null;
  admissionDate?: string | null;
  bloodGroup?: string | null;
  createdAt: string;
  updatedAt: string;
  user: StudentUser;
  parent?: StudentParent | null;
  enrollments: StudentEnrollment[];
}

export interface CreateStudentPayload {
  fullName: string;
  email: string;
  phone?: string | null;
  password: string;
  avatar?: File | null;
  rollNo?: string | null;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  parentId?: string | null;
  guardianId?: string | null;
  admissionDate?: string | null;
  bloodGroup?: string | null;
  academicYearId: string;
  classId: string;
  sectionId?: string | null;
  parentFullName?: string | null;
  parentEmail?: string | null;
  parentPhone?: string | null;
  parentOccupation?: string | null;
  parentPassword?: string | null;
  guardianFullName?: string | null;
  guardianRelationship?: string | null;
  guardianPhone?: string | null;
}

export interface UpdateStudentPayload {
  fullName?: string;
  email?: string;
  phone?: string | null;
  password?: string;
  avatar?: File | null;
  rollNo?: string | null;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  parentId?: string | null;
  guardianId?: string | null;
  admissionDate?: string | null;
  bloodGroup?: string | null;
  academicYearId?: string;
  classId?: string;
  sectionId?: string | null;
  parentFullName?: string | null;
  parentEmail?: string | null;
  parentPhone?: string | null;
  parentOccupation?: string | null;
  guardianFullName?: string | null;
  guardianRelationship?: string | null;
  guardianPhone?: string | null;
}

export type StudentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface StudentListParams {
  page?: number;
  limit?: number;
  search?: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  status?: StudentStatus;
  sortBy?: "name" | "admissionNo" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface StudentsResponse {
  success: boolean;
  message: string;
  data: {
    items: Student[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface StudentResponse {
  success: boolean;
  message: string;
  data: Student;
}
