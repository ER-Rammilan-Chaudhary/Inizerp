import type { UserRole } from "@/types/auth.types";

export const ROUTES = {
  public: {
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },

  dashboard: {
    superAdmin: "/super-admin/dashboard",
    schoolAdmin: "/school-admin/dashboard",
    teacher: "/teacher/dashboard",
    parent: "/parent/dashboard",
    student: "/student/dashboard",
  },
} as const;

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  SUPER_ADMIN: ROUTES.dashboard.superAdmin,
  SCHOOL_ADMIN: ROUTES.dashboard.schoolAdmin,
  TEACHER: ROUTES.dashboard.teacher,
  PARENT: ROUTES.dashboard.parent,
  STUDENT: ROUTES.dashboard.student,
};

export const getDashboardRoute = (role: UserRole): string => {
  return ROLE_DASHBOARDS[role];
};
