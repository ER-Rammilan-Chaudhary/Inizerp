"use client";

import { Eye, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Student } from "../types/students.types";

interface StudentTableProps {
    students: Student[];
    onView: (student: Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
}

const getCurrentEnrollment = (student: Student) =>
    student.enrollments.find(
        (enrollment) =>
            enrollment.status === "ACTIVE" && enrollment.academicYear.isCurrent,
    ) ??
    student.enrollments.find((enrollment) => enrollment.status === "ACTIVE") ??
    null;

const getInitials = (name?: string) => {
    if (!name) return "ST";
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((item) => item.charAt(0).toUpperCase())
        .join("");
};

const getAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return "";
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ?? "";
    return `${baseUrl}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
};

export default function StudentTable({
    students,
    onView,
    onEdit,
    onDelete,
}: StudentTableProps) {
    if (!students.length) {
        return (
            <div className="rounded-xl border bg-card p-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                    <User className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">No Students Found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                    There are no students matching your criteria or enrolled in the system.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="py-3.5 font-semibold text-foreground">Student Name</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Admission No.</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Class & Section</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Roll No.</TableHead>
                            <TableHead className="py-3.5 font-semibold text-foreground">Status</TableHead>
                            <TableHead className="w-16 text-right py-3.5 font-semibold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {students.map((student) => {
                            const activeEnrollment = getCurrentEnrollment(student);
                            const latestEnrollment = student.enrollments?.[0];
                            const enrollment = activeEnrollment ?? latestEnrollment;
                            const isWithdrawn = !activeEnrollment && latestEnrollment?.status === "WITHDRAWN";

                            const avatarUrl = getAvatarUrl(student.user.avatar);
                            const initials = getInitials(student.user.fullName);

                            const statusLabel = isWithdrawn ? "Withdrawn" : student.user.status;

                            const statusColor = isWithdrawn
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                : student.user.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : student.user.status === "INACTIVE"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";

                            return (
                                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full border bg-muted text-foreground flex items-center justify-center shrink-0 overflow-hidden font-semibold text-xs shadow-xs">
                                                {avatarUrl ? (
                                                    <img
                                                        src={avatarUrl}
                                                        alt={student.user.fullName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    initials
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm leading-tight">
                                                    {student.user.fullName}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {student.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-3 text-xs font-semibold text-foreground">
                                        {student.admissionNo}
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <div className="text-xs">
                                            <span className="font-medium text-foreground">
                                                {enrollment?.class.name ?? "Unassigned"}
                                            </span>
                                            {enrollment?.section?.name && (
                                                <span className="text-muted-foreground ml-1.5">
                                                    ({enrollment.section.name})
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-3 text-xs font-medium text-foreground">
                                        {enrollment?.rollNo ?? student.rollNo ?? "--"}
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusColor}`}
                                        >
                                            {statusLabel}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    />
                                                }
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onView(student)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Profile
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => onEdit(student)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => onDelete(student)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
