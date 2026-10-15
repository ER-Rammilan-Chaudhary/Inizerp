"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useGlobalSearch } from "@/hooks/useGlobalSearch";

import { getAuditLogs } from "../api/audit-logs.api";

import type { AuditLogFilters } from "../types/audit-logs.types";

import { queryKeys } from "@/lib/react-query/queryKeys";

const EMPTY_FILTERS: AuditLogFilters = {};

export function useAuditLogs(filters: AuditLogFilters = EMPTY_FILTERS) {
  const { search } = useGlobalSearch();

  const queryClient = useQueryClient();

  const finalFilters = useMemo<AuditLogFilters>(
    () => ({ ...filters, search: search || undefined }),
    [filters, search],
  );

  const page = finalFilters.page ?? 1;
  const limit = finalFilters.limit ?? 10;

  const query = useQuery({
    queryKey: queryKeys.auditLogs.list(finalFilters),

    queryFn: () => getAuditLogs(finalFilters),

    staleTime: 1000 * 60 * 5,

    refetchOnMount: true,

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const pagination = query.data?.pagination;

    if (!pagination) {
      return;
    }

    const hasNext = pagination.page < pagination.totalPages;

    const hasPrevious = pagination.page > 1;

    // Prefetch NEXT page
    if (hasNext) {
      const nextFilters: AuditLogFilters = {
        ...finalFilters,
        page: page + 1,
        limit,
      };

      queryClient.prefetchQuery({
        queryKey: queryKeys.auditLogs.list(nextFilters),

        queryFn: () => getAuditLogs(nextFilters),

        staleTime: 1000 * 60 * 5,
      });
    }

    // Prefetch PREVIOUS page
    if (hasPrevious) {
      const previousFilters: AuditLogFilters = {
        ...finalFilters,
        page: page - 1,
        limit,
      };

      queryClient.prefetchQuery({
        queryKey: queryKeys.auditLogs.list(previousFilters),

        queryFn: () => getAuditLogs(previousFilters),

        staleTime: 1000 * 60 * 5,
      });
    }
  }, [page, limit, finalFilters, query.data?.pagination, queryClient]);

  return query;
}
