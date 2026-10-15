"use client";

import {
    CalendarDays,
    ClipboardCheck,
    GraduationCap,
    Users,
    Clock,
    UserCheck,
    Layers,
} from "lucide-react";

import type { ClassDetails as ClassDetailsType } from "../types/classes.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClassDetailsProps {
    classItem: ClassDetailsType;
}

export default function ClassDetails({ classItem }: ClassDetailsProps) {
    return (
        <div className="space-y-6">
            {/* Quick KPI Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-sm hover:shadow transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Class Name
                            </p>
                            <h3 className="text-xl font-bold truncate text-foreground mt-0.5">
                                {classItem.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Standard Level
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm hover:shadow transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Enrolled Students
                            </p>
                            <h3 className="text-2xl font-bold text-foreground mt-0.5">
                                {classItem.studentCount}
                            </h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Across all active sections
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm hover:shadow transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Layers className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Active Sections
                            </p>
                            <h3 className="text-2xl font-bold text-foreground mt-0.5">
                                {classItem.sections.length}
                            </h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Cohort streams
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm hover:shadow transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <ClipboardCheck className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Attendance Log
                            </p>
                            <h3 className="text-2xl font-bold text-foreground mt-0.5">
                                {classItem.attendanceCount}
                            </h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Total attendance entries
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Class Metadata Detail Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border bg-card shadow-sm md:col-span-2">
                    <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    <UserCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Class Teacher Assigned</p>
                                    <h4 className="text-base font-semibold text-foreground">
                                        {classItem.classTeacher?.user.fullName ?? "No Class Teacher Assigned"}
                                    </h4>
                                    {classItem.classTeacher && (
                                        <p className="text-xs text-muted-foreground">
                                            ID: {classItem.classTeacher.employeeId} {classItem.classTeacher.designation ? `• ${classItem.classTeacher.designation}` : ""}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Badge variant={classItem.classTeacher ? "default" : "outline"} className="self-start sm:self-center">
                                {classItem.classTeacher ? "Faculty Leader" : "Pending Assignment"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-5 flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Created Date</p>
                            <p className="text-sm font-semibold text-foreground">
                                {new Date(classItem.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                Timetable count: {classItem.timetableCount}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
