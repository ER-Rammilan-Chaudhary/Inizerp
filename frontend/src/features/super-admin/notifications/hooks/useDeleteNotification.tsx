"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    toast,
} from "sonner";

import {
    deleteNotification,
} from "../api/notification.api";

import {
    queryKeys,
} from "@/lib/react-query/queryKeys";
import { getErrorMessage } from "@/lib/error-message";


export function useDeleteNotification() {

    const queryClient = useQueryClient();


    return useMutation({

        mutationFn: deleteNotification,


        onSuccess: (response) => {

            toast.success(
                response.message ??
                "Notification deleted successfully."
            );


            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.all,
            });


            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.stats,
            });


            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.unread,
            });


        },


        onError: (error) => {
            toast.error(getErrorMessage(error, "Failed to delete notification."));
        },

    });

}