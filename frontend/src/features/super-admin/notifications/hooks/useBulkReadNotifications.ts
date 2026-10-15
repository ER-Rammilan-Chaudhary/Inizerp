"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bulkReadNotifications } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

import type { BulkReadDto } from "../types/notification.types";

export const useBulkReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkReadDto) => bulkReadNotifications(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
};
