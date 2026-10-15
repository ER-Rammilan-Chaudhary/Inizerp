"use client";

import { useQuery } from "@tanstack/react-query";

import { getUnreadCount } from "../api/notification.api";
import { queryKeys } from "@/lib/react-query/queryKeys";

export const useUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: getUnreadCount,
    select: (response) => response.data,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};
