"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotificationStats } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

export function useNotificationStats() {
  return useQuery({
    queryKey: queryKeys.notifications.stats,

    queryFn: getNotificationStats,
  });
}
