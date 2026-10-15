"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bulkDeleteNotifications } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

import type { BulkDeleteDto } from "../types/notification.types";

export const useBulkDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkDeleteDto) => bulkDeleteNotifications(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
};
