// features/audit-logs/hooks/useRecentAuditLogs.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { getRecentAuditLogs } from "../api/audit-logs.api";

export function useRecentAuditLogs() {
  return useQuery({
    queryKey: queryKeys.auditLogs.recent,
    queryFn: getRecentAuditLogs,
  });
}
