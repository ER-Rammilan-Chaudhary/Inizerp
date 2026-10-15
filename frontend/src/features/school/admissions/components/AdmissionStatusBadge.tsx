import { CheckCircle2, Clock, Eye, GraduationCap, XCircle } from "lucide-react";
import type { AdmissionStatus } from "../types/admissions.types";

interface AdmissionStatusBadgeProps {
  status: AdmissionStatus | string;
  size?: "sm" | "md" | "lg";
}

export function AdmissionStatusBadge({
  status,
  size = "md",
}: AdmissionStatusBadgeProps) {
  const normalized = (status || "PENDING").toUpperCase();

  const config = (() => {
    switch (normalized) {
      case "APPROVED":
        return {
          label: "Approved",
          icon: CheckCircle2,
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
          iconColor: "text-emerald-500",
        };
      case "ENROLLED":
        return {
          label: "Enrolled",
          icon: GraduationCap,
          className:
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
          iconColor: "text-purple-500",
        };
      case "UNDER_REVIEW":
        return {
          label: "Under Review",
          icon: Eye,
          className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
          iconColor: "text-blue-500",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          icon: XCircle,
          className:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
          iconColor: "text-rose-500",
        };
      case "PENDING":
      default:
        return {
          label: "Pending",
          icon: Clock,
          className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
          iconColor: "text-amber-500",
        };
    }
  })();

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2 font-medium",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses[size]} ${config.className} transition-colors`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor} shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
}
