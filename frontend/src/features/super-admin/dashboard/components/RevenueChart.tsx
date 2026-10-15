"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ReferenceDot,
} from "recharts";
import { IndianRupee, TrendingUp } from "lucide-react";

interface RevenueItem {
    month: string;
    revenue: number;
}

interface Props {
    data?: {
        totalRevenue: number;
        revenue: RevenueItem[];
    };
}

export default function RevenueChart({ data }: Props) {
    const currentMonth = new Intl.DateTimeFormat("en-IN", {
        month: "short",
    }).format(new Date());

    const currentMonthIndex =
        data?.revenue.findIndex(
            (item) => item.month === currentMonth
        ) ?? -1;

    const currentMonthRevenue =
        currentMonthIndex !== -1
            ? data?.revenue[currentMonthIndex]?.revenue ?? 0
            : 0;

    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                        Revenue ({currentMonth})
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Monthly Revenue
                    </p>
                </div>

                <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/20">
                    <IndianRupee
                        className="text-emerald-600 dark:text-emerald-400"
                        size={22}
                    />
                </div>
            </div>

            <div className="mb-6 flex items-end gap-3">
                <h3 className="text-4xl font-bold">
                    ₹ {currentMonthRevenue.toLocaleString("en-IN")}
                </h3>

                <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-emerald-600">
                    <TrendingUp size={16} />
                    Revenue
                </div>
            </div>

            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data?.revenue ?? []}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 10,
                            bottom: 20,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="revenueFill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#16a34a"
                                    stopOpacity={0.35}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#16a34a"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                `₹${(value / 1000).toFixed(0)}k`
                            }
                        />

                        <Tooltip
                            formatter={(value) => [
                                `₹${Number(value).toLocaleString("en-IN")}`,
                                "Revenue",
                            ]}
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#16a34a"
                            strokeWidth={3}
                            fill="url(#revenueFill)"
                            dot={{ r: 3 }}
                        />

                        {currentMonthIndex !== -1 && (
                            <>
                                <ReferenceLine
                                    x={currentMonth}
                                    stroke="#16a34a"
                                    strokeDasharray="4 4"
                                />

                                <ReferenceDot
                                    x={currentMonth}
                                    y={
                                        data?.revenue[currentMonthIndex]
                                            ?.revenue ?? 0
                                    }
                                    r={8}
                                    fill="#16a34a"
                                    stroke="#fff"
                                    strokeWidth={3}
                                />
                            </>
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}