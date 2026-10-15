"use client";

import { useQuery } from "@tanstack/react-query";

import { getSchoolNotifications } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

import { useGlobalSearch } from "@/hooks/useGlobalSearch";

import type { NotificationFilters } from "../types/notification.types";

export function useSchoolNotifications(
  schoolId: string,
  filters?: NotificationFilters,
) {
  const { search } = useGlobalSearch();

  const finalFilters = {
    ...filters,
    search,
  };

  return useQuery({
    queryKey: queryKeys.notifications.school(schoolId, finalFilters),

    queryFn: () => getSchoolNotifications(schoolId, finalFilters),

    enabled: Boolean(schoolId),
  });
}
