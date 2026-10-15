export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface DashboardData {
  schools: {
    total: number;
    active: number;
    inactive: number;
    trial: number;
    paid: number;
    suspended: number;
  };

  students: number;
  teachers: number;
  parents: number;
  users: number;

  plans: {
    total: number;
  };

  subscriptions: {
    active: number;
    expired: number;
    cancelled: number;
  };

  notifications: {
    total: number;
    unread: number;
  };

  revenue: {
    total: number;
    monthly: RevenueChartItem[];
  };

  growth: {
    schools: GrowthItem[];
    students: GrowthItem[];
    teachers: GrowthItem[];
  };
}

export interface GrowthItem {
  month: string;
  count: number;
}

export interface PlatformGrowthResponse {
  schools: GrowthItem[];
  students: GrowthItem[];
  teachers: GrowthItem[];
}

export interface RevenueChartItem {
  month: string;
  revenue: number;
}

export interface RevenueResponse {
  totalRevenue: number;
  revenue: RevenueChartItem[];
}
