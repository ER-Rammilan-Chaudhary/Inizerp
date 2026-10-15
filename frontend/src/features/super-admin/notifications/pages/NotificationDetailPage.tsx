"use client";

import { useRouter, } from "next/navigation";
import { Button, } from "@/components/ui/button";
import { Badge, } from "@/components/ui/badge";
import { Separator, } from "@/components/ui/separator";
import { useNotificationById, } from "../hooks/useNotificationById";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";

interface Props {
    id: string;
}

export default function NotificationDetailPage({ id, }: Props) {
    const router = useRouter();
    const { data, isLoading, isError, error } = useNotificationById(id);
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

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">

            <div className="flex min-h-0 flex-1 flex-col gap-3">

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between rounded-xl border bg-card p-4">

                    <h1 className="text-lg font-semibold text-foreground">
                        🔔 Notification Details
                    </h1>
                </div>

                {/* Content */}
                <div className="flex min-h-0 flex-1 flex-col rounded-xl border bg-card p-4">

                    {/* Top Section */}
                    <div className="shrink-0 space-y-3">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p className="text-xs text-muted-foreground">
                                    School
                                </p>

                                <p className="font-semibold">
                                    {notification.school?.name ?? "-"}
                                </p>

                            </div>

                            <div className="flex flex-wrap gap-2">

                                <Badge>
                                    {notification.scope}
                                </Badge>

                                <Badge variant="secondary">
                                    {notification.type}
                                </Badge>

                                <Badge variant="outline">
                                    {notification.priority}
                                </Badge>

                                <Badge variant="outline">
                                    {notification.status}
                                </Badge>

                            </div>

                        </div>

                        <Separator />

                        <div>

                            <p className="text-xs text-muted-foreground">
                                Title
                            </p>

                            <p className="font-semibold wrap-break-word">
                                {notification.title}
                            </p>

                        </div>

                        <Separator />

                    </div>

                    {/* Scroll Area */}
                    <div className="min-h-0 flex-1 overflow-y-auto py-3">

                        <p className="mb-2 text-xs text-muted-foreground">
                            Message
                        </p>

                        <div className="rounded-lg bg-muted p-3 text-sm leading-6 wrap-break-word">
                            {notification.message}
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="shrink-0 border-t pt-3">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <p className="text-xs text-muted-foreground">
                                    Created By
                                </p>

                                <p className="font-semibold">
                                    {notification.createdBy?.fullName ?? "-"}
                                </p>

                                <p className="text-sm text-muted-foreground break-all">
                                    {notification.createdBy?.email}
                                </p>

                            </div>

                            <div className="text-sm text-muted-foreground">

                                📅{" "}
                                {new Date(
                                    notification.createdAt
                                ).toLocaleString()}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}