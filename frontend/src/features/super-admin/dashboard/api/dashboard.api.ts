import client from "@/api/client";

import type { DashboardResponse } from "@/features/super-admin/dashboard/types/dashboard";

export const getDashboard = async () => {
  const { data } = await client.get<DashboardResponse>(
    "/super-admin/dashboard",
  );
  return data.data;
};

export const getDashboardCharts = async () => {
  const { data } = await client.get("/super-admin/dashboard/charts");

  return data.data;
};

export const getRecentSchools = async () => {
  const { data } = await client.get("/super-admin/dashboard/recent-schools");

  return data.data;
};

export const getRecentNotifications = async () => {
  const { data } = await client.get(
    "/super-admin/dashboard/recent-notifications",
  );

  return data.data;
};

export const getRevenueStats = async () => {
  const { data } = await client.get("/super-admin/dashboard/revenue");

  return data.data;
};

export const getTopSchools = async () => {
  const { data } = await client.get("/super-admin/dashboard/top-schools");

  return data.data;
};

export const getRecentActivities = async () => {
  const { data } = await client.get("/super-admin/dashboard/recent-activities");

  return data.data;
};

export const getSubscriptionOverview = async () => {
  const { data } = await client.get("/super-admin/dashboard/subscription");
  return data.data;
};

export const getPlatformGrowth = async () => {
  const { data } = await client.get("/super-admin/dashboard/platform-growth");
  return data.data;
};

export const getExpiringSubscriptions = async () => {
  const { data } = await client.get(
    "/super-admin/dashboard/expiring-subscriptions",
  );

  return data.data;
};

export const getSystemHealth = async () => {
  const { data } = await client.get("/super-admin/dashboard/system-health");

  return data.data;
};
