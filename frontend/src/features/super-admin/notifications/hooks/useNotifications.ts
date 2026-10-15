"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getNotifications } from "../api/notification.api";
import type { NotificationFilters } from "../types/notification.types";
import { queryKeys } from "@/lib/react-query/queryKeys";

export function useNotifications(filters: NotificationFilters = {}) {
  const queryClient = useQueryClient();

  const { page = 1, limit = 10, search = "" } = filters;
  const restFilters = useMemo(
    () => ({
      scope: filters.scope,
      type: filters.type,
      priority: filters.priority,
      status: filters.status,
      schoolId: filters.schoolId,
      userId: filters.userId,
      classId: filters.classId,
      sectionId: filters.sectionId,
      studentId: filters.studentId,
      readStatus: filters.readStatus,
    }),
    [
      filters.scope,
      filters.type,
      filters.priority,
      filters.status,
      filters.schoolId,
      filters.userId,
      filters.classId,
      filters.sectionId,
      filters.studentId,
      filters.readStatus,
    ],
  );

  const query = useQuery({
    queryKey: queryKeys.notifications.list({
      page,
      limit,
      search,
      ...restFilters,
    }),

    queryFn: () =>
      getNotifications({
        page,
        limit,
        search,
        ...restFilters,
      }),

    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const pagination = query.data?.pagination;

    if (!pagination) {
      return;
    }

    const hasNext = pagination.page < pagination.totalPages;

    const hasPrevious = pagination.page > 1;

    if (hasNext) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.notifications.list({
          page: page + 1,
          limit,
          search,
          ...restFilters,
        }),

        queryFn: () =>
          getNotifications({
            page: page + 1,
            limit,
            search,
            ...restFilters,
          }),

        staleTime: 1000 * 60 * 5,
      });
    }

    if (hasPrevious) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.notifications.list({
          page: page - 1,
          limit,
          search,
          ...restFilters,
        }),

        queryFn: () =>
          getNotifications({
            page: page - 1,
            limit,
            search,
            ...restFilters,
          }),

        staleTime: 1000 * 60 * 5,
      });
    }
  }, [page, limit, search, query.data?.pagination, queryClient, restFilters]);

  return query;
}
