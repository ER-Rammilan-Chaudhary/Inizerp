"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationAsRead } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
};
