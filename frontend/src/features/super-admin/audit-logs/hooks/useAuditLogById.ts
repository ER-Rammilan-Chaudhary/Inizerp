// features/audit-logs/hooks/useAuditLogById.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { getAuditLogById } from "../api/audit-logs.api";

export function useAuditLogById(id?: string) {
  return useQuery({
    queryKey: queryKeys.auditLogs.detail(id ?? ""),
    queryFn: () => getAuditLogById(id as string),
    enabled: Boolean(id),
  });
}
