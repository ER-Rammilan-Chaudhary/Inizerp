

"use client";
import Link from "next/link";
import { ResponsiveContainer, PieChart, Pie, Cell, } from "recharts";

interface SubscriptionData { total: number; active: number; trial: number; expired: number; cancelled: number; }
interface Props { data?: SubscriptionData; }


export default function Subscription({ data }: Props) {
    if (!data) {
        return (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex h-[360px] items-center justify-center text-muted-foreground">
                    Loading...
                </div>
            </div>
        );
    }

    const legendData = [
        { name: "Active", value: data.active ?? 0, color: "#22c55e", },
        { name: "Expiring Soon", value: data.trial ?? 0, color: "#f59e0b", },
        { name: "Expired", value: data.expired ?? 0, color: "#ef4444", },
        { name: "Cancelled", value: data.cancelled ?? 0, color: "#94a3b8", }

    ];
    const pieData = legendData.filter((item) => item.value > 0);
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Subscription</h2>
                    <p className="text-sm text-muted-foreground">Subscription Overview</p>
                </div>
                <Link
                    href="/super-admin/subscriptions"
                    className="rounded-lg border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted">View All
                </Link>
            </div>

            {/* Chart + Legend */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Donut */}
                <div className="relative flex h-[280px] items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                innerRadius={75}
                                outerRadius={105}
                                paddingAngle={2}
                                stroke="hsl(var(--background))"
                                strokeWidth={4}
                            >
                                {pieData.map((item) => (
                                    <Cell
                                        key={item.name}
                                        fill={item.color}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                        <h2 className="text-5xl font-bold">{data.total}</h2>

                        <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                </div>

                {/* Legend */}
                <div className="w-56 space-y-5">
                    {legendData.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        backgroundColor: item.color,
                                    }}
                                />
                                <span className="text-sm font-medium text-foreground">{item.name}</span>
                            </div>
                            <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}