"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NotificationForm from "../components/NotificationForm";
import { useCreateNotification, } from "../hooks/useCreateNotification";
import type { CreateNotificationDto, } from "../types/notification.types";



export default function CreateNotificationPage() {
    const router = useRouter();
    const mutation = useCreateNotification();

    const handleSubmit = (data: CreateNotificationDto) => {
        mutation.mutate(data, {
            onSuccess: () => { router.push("/super-admin/notifications"); },
        });
    };


    return (
        <div className="container mx-auto">

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight"> Create Notification </h1 >
                    <p className="mt-1 text-sm text-muted-foreground"> Create and send a new notification </p >
                </div>
            </div>

            {/* Form Card */}
            <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6">
                    <NotificationForm onSubmit={handleSubmit}
                        loading={mutation.isPending}
                        onCancel={() => router.back()}
                        isEdit={false} />
                </CardContent >
            </Card>
        </div>
    );
}