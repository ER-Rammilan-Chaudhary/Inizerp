"use client";

import { BellOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";

import type {
    Notification,
} from "../types/notification.types";


interface Props {
    notifications: Notification[];
    onRead: (id: string) => void;
    onClose?: () => void;
}


export default function NotificationBellList({
    notifications,
    onRead,
    onClose,
}: Props) {

    const router = useRouter();


    const handleClick = (id: string) => {

        // mark as read
        onRead(id);

        // close notification dropdown
        onClose?.();

        // open detail page
        router.push(
            `/super-admin/notifications/${id}`
        );

    };


    if (!notifications.length) {

        return (
            <div className="flex flex-col items-center justify-center p-6 text-center">

                <BellOff className="h-8 w-8 text-muted-foreground" />

                <p className="mt-2 text-sm text-muted-foreground">
                    No notifications
                </p>

            </div>
        );

    }


    return (
        <div className="space-y-2">

            {notifications.map((item) => (

                <div
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    className="cursor-pointer rounded-lg border p-3 transition hover:bg-muted/50"
                >

                    <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                            <p className="truncate text-sm font-medium">
                                {item.title}
                            </p>


                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                {item.message}
                            </p>

                        </div>


                        <Badge variant="outline">
                            {item.priority}
                        </Badge>

                    </div>


                    <div className="mt-2 flex gap-2">

                        <Badge variant="secondary">
                            {item.type}
                        </Badge>


                        <Badge variant="outline">
                            {item.status}
                        </Badge>

                    </div>

                </div>

            ))}

        </div>
    );
}