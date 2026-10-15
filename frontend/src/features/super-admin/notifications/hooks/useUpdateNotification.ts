"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNotification } from "../api/notification.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

import type { UpdateNotificationDto } from "../types/notification.types";

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateNotificationDto;
    }) => updateNotification(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.detail(variables.id),
      });
    },
  });
};
