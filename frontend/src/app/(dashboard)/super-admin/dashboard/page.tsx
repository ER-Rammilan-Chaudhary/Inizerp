"use client";

import StatsCard from "@/components/dashboard/cards/StatsCard";
import RevenueChart from "@/components/dashboard/charts/RevenueChart";
import RecentSchoolsTable from "@/components/dashboard/tables/RecentSchoolsTable";
import RecentUsersTable from "@/components/dashboard/tables/RecentUsersTable";
import { School, Users, IndianRupee, CreditCard, }from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Schools"
          value="128"
          growth="+12% This Month"
          icon={School}
          color="bg-blue-600"
        />

        <StatsCard
          title="Users"
          value="4,250"
          growth="+8% This Month"
          icon={Users}
          color="bg-green-600"
        />

        <StatsCard
          title="Revenue"
          value="₹8.5L"
          growth="+18% This Month"
          icon={IndianRupee}
          color="bg-orange-500"
        />

        <StatsCard
          title="Subscriptions"
          value="98"
          growth="95 Active"
          icon={CreditCard}
          color="bg-purple-600"
        />

      </div>

           {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <RevenueChart />

        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Quick Stats
          </h2>

          <div className="mt-6 space-y-6">

            <div>

              <p className="text-sm text-muted-foreground">
                Active Schools
              </p>

              <h3 className="mt-1 text-3xl font-bold">
                128
              </h3>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                New Users
              </p>

              <h3 className="mt-1 text-3xl font-bold">
                214
              </h3>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Revenue
              </p>

              <h3 className="mt-1 text-3xl font-bold">
                ₹8.5L
              </h3>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Active Plans
              </p>

              <h3 className="mt-1 text-3xl font-bold">
                95
              </h3>

            </div>

          </div>

        </div>

      </div>

{/* RecentSchoolsTable */}
      <RecentSchoolsTable />
      
      {/*   <RecentUsersTable /> */}
        <RecentUsersTable />

    </div>
  );
}