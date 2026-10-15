"use client";

import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import DashboardHeader from "@/features/school/dashboard/components/DashboardHeader";
import SummaryCards from "@/features/school/dashboard/components/SummaryCards";
import AttendanceOverview from "@/features/school/dashboard/components/AttendanceOverview";
import AttendanceWeeklyChart from "@/features/school/dashboard/components/AttendanceWeeklyChart";
import AttendanceByClass from "@/features/school/dashboard/components/AttendanceByClass";
import FeeOverview from "@/features/school/dashboard/components/FeeOverview";
import FeeBreakdown from "@/features/school/dashboard/components/FeeBreakdown";
import AdmissionsOverview from "@/features/school/dashboard/components/AdmissionsOverview";
import UpcomingExams from "@/features/school/dashboard/components/UpcomingExams";
import UpcomingEvents from "@/features/school/dashboard/components/UpcomingEvents";
import TodaySchedule from "@/features/school/dashboard/components/TodaySchedule";
import OperationalAlerts from "@/features/school/dashboard/components/OperationalAlerts";
import LiveFeed from "@/features/school/dashboard/components/LiveFeed";
import Announcements from "@/features/school/dashboard/components/Announcements";
import ReportsAndActions from "@/features/school/dashboard/components/ReportsAndActions";
import { useSchoolDashboard } from "@/features/school/dashboard/hooks/useSchoolDashboard";

export default function SchoolDashboardPage() {
  const { data, isLoading, isError } = useSchoolDashboard();

  if (isLoading) {
    return <Loader text="Loading School Dashboard..." />;
  }

  if (isError) {
    return (
      <ErrorPage
        title="Unable to load School Dashboard"
        message="Please check your network connection and try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const dashboard = data?.data;

  if (!dashboard) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No dashboard data available for this institution.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-12">
      <DashboardHeader
        school={dashboard.school}
        academicYear={dashboard.academicYear}
      />
      <SummaryCards summary={dashboard.summary} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <TodaySchedule schedule={dashboard.todaySchedule} />

          {/* Attendance Hub (Today's Ratios + 7-Day Trend) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttendanceOverview attendance={dashboard.attendance} />
            <AttendanceWeeklyChart weekly={dashboard.attendance.weekly} />
          </div>

          {/* Class-wise Attendance Distribution */}
          <AttendanceByClass data={dashboard.attendance.byClass} />

          {/* Financials & Collections (Fee Overview + Category Breakdown) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeeOverview fees={dashboard.fees} />
            <FeeBreakdown data={dashboard.fees.breakdown} />
          </div>

          {/* Academic Milestones & Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdmissionsOverview admissions={dashboard.admissions} />
            <UpcomingExams exams={dashboard.upcomingExams} />
            <UpcomingEvents events={dashboard.upcomingEvents} />
          </div>
        </div>

        {/* === Right Sidebar Column: Actions, Alerts & Feeds (4 Columns) === */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions & 1-Click Standard Reports */}
          <ReportsAndActions
            reports={dashboard.reports}
            quickActions={dashboard.quickActions}
          />

          {/* Operational Alerts & Attention Notices */}
          <OperationalAlerts alerts={dashboard.operationalAlerts} />

          {/* Campus Announcements */}
          <Announcements announcements={dashboard.announcements} />

          {/* Live Campus Activity Stream */}
          <LiveFeed data={dashboard.liveFeed} />
        </div>
      </div>
    </div>
  );
}
