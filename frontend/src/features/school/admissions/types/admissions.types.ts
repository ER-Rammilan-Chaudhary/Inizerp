export type AdmissionStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ENROLLED";

export interface Admission {
  id: string;
  schoolId: string;
  academicYearId: string;
  applicationNo: string;
  studentName: string;
  appliedClassId: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  status: AdmissionStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedById: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  academicYear?: {
    id: string;
    name: string;
    code?: string;
    isCurrent?: boolean;
  } | null;
  appliedClass?: {
    id: string;
    name: string;
  } | null;
}

export interface AdmissionsFilterParams {
  academicYearId?: string;
  appliedClassId?: string;
  status?: string;
  search?: string;
}

export interface CreateAdmissionPayload {
  academicYearId: string;
  applicationNo: string;
  studentName: string;
  appliedClassId?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  remarks?: string | null;
}

export interface UpdateAdmissionPayload {
  academicYearId?: string;
  applicationNo?: string;
  studentName?: string;
  appliedClassId?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  remarks?: string | null;
  status?: AdmissionStatus;
}

export interface AdmissionsResponse {
  success: boolean;
  message: string;
  data: Admission[];
}

export interface AdmissionResponse {
  success: boolean;
  message: string;
  data: Admission;
}
