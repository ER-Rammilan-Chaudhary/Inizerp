"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyNotifications } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

import { useGlobalSearch } from "@/hooks/useGlobalSearch";

import type { NotificationFilters } from "../types/notification.types";

export function useMyNotifications(filters?: NotificationFilters) {
  const { search } = useGlobalSearch();

  const finalFilters = {
    ...filters,
    search,
  };

  return useQuery({
    queryKey: queryKeys.notifications.my(finalFilters),

    queryFn: () => getMyNotifications(finalFilters),
  });
}
