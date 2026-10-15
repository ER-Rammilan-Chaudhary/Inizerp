// features/audit-logs/hooks/useAuditStats.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { getAuditStats } from "../api/audit-logs.api";

export function useAuditStats() {
  return useQuery({
    queryKey: queryKeys.auditLogs.stats,
    queryFn: getAuditStats,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // refetchInterval: 1000,
  });
}
