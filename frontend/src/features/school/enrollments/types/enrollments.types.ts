export type EnrollmentStatus = "ACTIVE" | "WITHDRAWN" | "COMPLETED" | "SUSPENDED";

export interface EnrollmentStudent {
  id: string;
  admissionNo: string;
  rollNo: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    status: string;
  };
}

export interface EnrollmentAcademicYear {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface EnrollmentClass {
  id: string;
  name: string;
}

export interface EnrollmentSection {
  id: string;
  name: string;
  capacity: number | null;
}

export interface Enrollment {
  id: string;
  schoolId: string;
  studentId: string;
  academicYearId: string;
  classId: string;
  sectionId: string | null;
  rollNo: string | null;
  status: EnrollmentStatus;
  enrolledAt: string;
  withdrawnAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: EnrollmentStudent;
  academicYear: EnrollmentAcademicYear;
  class: EnrollmentClass;
  section: EnrollmentSection | null;
}

export interface EnrollmentListParams {
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  sectionName?: string;
  status?: EnrollmentStatus;
  search?: string;
}

export interface CreateEnrollmentPayload {
  studentId: string;
  academicYearId: string;
  classId: string;
  sectionId?: string | null;
  rollNo?: string | null;
}

export interface UpdateEnrollmentPayload {
  academicYearId?: string;
  classId?: string;
  sectionId?: string | null;
  rollNo?: string | null;
  status?: EnrollmentStatus;
}

export interface PromoteStudentItem {
  studentId: string;
  targetClassId: string;
  targetSectionId?: string | null;
  rollNo?: string | null;
}

export interface PromoteStudentsPayload {
  sourceAcademicYearId: string;
  targetAcademicYearId: string;
  promotions: PromoteStudentItem[];
}

export interface EnrollmentsApiResponse {
  success: boolean;
  message: string;
  data: Enrollment[];
}

export interface EnrollmentApiResponse {
  success: boolean;
  message: string;
  data: Enrollment;
}

export interface PromoteApiResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    promotedCount: number;
    totalRequested: number;
  };
}
