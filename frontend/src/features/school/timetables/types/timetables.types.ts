export type TimetableDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface TimetableAcademicYear {
  id: string;
  name: string;
  code: string;
}

export interface TimetableClass {
  id: string;
  name: string;
}

export interface TimetableSection {
  id: string;
  name: string;
}

export interface TimetableSubject {
  id: string;
  name: string;
  code: string;
}

export interface TimetableTeacherUser {
  id: string;
  fullName: string;
  email: string;
}

export interface TimetableTeacher {
  id: string;
  employeeId: string;
  designation: string | null;
  user: TimetableTeacherUser;
}

export interface Timetable {
  id: string;
  schoolId: string;
  academicYearId: string | null;
  classId: string;
  sectionId: string | null;
  subjectId: string;
  teacherId: string;
  day: TimetableDay;
  startTime: string;
  endTime: string;
  period: number;
  roomNo: string | null;
  createdAt: string;
  updatedAt: string;
  academicYear: TimetableAcademicYear | null;
  class: TimetableClass;
  section: TimetableSection | null;
  subject: TimetableSubject;
  teacher: TimetableTeacher;
}

export interface TimetablePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TimetableListResponse {
  data: Timetable[];
  pagination: TimetablePagination;
}

export interface TimetableListParams {
  page?: number;
  limit?: number;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  teacherId?: string;
  subjectId?: string;
  day?: TimetableDay;
  period?: number;
}

export interface CreateTimetablePayload {
  academicYearId?: string | null;
  classId: string;
  sectionId?: string | null;
  subjectId: string;
  teacherId: string;
  day: TimetableDay;
  startTime: string;
  endTime: string;
  period: number;
  roomNo?: string | null;
}

export interface UpdateTimetablePayload {
  academicYearId?: string | null;
  classId?: string;
  sectionId?: string | null;
  subjectId?: string;
  teacherId?: string;
  day?: TimetableDay;
  startTime?: string;
  endTime?: string;
  period?: number;
  roomNo?: string | null;
}

export type PeriodType = "REGULAR" | "BREAK" | "LUNCH";

export interface PeriodMasterItem {
  id: string;
  periodNumber?: number | null;
  name: string;
  type: PeriodType;
  startTime: string;
  endTime: string;
}

export interface SavePeriodsPayload {
  periods: PeriodMasterItem[];
}

export interface AddPeriodPayload {
  periodNumber?: number | null;
  name: string;
  type: PeriodType;
  startTime: string;
  endTime: string;
}

