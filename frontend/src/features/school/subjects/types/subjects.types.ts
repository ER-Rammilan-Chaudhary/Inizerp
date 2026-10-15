export interface SubjectTeacherUser {
  id: string;
  fullName: string;
  email: string;
}

export interface SubjectTeacher {
  id: string;
  employeeId: string;
  designation: string | null;
  user: SubjectTeacherUser;
}

export interface SubjectCounts {
  results: number;
  timetables: number;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  teachers: SubjectTeacher[];
  _count: SubjectCounts;
}

export interface SubjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateSubjectPayload {
  name: string;
  code: string;
  description?: string | null;
  teacherIds?: string[];
}

export interface UpdateSubjectPayload {
  name?: string;
  code?: string;
  description?: string | null;
  teacherIds?: string[];
}

export interface SubjectFormPayload {
  name: string;
  code: string;
  description: string | null;
  teacherIds: string[];
}

export interface SubjectsResponse {
  success: boolean;
  message: string;
  data: Subject[];
  pagination: SubjectPagination;
}

export interface SubjectResponse {
  success: boolean;
  message: string;
  data: Subject;
}

export interface DeleteSubjectResponse {
  success: boolean;
  message: string;
}
