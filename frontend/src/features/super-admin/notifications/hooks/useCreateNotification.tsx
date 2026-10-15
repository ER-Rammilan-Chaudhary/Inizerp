"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotification, } from "../api/notification.api";
import { queryKeys, } from "@/lib/react-query/queryKeys";
import type { CreateNotificationDto, } from "../types/notification.types";

export const useCreateNotification = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (payload: CreateNotificationDto) =>
            createNotification(payload),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.all,
            });

        },

    });

};