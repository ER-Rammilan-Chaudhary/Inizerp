
"use client";

import type { Student } from "../types/students.types";
import { formatAcademicYear } from "@/lib/utils/format-academic-year";
import { formatDate } from "@/lib/utils/format-date";

interface StudentDetailsProps {
    student: Student;
}

const getInitials = (name?: string) => {
    if (!name) { return "ST"; }
    return name.trim().split(/\s+/).slice(0, 2).map((item) => item.charAt(0).toUpperCase(),).join("");
};


const getAvatarUrl = (avatar?: string | null,) => {
    if (!avatar) { return ""; }
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) { return avatar; }
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "",) ?? "";
    return `${baseUrl}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
};


export default function StudentDetails({
    student,
}: StudentDetailsProps) {
    const enrollment =
        student.enrollments.find(
            (item) =>
                item.status === "ACTIVE" &&
                item.academicYear.isCurrent,
        ) ??
        student.enrollments.find(
            (item) =>
                item.status === "ACTIVE",
        ) ??
        student.enrollments[0] ??
        null;

    const initials = getInitials(
        student.user.fullName,
    );

    const avatarUrl = getAvatarUrl(
        student.user.avatar,
    );

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="h-15 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

                <div className="px-6 pb-6">
                    <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-primary text-2xl font-bold text-primary-foreground shadow-md">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={student.user.fullName} className="h-full w-full object-cover" />) : (initials)}
                            </div>

                            <div className="pb-1">
                                <h2 className="text-2xl font-bold tracking-tight capitalize">
                                    {student.user.fullName}
                                </h2>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium"> Admission No. {" "}{student.admissionNo}</span>
                                    {enrollment?.status === "WITHDRAWN" ? (
                                        <span className="rounded-full border border-destructive/30 bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
                                            Withdrawn
                                        </span>
                                    ) : (
                                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-left sm:text-right">
                            <p className="text-xs text-muted-foreground"> Admission Date </p >
                            <p className="mt-1 text-sm font-medium">
                                {formatDate(student.admissionDate,)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground"> Class </p > <p className="mt-2 text-lg font-semibold"> {enrollment?.class?.name ?? "Not assigned"}</p>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground"> Section </p > <p className="mt-2 text-lg font-semibold"> {enrollment?.section?.name ?? "Not assigned"}</p >
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground"> Roll No </p > <p className="mt-2 text-lg font-semibold"> {enrollment?.rollNo ?? student.rollNo ?? "Not assigned"}</p >
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground"> Academic Year </p > <p className="mt-2 text-lg font-semibold"> {enrollment?.academicYear ? formatAcademicYear(enrollment.academicYear.name) : "Not assigned"}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold"> Personal Information </h3 >
                    <div className="mt-5 space-y-4 grid gap-2 lg:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground  "> Full Name </p > <p className="mt-2 text-sm font-medium capitalize"> {student.user.fullName}</p >
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Date of Birth
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {formatDate(student.dob)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Gender
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {student.gender ?? "Not provided"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Blood Group
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {student.bloodGroup ??
                                    "Not provided"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Address
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {student.address ??
                                    "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold"> Contact Information </h3 >
                    <div className="mt-5 space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="mt-1 text-sm font-medium">{student.user.email}</p>
                        </div>

                        <div> <p className="text-xs text-muted-foreground"> Phone </p >
                            <p className="mt-1 text-sm font-medium"> {student.user.phone ?? "Not provided"}</p >
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground"> Last Login </p >
                            <p className="mt-1 text-sm font-medium"> {student.user.lastLoginAt ? formatDate(student.user.lastLoginAt,) : "Never"}</p >
                        </div>
                    </div>

                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold">
                        Parent / Guardian
                    </h3>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Parent
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {student.parent?.user.fullName ??
                                    "Not assigned"}
                            </p>

                            {student.parent && (
                                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                    <p>
                                        {student.parent.user.email}
                                    </p>
                                    <p>
                                        {student.parent.user.phone ??
                                            "No phone"}
                                    </p>
                                    <p>
                                        {student.parent.occupation ??
                                            "Occupation not provided"}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Guardian
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {student.guardianId
                                    ? "Guardian assigned"
                                    : "Not assigned"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold"> Enrollment Details </h3 >
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="px-3 py-3 font-medium">
                                    Academic Year
                                </th>
                                <th className="px-3 py-3 font-medium">
                                    Class
                                </th>
                                <th className="px-3 py-3 font-medium">
                                    Section
                                </th>
                                <th className="px-3 py-3 font-medium">
                                    Roll No
                                </th>
                                <th className="px-3 py-3 font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {student.enrollments.map(
                                (item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-3">
                                            {formatAcademicYear(item.academicYear.name)}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.class.name}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.section?.name ??
                                                "—"}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.rollNo ?? "—"}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.status === "ACTIVE" ? (
                                                <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                    Active
                                                </span>
                                            ) : item.status === "WITHDRAWN" ? (
                                                <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                                    Withdrawn
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                                                    {item.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
