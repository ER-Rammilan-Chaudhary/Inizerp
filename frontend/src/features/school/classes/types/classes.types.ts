export interface ClassTeacher {
  id: string;
  employeeId: string;
  designation: string | null;
  user: {
    id: string;
    fullName: string;
  };
}

export interface ClassSection {
  id: string;
  schoolId: string;
  classId: string;
  name: string;
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  classTeacherId: string | null;
  classTeacher: ClassTeacher | null;
  createdAt: string;
  updatedAt: string;
  sections: ClassSection[];
}

export interface ClassDetails extends Class {
  studentCount: number;
  attendanceCount: number;
  timetableCount: number;
}

export interface ClassListParams {
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface ClassListResponse {
  success: boolean;
  message: string;
  data: Class[];
}

export interface ClassResponse {
  success: boolean;
  message: string;
  data: ClassDetails;
}

export interface CreateClassPayload {
  name: string;
  classTeacherId?: string | null;
}

export interface UpdateClassPayload {
  name?: string;
  classTeacherId?: string | null;
}

export interface SectionResponse {
  success: boolean;
  message: string;
  data: ClassSection[];
}

export interface SectionResponseSingle {
  success: boolean;
  message: string;
  data: ClassSection;
}

export interface CreateSectionPayload {
  name: string;
  capacity?: number | null;
}

export interface UpdateSectionPayload {
  name?: string;
  capacity?: number | null;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    deleted: boolean;
  };
}
