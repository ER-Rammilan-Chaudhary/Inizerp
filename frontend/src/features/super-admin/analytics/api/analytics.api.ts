import api from "@/api/client";

import {
  AnalyticsOverview,
  SubscriptionAnalytics,
  RevenueAnalytics,
  GrowthData,
  MonthlyRevenue,
  SchoolAnalytics,
  UserAnalytics,
  NotificationAnalytics,
} from "@/features/super-admin/analytics/types/analytics.types";

const ENDPOINT = "/super-admin/analytics";

export const analyticsApi = {
  // =========================
  // OVERVIEW
  // =========================

  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await api.get(`${ENDPOINT}/overview`);
    return response.data.data;
  },

  // =========================
  // SUBSCRIPTIONS
  // =========================

  getSubscriptions: async (): Promise<SubscriptionAnalytics> => {
    const response = await api.get(`${ENDPOINT}/subscriptions`);
    return response.data.data;
  },

  // =========================
  // REVENUE
  // =========================

  getRevenue: async (): Promise<RevenueAnalytics> => {
    const response = await api.get(`${ENDPOINT}/revenue`);
    return response.data.data;
  },

  getMonthlyRevenue: async (year?: number): Promise<MonthlyRevenue[]> => {
    const response = await api.get(`${ENDPOINT}/revenue/monthly`, {
      params: { year },
    });

    return response.data.data;
  },

  // =========================
  // SCHOOLS
  // =========================

  getSchools: async (): Promise<SchoolAnalytics> => {
    const response = await api.get(`${ENDPOINT}/schools`);
    return response.data.data;
  },

  getSchoolGrowth: async (year?: number): Promise<GrowthData[]> => {
    const response = await api.get(`${ENDPOINT}/schools/growth`, {
      params: { year },
    });

    return response.data.data;
  },

  // =========================
  // STUDENTS
  // =========================

  getStudentGrowth: async (year?: number): Promise<GrowthData[]> => {
    const response = await api.get(`${ENDPOINT}/students/growth`, {
      params: { year },
    });

    return response.data.data;
  },

  // =========================
  // TEACHERS
  // =========================

  getTeacherGrowth: async (year?: number): Promise<GrowthData[]> => {
    const response = await api.get(`${ENDPOINT}/teachers/growth`, {
      params: { year },
    });

    return response.data.data;
  },

  // =========================
  // USERS
  // =========================

  getUsers: async (): Promise<UserAnalytics> => {
    const response = await api.get(`${ENDPOINT}/users`);
    return response.data.data;
  },

  getUserGrowth: async (year?: number): Promise<GrowthData[]> => {
    const response = await api.get(`${ENDPOINT}/users/growth`, {
      params: { year },
    });

    return response.data.data;
  },

  // =========================
  // SUBSCRIPTION GROWTH
  // =========================

  getSubscriptionGrowth: async (year?: number): Promise<GrowthData[]> => {
    const response = await api.get(`${ENDPOINT}/subscriptions/growth`, {
      params: { year },
    });

    return response.data.data;
  },

  // =========================
  // NOTIFICATIONS
  // =========================

  getNotifications: async (): Promise<NotificationAnalytics> => {
    const response = await api.get(`${ENDPOINT}/notifications`);
    return response.data.data;
  },
};
