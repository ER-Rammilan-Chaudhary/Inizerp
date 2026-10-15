import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";

export const useAnalyticsOverview = () =>
    useQuery({
        queryKey: ["analytics", "overview"],
        queryFn: analyticsApi.getOverview,
    });

export const useSubscriptionAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "subscriptions"],
        queryFn: analyticsApi.getSubscriptions,
    });

export const useRevenueAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "revenue"],
        queryFn: analyticsApi.getRevenue,
    });

export const useMonthlyRevenue = (year: number) =>
    useQuery({
        queryKey: ["analytics", "revenue", "monthly", year],
        queryFn: () => analyticsApi.getMonthlyRevenue(year),
    });

export const useSchoolAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "schools"],
        queryFn: analyticsApi.getSchools,
    });

export const useSchoolGrowth = (year: number) =>
    useQuery({
        queryKey: ["analytics", "schools", "growth", year],
        queryFn: () => analyticsApi.getSchoolGrowth(year),
    });

export const useStudentGrowth = (year: number) =>
    useQuery({
        queryKey: ["analytics", "students", "growth", year],
        queryFn: () => analyticsApi.getStudentGrowth(year),
    });

export const useTeacherGrowth = (year: number) =>
    useQuery({
        queryKey: ["analytics", "teachers", "growth", year],
        queryFn: () => analyticsApi.getTeacherGrowth(year),
    });

export const useUserAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "users"],
        queryFn: analyticsApi.getUsers,
    });

export const useUserGrowth = (year: number) =>
    useQuery({
        queryKey: ["analytics", "users", "growth", year],
        queryFn: () => analyticsApi.getUserGrowth(year),
    });

export const useSubscriptionGrowth = (year: number) =>
    useQuery({
        queryKey: ["analytics", "subscriptions", "growth", year],
        queryFn: () => analyticsApi.getSubscriptionGrowth(year),
    });

export const useNotificationAnalytics = () =>
    useQuery({
        queryKey: ["analytics", "notifications"],
        queryFn: analyticsApi.getNotifications,
    });