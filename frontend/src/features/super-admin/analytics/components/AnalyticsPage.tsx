"use client";

import { Activity, Bell, Building2, CheckCircle2, GraduationCap, IndianRupee, Users, UserCheck, UserCog, UserRound, CreditCard, TrendingUp, AlertCircle, } from "lucide-react";
import { useState } from "react";
import { useAnalyticsOverview, useSubscriptionAnalytics, useRevenueAnalytics, useMonthlyRevenue, useSchoolAnalytics, useSchoolGrowth, useStudentGrowth, useTeacherGrowth, useUserAnalytics, useUserGrowth, useSubscriptionGrowth, useNotificationAnalytics, } from "@/features/super-admin/analytics/hooks/useAnalytics";
import { AnalyticsStatCard, MiniStat, ChartCard, GrowthChart, RevenueChart, RevenueCard, StatusBox, AnalyticsValue, NotificationList, SectionHeader } from '../helper/HelperFunction'
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";


const currentYear = new Date().getFullYear();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];

const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-IN").format(value);

const growthData = (
    data?: { month: number; count: number }[],
) =>
    (data ?? []).map((item) => ({
        month: MONTHS[item.month - 1] ?? item.month,
        value: item.count,
    }));

const revenueChartData = (
    data?: { month: number; amount: number }[],
) =>
    (data ?? []).map((item) => ({
        month: MONTHS[item.month - 1] ?? item.month,
        amount: item.amount,
    }));

