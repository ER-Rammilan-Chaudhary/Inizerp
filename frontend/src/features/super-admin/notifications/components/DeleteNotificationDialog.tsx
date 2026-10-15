"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type {
    Notification,
} from "../types/notification.types";

interface Props {
    open: boolean;
    notification: Notification | null;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function DeleteNotificationDialog({
    open,
    notification,
    loading,
    onOpenChange,
    onConfirm,
}: Props) {

    return (

        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <AlertDialogContent>

                <AlertDialogHeader>

                    <AlertDialogTitle>

                        Delete Notification

                    </AlertDialogTitle>

                    <AlertDialogDescription>

                        Are you sure you want to delete

                        <strong className="mx-1">

                            {notification?.title}

                        </strong>

                        ?

                        This action cannot be undone.

                    </AlertDialogDescription>

                </AlertDialogHeader>

                <AlertDialogFooter>

                    <AlertDialogCancel>

                        Cancel

                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={onConfirm}
                    >

                        {loading ? "Deleting..." : "Delete"}

                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>

    );

}