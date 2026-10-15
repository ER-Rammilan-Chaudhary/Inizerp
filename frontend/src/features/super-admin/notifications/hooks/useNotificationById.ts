"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotificationById } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

export const useNotificationById = (id?: string) => {
  return useQuery({
    queryKey: queryKeys.notifications.detail(id ?? ""),

    queryFn: () => getNotificationById(id!),

    enabled: Boolean(id),
  });
};
