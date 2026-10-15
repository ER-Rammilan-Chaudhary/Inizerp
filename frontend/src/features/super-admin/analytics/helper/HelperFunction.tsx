
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, } from "recharts";
import { TrendingUp, } from "lucide-react";


const formatNumber = (value: number) => new Intl.NumberFormat("en-IN").format(value);

const formatCurrency = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;



export function AnalyticsStatCard({ title, value, icon: Icon, color, }: {
    title: string; value: string | number; icon: React.ElementType;
    color: "blue" | "violet" | "emerald" | "orange";
}) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
        violet:
            "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
        emerald:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
        orange:
            "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
    };

    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                    {title}
                </p>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight">
                {value}
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                Platform metric
            </div>
        </div>
    );
}

export function MiniStat({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className={`rounded-lg bg-muted p-2.5 ${color}`}>
                <Icon className="h-5 w-5" />
            </div>

            <div>
                <p className="text-xs text-muted-foreground">
                    {title}
                </p>

                <p className="mt-1 text-lg font-bold">
                    {formatNumber(value)}
                </p>
            </div>
        </div>
    );
}

export function ChartCard({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                </div>

                <h3 className="font-semibold">
                    {title}
                </h3>
            </div>

            {children}
        </div>
    );
}

export function GrowthChart({
    data,
    color,
}: {
    data: { month: string; value: number }[];
    color: string;
}) {
    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id={`growth-${color.replace("#", "")}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={color}
                                stopOpacity={0.25}
                            />
                            <stop
                                offset="100%"
                                stopColor={color}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                    />

                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                    />

                    <Tooltip
                        contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2.5}
                        fill={`url(#growth-${color.replace("#", "")})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function RevenueChart({
    data,
}: {
    data: { month: string; amount: number }[];
}) {
    return (
        <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                    />

                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                    />

                    <Tooltip
                        formatter={(value) => [
                            formatCurrency(Number(value)),
                            "Revenue",
                        ]}
                        contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                        }}
                    />

                    <Bar
                        dataKey="amount"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function RevenueCard({
    title,
    value,
    primary = false,
    muted = false,
}: {
    title: string;
    value: number;
    primary?: boolean;
    muted?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border p-5 shadow-sm ${primary
                ? "border-primary/20 bg-primary/[0.04]"
                : "bg-card"
                }`}
        >
            <p className="text-sm text-muted-foreground">
                {title}
            </p>

            <p
                className={`mt-2 text-xl font-bold ${muted ? "text-muted-foreground" : ""
                    }`}
            >
                {formatCurrency(value)}
            </p>
        </div>
    );
}

export function StatusBox({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: "amber" | "emerald" | "red" | "orange" | "slate";
}) {
    const styles = {
        amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
        emerald:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
        red: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
        orange:
            "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
        slate:
            "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
    };

    return (
        <div className={`rounded-xl p-4 ${styles[color]}`}>
            <p className="text-xs font-medium opacity-80">
                {label}
            </p>

            <p className="mt-2 text-xl font-bold">
                {value}
            </p>
        </div>
    );
}

export function AnalyticsValue({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon?: React.ElementType;
}) {
    return (
        <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    {label}
                </span>

                {Icon && (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                )}
            </div>

            <p className="mt-2 text-xl font-bold">
                {formatNumber(value)}
            </p>
        </div>
    );
}

export function NotificationList({
    items,
}: {
    items: [string, number][];
}) {
    const max = Math.max(...items.map(([, value]) => value), 1);

    return (
        <div className="space-y-4">
            {items.map(([label, value]) => (
                <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {label}
                        </span>

                        <span className="font-semibold">
                            {formatNumber(value)}
                        </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                                width: `${(value / max) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SectionHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div>
            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

export function AnalyticsSkeleton() {
    return (
        <div className="space-y-6 p-6">
            <div className="h-16 animate-pulse rounded-xl bg-muted" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-32 animate-pulse rounded-2xl bg-muted"
                    />
                ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-[350px] animate-pulse rounded-2xl bg-muted"
                    />
                ))}
            </div>
        </div>
    );
}
