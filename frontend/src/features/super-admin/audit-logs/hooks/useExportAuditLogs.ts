// features/audit-logs/hooks/useExportAuditLogs.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { exportAuditLogsCSV } from "../api/audit-logs.api";
import type { AuditLogFilters } from "../types/audit-logs.types";

export function useExportAuditLogs() {
  return useMutation({
    mutationFn: (filters?: Omit<AuditLogFilters, "page" | "limit">) =>
      exportAuditLogsCSV(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "audit-logs.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });
}