export default function AnalyticsPage() {
    const [year, setYear] = useState(currentYear);
    const overview = useAnalyticsOverview();
    const subscriptions = useSubscriptionAnalytics();
    const revenue = useRevenueAnalytics();
    const monthlyRevenue = useMonthlyRevenue(year);
    const schools = useSchoolAnalytics();
    const schoolGrowth = useSchoolGrowth(year);
    const studentGrowth = useStudentGrowth(year);
    const teacherGrowth = useTeacherGrowth(year);
    const users = useUserAnalytics();
    const userGrowth = useUserGrowth(year);
    const subscriptionGrowth = useSubscriptionGrowth(year);
    const notifications = useNotificationAnalytics();



    const isLoading = overview.isLoading || subscriptions.isLoading || revenue.isLoading || monthlyRevenue.isLoading || schools.isLoading || schoolGrowth.isLoading || studentGrowth.isLoading || teacherGrowth.isLoading || users.isLoading || userGrowth.isLoading || subscriptionGrowth.isLoading || notifications.isLoading;
    const queries = [overview, subscriptions, revenue, monthlyRevenue, schools, schoolGrowth, studentGrowth, teacherGrowth, users, userGrowth, subscriptionGrowth, notifications,];
    const error = queries.find((query) => query.isError)?.error;

    // loading
    if (isLoading) {
        return <Loader text="Analytics data Loading..." />;
    }

    // error
    if (error) {
        return (
            <ErrorPage
                title="Failed to load analytics"
                message={error instanceof Error ? error.message : "Please try again in a moment."}
                onRetry={() => window.location.reload()}
            />
        );
    }


    const overviewData = overview.data;
    const subscriptionData = subscriptions.data;
    const revenueData = revenue.data;
    const schoolData = schools.data;
    const userData = users.data;
    const notificationData = notifications.data;

    return (
        <div className="mx-auto max-w space-y-6 pb-10">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <Activity className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Analytics
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                Platform performance and growth overview
                            </p>
                        </div>
                    </div>
                </div>

                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="h-10 rounded-lg border bg-background px-4 text-sm font-medium outline-none transition focus:ring-2 focus:ring-primary/20">

                    {Array.from({ length: 5 }, (_, index) => {
                        const value = currentYear - index;
                        return (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* ================================================= */}
            {/* KPI CARDS */}
            {/* ================================================= */}

            {overviewData && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <AnalyticsStatCard
                        title="Total Schools"
                        value={formatNumber(overviewData.totalSchools)}
                        icon={Building2}
                        color="blue"
                    />

                    <AnalyticsStatCard
                        title="Total Students"
                        value={formatNumber(overviewData.totalStudents)}
                        icon={GraduationCap}
                        color="violet"
                    />

                    <AnalyticsStatCard
                        title="Total Teachers"
                        value={formatNumber(overviewData.totalTeachers)}
                        icon={UserCheck}
                        color="emerald"
                    />

                    <AnalyticsStatCard
                        title="Total Users"
                        value={formatNumber(overviewData.totalUsers)}
                        icon={Users}
                        color="orange"
                    />

                </div>
            )}

            {/* ================================================= */}
            {/* SECONDARY KPI */}
            {/* ================================================= */}

            {overviewData && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <MiniStat
                        title="Active Schools"
                        value={overviewData.activeSchools}
                        icon={CheckCircle2}
                        color="text-emerald-600"
                    />

                    <MiniStat
                        title="Active Subscriptions"
                        value={overviewData.activeSubscriptions}
                        icon={CreditCard}
                        color="text-blue-600"
                    />

                    <MiniStat
                        title="Expired Subscriptions"
                        value={overviewData.expiredSubscriptions}
                        icon={AlertCircle}
                        color="text-red-600"
                    />

                    <MiniStat
                        title="Notifications"
                        value={overviewData.totalNotifications}
                        icon={Bell}
                        color="text-violet-600"
                    />

                </div>
            )}

            {/* ================================================= */}
            {/* GROWTH */}
            {/* ================================================= */}

            <SectionHeader
                title="Growth Overview"
                description={`Platform growth during ${year}`}
            />

            <div className="grid gap-5 lg:grid-cols-2">

                <ChartCard
                    title="School Growth"
                    icon={Building2}
                >
                    <GrowthChart
                        data={growthData(schoolGrowth.data)}
                        color="#2563eb"
                    />
                </ChartCard>

                <ChartCard
                    title="Student Growth"
                    icon={GraduationCap}
                >
                    <GrowthChart
                        data={growthData(studentGrowth.data)}
                        color="#7c3aed"
                    />
                </ChartCard>

                <ChartCard
                    title="Teacher Growth"
                    icon={UserCheck}
                >
                    <GrowthChart
                        data={growthData(teacherGrowth.data)}
                        color="#059669"
                    />
                </ChartCard>

                <ChartCard
                    title="User Growth"
                    icon={Users}
                >
                    <GrowthChart
                        data={growthData(userGrowth.data)}
                        color="#ea580c"
                    />
                </ChartCard>

            </div>

            {/* ================================================= */}
            {/* REVENUE */}
            {/* ================================================= */}

            <SectionHeader
                title="Revenue"
                description={`Revenue performance for ${year}`}
            />

            {revenueData && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <RevenueCard
                        title="Total Amount"
                        value={revenueData.amount}
                    />

                    <RevenueCard
                        title="Discount"
                        value={revenueData.discount}
                        muted
                    />

                    <RevenueCard
                        title="Tax"
                        value={revenueData.tax}
                    />

                    <RevenueCard
                        title="Final Revenue"
                        value={revenueData.finalAmount}
                        primary
                    />

                </div>
            )}

            <ChartCard
                title={`Monthly Revenue - ${year}`}
                icon={IndianRupee}
            >
                <RevenueChart
                    data={revenueChartData(monthlyRevenue.data)}
                />
            </ChartCard>

            {/* ================================================= */}
            {/* SUBSCRIPTIONS */}
            {/* ================================================= */}

            <div className="grid gap-5 xl:grid-cols-2">

                {subscriptionData && (
                    <ChartCard
                        title="Subscription Analytics"
                        icon={CreditCard}
                    >
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                            <StatusBox
                                label="Trial"
                                value={subscriptionData.trial}
                                color="amber"
                            />

                            <StatusBox
                                label="Active"
                                value={subscriptionData.active}
                                color="emerald"
                            />

                            <StatusBox
                                label="Expired"
                                value={subscriptionData.expired}
                                color="red"
                            />

                            <StatusBox
                                label="Suspended"
                                value={subscriptionData.suspended}
                                color="orange"
                            />

                            <StatusBox
                                label="Cancelled"
                                value={subscriptionData.cancelled}
                                color="slate"
                            />
                        </div>
                    </ChartCard>
                )}

                <ChartCard
                    title={`Subscription Growth - ${year}`}
                    icon={TrendingUp}
                >
                    <GrowthChart
                        data={growthData(subscriptionGrowth.data)}
                        color="#0f766e"
                    />
                </ChartCard>

            </div>

            {/* ================================================= */}
            {/* SCHOOL + USERS */}
            {/* ================================================= */}

            <div className="grid gap-5 xl:grid-cols-2">

                {schoolData && (
                    <ChartCard
                        title="School Analytics"
                        icon={Building2}
                    >
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <AnalyticsValue
                                label="Total"
                                value={schoolData.total}
                            />

                            <AnalyticsValue
                                label="Active"
                                value={schoolData.active}
                            />

                            <AnalyticsValue
                                label="Inactive"
                                value={schoolData.inactive}
                            />

                            <AnalyticsValue
                                label="Verified"
                                value={schoolData.verified}
                            />

                            <AnalyticsValue
                                label="Unverified"
                                value={schoolData.unverified}
                            />

                            <AnalyticsValue
                                label="Trial"
                                value={schoolData.trial}
                            />

                            <AnalyticsValue
                                label="Paid"
                                value={schoolData.paid}
                            />
                        </div>
                    </ChartCard>
                )}

                {userData && (
                    <ChartCard
                        title="User Analytics"
                        icon={Users}
                    >
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                            <AnalyticsValue
                                label="Total"
                                value={userData.total}
                            />
                            <AnalyticsValue
                                label="Super Admins"
                                value={userData.roles.superAdmins}
                                icon={UserCog}
                            />

                            <AnalyticsValue
                                label="School Admins"
                                value={userData.roles.schoolAdmins}
                                icon={UserCog}
                            />

                            <AnalyticsValue
                                label="Teachers"
                                value={userData.roles.teachers}
                                icon={UserCheck}
                            />

                            <AnalyticsValue
                                label="Students"
                                value={userData.roles.students}
                                icon={GraduationCap}
                            />

                            <AnalyticsValue
                                label="Parents"
                                value={userData.roles.parents}
                                icon={UserRound}
                            />

                        </div>
                    </ChartCard>
                )}

            </div>

            {/* ================================================= */}
            {/* NOTIFICATIONS */}
            {/* ================================================= */}

            {notificationData && (
                <>
                    <SectionHeader
                        title="Notification Analytics"
                        description="Notification status, audience and type distribution"
                    />

                    <div className="grid gap-5 xl:grid-cols-3">

                        <ChartCard
                            title="Notification Status"
                            icon={Bell}
                        >
                            <NotificationList
                                items={[
                                    ["Total", notificationData.total],
                                    ["Draft", notificationData.draft],
                                    ["Scheduled", notificationData.scheduled],
                                    ["Sent", notificationData.sent],
                                    ["Expired", notificationData.expired],
                                    ["Cancelled", notificationData.cancelled],
                                ]}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Notification Types"
                            icon={Activity}
                        >
                            <NotificationList
                                items={[
                                    ["System", notificationData.types.system],
                                    ["Announcement", notificationData.types.announcement],
                                    ["Emergency", notificationData.types.emergency],
                                    ["Exam", notificationData.types.exam],
                                    ["Fees", notificationData.types.fees],
                                    ["Homework", notificationData.types.homework],
                                    ["Attendance", notificationData.types.attendance],
                                ]}
                            />
                        </ChartCard>

                    </div>
                </>
            )}
        </div>
    );
}