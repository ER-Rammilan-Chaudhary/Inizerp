
export interface SchoolInfo {
  id: string;
  code: string;
  name: string;
  slug: string;
  logo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  timezone: string;
  currency: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface SchoolSummary {
  students: number;
  teachers: number;
  parents: number;
  staff: number;
  classes: number;
  sections: number;
  subjects: number;
}

export interface AcademicYear {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
}

export interface AttendanceToday {
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
  percentage: number;
}

export interface AttendanceWeeklyItem {
  date: string;
  day: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
  percentage: number;
}

export interface AttendanceByClassItem {
  classId: string;
  className: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
  percentage: number;
}

export interface AttendanceStatistics {
  weeklyAverage: number;
  highest: number;
}

export interface AttendanceData extends AttendanceToday {
  date: string;
  today: AttendanceToday;
  weekly: AttendanceWeeklyItem[];
  byClass: AttendanceByClassItem[];
  statistics: AttendanceStatistics;
}

export interface FeeSummary {
  target: number;
  paid: number;
  pending: number;
  overdue: number;
  overdueCount: number;
  realizationPercentage: number;
}

export interface FeeBreakdownItem {
  name: string;
  amount: number;
  paid: number;
  pending: number;
  percentage: number;
}

export interface FeeData {
  total: number;
  paid: number;
  pending: number;
  summary: FeeSummary;
  breakdown: FeeBreakdownItem[];
}

export interface AdmissionsData {
  pending: number;
}

export interface UpcomingExam {
  id: string;
  name: string;
  examType: string;
  startDate: string;
  endDate: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  publishedAt: string | null;
  expiresAt: string | null;
}

export interface TodayScheduleItem {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
  roomNo: string | null;
  class: {
    id: string;
    name: string;
  } | null;
  section: {
    id: string;
    name: string;
  } | null;
  subject: {
    id: string;
    name: string;
    code: string | null;
  } | null;
  teacher: {
    id: string;
    employeeId: string | null;
    designation: string | null;
    user: {
      id: string;
      fullName: string;
    } | null;
  } | null;
  status: string;
}

export interface OperationalAlert {
  type: string;
  priority: string;
  title: string;
  count: number;
  amount?: number;
  percentage?: number;
  message: string;
}

export interface LiveFeedItem {
  id: string;
  type: string;
  title: string;
  description: string;
  amount?: number;
  status?: string;
  method?: string;
  priority?: string;
  timestamp: string;
}

export interface DashboardReport {
  key: string;
  title: string;
  type: string;
  available: boolean;
}

export interface QuickAction {
  key: string;
  title: string;
}

export interface SchoolDashboardData {
  school: SchoolInfo;
  summary: SchoolSummary;
  academicYear: AcademicYear | null;
  attendance: AttendanceData;
  fees: FeeData;
  admissions: AdmissionsData;
  todaySchedule: TodayScheduleItem[];
  upcomingExams: UpcomingExam[];
  upcomingEvents: UpcomingEvent[];
  operationalAlerts: OperationalAlert[];
  liveFeed: LiveFeedItem[];
  announcements: Announcement[];
  reports: DashboardReport[];
  quickActions: QuickAction[];
}

export interface SchoolDashboardResponse {
  success: boolean;
  message: string;
  data: SchoolDashboardData;
}

export interface SchoolEnabledModulesResponse {
  success: boolean;
  message: string;
  data: string[];
}
