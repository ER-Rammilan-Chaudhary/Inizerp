"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
interface GrowthItem { month: string; count: number; }
interface Props { schools: GrowthItem[]; students: GrowthItem[]; teachers: GrowthItem[]; }
// Color Mapping
const CHART_CONFIG = {
    schools: { label: "Schools", color: "#2563eb", },
    students: { label: "Students", color: "#16a34a", },
    teachers: { label: "Teachers", color: "#9333ea", },
};

const FILTER_OPTIONS = [
    { label: "1 Month", value: 1, },
    { label: "2 Months", value: 2, },
    { label: "3 Months", value: 3, },
    { label: "6 Months", value: 6, },
    { label: "1 Year", value: 12, },
];


export default function PlatformGrowth({ schools, students, teachers, }: Props) {
    const [range, setRange] = React.useState(12);

    const getMonthLabel = (date: Date) => {
        const month = date.toLocaleString("en-US", { month: "short" });

        return month === "Sep" ? "Sept" : month;
    };


    const chartData = React.useMemo(() => {
        const current = new Date();

        const selectedMonths = Array.from(
            { length: range },
            (_, index) => {
                const date = new Date(
                    current.getFullYear(),
                    current.getMonth() - (range - index - 1),
                    1
                );

                const month = getMonthLabel(date);

                return {
                    key: `${month} ${date.getFullYear()}`,
                    month,
                };
            }
        );

        return selectedMonths.map((item) => {
            const school =
                schools.find((x) => x.month === item.key)?.count ?? 0;

            const student =
                students.find((x) => x.month === item.key)?.count ?? 0;

            const teacher =
                teachers.find((x) => x.month === item.key)?.count ?? 0;

            return {
                month: item.month,
                schools: school,
                students: student,
                teachers: teacher,
            };
        });
    }, [schools, students, teachers, range]);

    return (

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                        Platform Growth
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Schools, Students & Teachers Growth
                    </p>
                </div>
                {/* Date Filter */}
                <select
                    value={range}
                    onChange={(e) =>
                        setRange(Number(e.target.value))
                    }
                    className="rounded-lg border bg-background px-3 py-2 text-sm"
                >
                    {
                        FILTER_OPTIONS.map(item => (

                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))
                    }
                </select>
            </div>
            {/* Legend */}
            <div className="mb-6 flex flex-wrap gap-6">
                {
                    Object.values(CHART_CONFIG).map(item => (
                        <div
                            key={item.label}
                            className="flex items-center gap-2 text-sm"
                        >
                            <span
                                className="h-3 w-3 rounded-full"
                                style={{ background: item.color }}
                            />
                            {item.label}
                        </div>
                    ))
                }
            </div>

            <div className="h-90">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <AreaChart
                        data={chartData}
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="schools"
                            name="Schools"
                            stroke={CHART_CONFIG.schools.color}
                            fill={CHART_CONFIG.schools.color}
                            fillOpacity={0.15}
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="students"
                            name="Students"
                            stroke={CHART_CONFIG.students.color}
                            fill={CHART_CONFIG.students.color}
                            fillOpacity={0.15}
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="teachers"
                            name="Teachers"
                            stroke={CHART_CONFIG.teachers.color}
                            fill={CHART_CONFIG.teachers.color}
                            fillOpacity={0.15}
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>


            </div>


        </section>

    );

}