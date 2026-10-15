"use client";
import { Building2, GraduationCap, Users, IndianRupee, TrendingUp, UserCheck, } from "lucide-react";
import StatsCard from "./StatsCard";
import type { DashboardData } from "@/features/super-admin/dashboard/types/dashboard";
interface Props { data: DashboardData; }

export default function StatsGrid({ data }: Props) {
  return (
    <section className="grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

      <StatsCard
        title="Schools"
        value={data.schools.total}
        subtitle={`${data.schools.active} Active`}
        icon={Building2}
        color="bg-blue-600"
      />

      <StatsCard
        title="Students"
        value={data.students}
        subtitle="Registered"
        icon={GraduationCap}
        color="bg-emerald-600"
      />

      <StatsCard
        title="Teachers"
        value={data.teachers}
        subtitle="Teaching Staff"
        icon={Users}
        color="bg-violet-600"
      />

      <StatsCard
        title="Revenue"
        value={`₹ ${data.revenue.total.toLocaleString("en-IN")}`}
        subtitle="Total Revenue"
        icon={IndianRupee}
        color="bg-orange-600"
      />


      <StatsCard
        title="Growth"
        value={data.growth.schools.reduce(
          (sum, item) => sum + item.count,
          0
        )}
        subtitle="Schools Added"
        icon={TrendingUp}
        color="bg-cyan-600"
      />

      <StatsCard
        title="Users"
        value={data.users}
        subtitle="Platform Users"
        icon={UserCheck}
        color="bg-rose-600"
      />

    </section>
  );
}