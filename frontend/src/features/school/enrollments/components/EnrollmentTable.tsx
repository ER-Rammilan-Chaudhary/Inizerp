"use client";

import Link from "next/link";
import { format } from "date-fns";
import { User, AlertCircle, ArrowUpRight, Ban, CheckCircle2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatClassName, formatSectionName } from "@/lib/utils";
import type { Enrollment, EnrollmentStatus } from "../types/enrollments.types";
import Loader from "@/components/common/Loader";

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  loading: boolean;
  onStatusChange?: (id: string, status: EnrollmentStatus) => void;
  onDelete?: (id: string) => void;
}

export function EnrollmentTable({
  enrollments,
  loading,
  onStatusChange,
  onDelete,
}: EnrollmentTableProps) {
  const getStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30">Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 border-blue-500/30">Completed (Promoted)</Badge>;
      case "WITHDRAWN":
        return <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/30">Withdrawn</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/30">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Loader text="Loading enrollments..." />
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card/50 p-12 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
        <h3 className="font-semibold text-foreground">No Enrollments Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          No student enrollment records matched your filters. You can promote students from a previous session or enroll existing students.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Student</th>
              <th className="px-4 py-3.5">Admission No</th>
              {/* <th className="px-4 py-3.5">Academic Session</th> */}
              <th className="px-4 py-3.5">Class & Section</th>
              <th className="px-4 py-3.5">Roll No</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Enrolled Date</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {enrollments.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                {/* Student */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                      {item.student?.user?.fullName?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize ">
                        {item.student?.user?.fullName || "Unnamed Student"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.student?.user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Admission No */}
                <td className="px-4 py-3">
                  <Badge variant="secondary" className=" text-xs">
                    {item.student?.admissionNo}
                  </Badge>
                </td>

                {/* Academic Session */}
                {/* <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">{item.academicYear?.name}</span>
                    {item.academicYear?.isCurrent && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.academicYear?.code}</span>
                </td> */}

                {/* Class & Section */}
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">
                    {formatClassName(item.class?.name) || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.section ? formatSectionName(item.section.name) : "No Section"}
                  </div>
                </td>

                {/* Roll No */}
                <td className="px-4 py-3">
                  <span className=" text-sm font-semibold text-foreground">
                    {item.rollNo || "-"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {getStatusBadge(item.status)}
                </td>

                {/* Enrolled Date */}
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {item.enrolledAt ? format(new Date(item.enrolledAt), "dd MMM yyyy") : "-"}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/school-admin/students/${item.studentId}`}
                      className="inline-flex items-center justify-center h-8 px-2.5 rounded-md border text-xs font-medium text-foreground hover:bg-muted gap-1"
                      title="View Student Master Record"
                    >
                      <span>Student</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>

                    {item.status === "ACTIVE" && onStatusChange && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onStatusChange(item.id, "WITHDRAWN")}
                        className="h-8 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        title="Withdraw Student"
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    {item.status === "WITHDRAWN" && onStatusChange && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onStatusChange(item.id, "ACTIVE")}
                        className="h-8 px-2.5 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-medium gap-1"
                        title="Reactivate Student Enrollment"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Reactivate</span>
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                        title="Remove Enrollment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
