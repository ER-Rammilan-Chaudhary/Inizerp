// AnalyticsOverview
export interface AnalyticsOverview {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalNotifications: number;
  totalRevenue: number;
}
// SubscriptionAnalytics
export interface SubscriptionAnalytics {
  trial: number;
  active: number;
  expired: number;
  suspended: number;
  cancelled: number;
}

// RevenueAnalytics
export interface RevenueAnalytics {
  amount: number;
  discount: number;
  tax: number;
  finalAmount: number;
}

// GrowthData
export interface GrowthData {
  month: number;
  count: number;
}

// MonthlyRevenue
export interface MonthlyRevenue {
  month: number;
  amount: number;
}

// SchoolAnalytics
export interface SchoolAnalytics {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  trial: number;
  paid: number;
}

// user Analytics
export interface UserAnalytics {
  total: number;

  roles: {
    superAdmins: number;
    schoolAdmins: number;
    teachers: number;
    students: number;
    parents: number;
  };
}

// notification
export interface NotificationAnalytics {
  total: number;
  draft: number;
  scheduled: number;
  sent: number;
  expired: number;
  cancelled: number;

  scopes: {
    global: number;
    school: number;
    admin: number;
    teacher: number;
    student: number;
    parent: number;
  };

  types: {
    system: number;
    announcement: number;
    emergency: number;
    exam: number;
    fees: number;
    homework: number;
    attendance: number;
  };
}
