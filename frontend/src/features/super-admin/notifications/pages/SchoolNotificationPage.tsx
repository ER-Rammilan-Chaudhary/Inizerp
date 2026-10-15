"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";

import { useSchoolNotifications } from "../hooks/useSchoolNotifications";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";

import type { NotificationFilters } from "../types/notification.types";


interface Props {
    schoolId: string;
}


export default function SchoolNotificationPage({
    schoolId,
}: Props) {

    const filters: NotificationFilters = {
        page: 1,
        limit: 10,
        readStatus: "all",
    };

    const {
        data,
        isLoading,
        isError,
        error,
    } = useSchoolNotifications(
        schoolId,
        filters
    );

    const readMutation = useMarkNotificationRead();


    if (isLoading) {
        return <Loader text="Loading school notifications..." />;
    }

    if (isError) {
        return (
            <ErrorPage
                title="Unable to load notifications"
                message={error instanceof Error ? error.message : "Please try again in a moment."}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="space-y-4">

            <div>
                <h1 className="text-xl font-semibold">
                    School Notifications
                </h1>

                <p className="text-sm text-muted-foreground">
                    School notification management
                </p>
            </div>


            <div className="space-y-2">

                {data?.data?.map((notification) => (

                    <div
                        key={notification.id}
                        className="rounded-lg border p-3"
                    >

                        <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                                <h3 className="font-medium truncate">
                                    {notification.title}
                                </h3>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>

                            </div>

                            <Badge>
                                {notification.priority}
                            </Badge>

                        </div>


                        <div className="mt-2 flex flex-wrap gap-2">

                            <Badge variant="outline">
                                {notification.scope}
                            </Badge>

                            <Badge variant="outline">
                                {notification.type}
                            </Badge>

                            <Badge variant="outline">
                                {notification.status}
                            </Badge>

                        </div>


                        <Button
                            size="sm"
                            className="mt-3"
                            onClick={() =>
                                readMutation.mutate(
                                    notification.id
                                )
                            }
                            disabled={readMutation.isPending}
                        >
                            Mark Read
                        </Button>

                    </div>

                ))}

            </div>

        </div>
    );
}