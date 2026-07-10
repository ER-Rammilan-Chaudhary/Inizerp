"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", revenue: 20000 },
  { month: "Feb", revenue: 28000 },
  { month: "Mar", revenue: 25000 },
  { month: "Apr", revenue: 42000 },
  { month: "May", revenue: 51000 },
  { month: "Jun", revenue: 62000 },
  { month: "Jul", revenue: 70000 },
  { month: "Aug", revenue: 76000 },
  { month: "Sep", revenue: 85000 },
  { month: "Oct", revenue: 94000 },
  { month: "Nov", revenue: 99000 },
  { month: "Dec", revenue: 115000 },
];

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold">
            Revenue Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Monthly Revenue Overview
          </p>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600 dark:bg-green-900 dark:text-green-300">
          +18%
        </span>
      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}