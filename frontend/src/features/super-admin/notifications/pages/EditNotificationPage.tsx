"use client";
import { useRouter, } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import NotificationForm from "../components/NotificationForm";
import { useNotificationById, } from "../hooks/useNotificationById";
import { useUpdateNotification, } from "../hooks/useUpdateNotification";
import type { UpdateNotificationDto, } from "../types/notification.types";
import { Card, CardContent, } from "@/components/ui/card";


interface Props { id: string; }

export default function EditNotificationPage({ id, }: Props) {
    const router = useRouter();
    const { data, isLoading, isError, error } = useNotificationById(id);
    const mutation = useUpdateNotification();
    const notification = data?.data;

    if (isLoading) {
        return <Loader text="Loading notification..." />;
    }

    if (isError) {
        return (
            <ErrorPage
                title="Unable to load notification"
                message={error instanceof Error ? error.message : "Please try again in a moment."}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (!notification) {
        return (
            <ErrorPage
                title="Notification not found"
                message="The requested notification could not be found."
            />
        );
    }

    const handleSubmit = (payload: UpdateNotificationDto) => {
        mutation.mutate(
            { id, payload, },
            { onSuccess: () => { router.push("/super-admin/notifications"); }, }
        );
    };


    return (
        <div className="container mx-auto">

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Notification
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Update notification details and settings
                    </p>
                </div>

            </div>


            {/* Form Card */}
            <Card className="shadow-sm">

                <CardContent className="p-4 sm:p-6">

                    <NotificationForm
                        initialData={{
                            title: notification.title,
                            message: notification.message,
                            scope: notification.scope,
                            type: notification.type,
                            priority: notification.priority,
                            status: notification.status,
                            schoolId: notification.schoolId,
                            userId: notification.userId,
                        }}
                        onSubmit={handleSubmit}
                        loading={mutation.isPending}
                        onCancel={() => router.back()}
                        isEdit={true}
                    />

                </CardContent>

            </Card>

        </div>
    );

}