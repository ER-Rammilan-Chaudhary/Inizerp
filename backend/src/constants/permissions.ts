export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",

  STUDENTS_VIEW: "students.view",
  STUDENTS_CREATE: "students.create",
  STUDENTS_UPDATE: "students.update",
  STUDENTS_DELETE: "students.delete",

  TEACHERS_VIEW: "teachers.view",
  TEACHERS_CREATE: "teachers.create",
  TEACHERS_UPDATE: "teachers.update",
  TEACHERS_DELETE: "teachers.delete",

  PARENTS_VIEW: "parents.view",
  PARENTS_CREATE: "parents.create",
  PARENTS_UPDATE: "parents.update",
  PARENTS_DELETE: "parents.delete",

  STAFF_VIEW: "staff.view",
  STAFF_CREATE: "staff.create",
  STAFF_UPDATE: "staff.update",
  STAFF_DELETE: "staff.delete",

  ATTENDANCE_VIEW: "attendance.view",
  ATTENDANCE_CREATE: "attendance.create",
  ATTENDANCE_UPDATE: "attendance.update",

  EXAMS_VIEW: "exams.view",
  EXAMS_CREATE: "exams.create",
  EXAMS_UPDATE: "exams.update",
  EXAMS_DELETE: "exams.delete",

  FEES_VIEW: "fees.view",
  FEES_CREATE: "fees.create",
  FEES_UPDATE: "fees.update",
  FEES_DELETE: "fees.delete",

  HOMEWORK_VIEW: "homework.view",
  HOMEWORK_CREATE: "homework.create",
  HOMEWORK_UPDATE: "homework.update",
  HOMEWORK_DELETE: "homework.delete",

  LIBRARY_VIEW: "library.view",
  LIBRARY_CREATE: "library.create",
  LIBRARY_UPDATE: "library.update",
  LIBRARY_DELETE: "library.delete",

  TRANSPORT_VIEW: "transport.view",
  TRANSPORT_CREATE: "transport.create",
  TRANSPORT_UPDATE: "transport.update",
  TRANSPORT_DELETE: "transport.delete",

  NOTIFICATIONS_VIEW: "notifications.view",
  NOTIFICATIONS_CREATE: "notifications.create",
  NOTIFICATIONS_UPDATE: "notifications.update",
  NOTIFICATIONS_DELETE: "notifications.delete",

  SETTINGS_VIEW: "settings.view",
  SETTINGS_UPDATE: "settings.update",

  AUDIT_LOGS_VIEW: "audit_logs.view",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
