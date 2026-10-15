"use client";

import RecentSchools from "@/features/super-admin/dashboard/components/RecentSchools";
import StatsGrid from "@/features/super-admin/dashboard/components/StatsGrid";
import RevenueChart from "@/features/super-admin/dashboard/components/RevenueChart";
import PlatformGrowth from "@/features/super-admin/dashboard/components/PlatformGrowth";
import Subscription from "@/features/super-admin/dashboard/components/Subscription";
import RecentNotifications from "@/features/super-admin/dashboard/components/RecentNotifications";
import SummaryCards from "@/features/super-admin/dashboard/components/SummaryCards";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";

import { useDashboard } from "@/features/super-admin/dashboard/hooks/useDashboard";
import { useRecentSchools } from "@/features/super-admin/dashboard/hooks/useRecentSchools";
import { useSubscriptionOverview } from "@/features/super-admin/dashboard/hooks/useSubscriptionOverview";
import { useRevenue } from "@/features/super-admin/dashboard/hooks/useRevenue";
import { useNotifications } from "@/features/super-admin/dashboard/hooks/useNotifications";
import { usePlatformGrowth } from "@/features/super-admin/dashboard/hooks/usePlatformGrowth";


export default function DashboardPage() {

  const { data, isLoading, isError, error } = useDashboard();
  const { data: schools } = useRecentSchools();
  const { data: subscriptions } = useSubscriptionOverview();
  const { data: revenue } = useRevenue();
  const { data: notifications } = useNotifications();
  const { data: growth } = usePlatformGrowth();


  if (isLoading) {
    return (
      <Loader text="Loading dashboard..." />
    );
  }


  if (isError || !data) {
    return (
      <ErrorPage
        title="Unable to load subscriptions"
        message={error instanceof Error ? error.message : "Please try again in a moment."}
        onRetry={() => window.location.reload()}
      />
    );
  }


  return (

    <div className="mx-auto w-full space-y-6 pb-10">
      <StatsGrid data={data} />
      <PlatformGrowth
        schools={growth?.schools ?? []}
        students={growth?.students ?? []}
        teachers={growth?.teachers ?? []}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenue} />
        <Subscription data={subscriptions} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentNotifications
          data={notifications ?? []}
        />
        <RecentSchools
          data={schools}
        />
      </div>
      <SummaryCards
        users={data.users}
        plans={data.plans.total}
        notifications={data.notifications.unread}
        schools={data.schools.total}
      />
    </div>

  );

}