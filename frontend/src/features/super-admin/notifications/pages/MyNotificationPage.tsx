"use client";

import { Badge, } from "@/components/ui/badge";
import { Button, } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import { useMyNotifications, } from "../hooks/useMyNotifications";
import { useMarkNotificationRead, } from "../hooks/useMarkNotificationRead";
import type { NotificationFilters, } from "../types/notification.types";


export default function MyNotificationPage() {

    const filters: NotificationFilters = { page: 1, limit: 10, readStatus: "all" };
    const { data, isLoading, isError, error, } = useMyNotifications(filters);
    const readMutation = useMarkNotificationRead();


    if (isLoading) {
        return <Loader text="Loading notifications..." />;
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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold"> My Notifications </h1 >
                <p className="text-sm text-muted-foreground"> Your notifications </p >
            </div>



            <div className="space-y-3">

                {
                    data?.data?.map((item) => (

                        <div
                            key={item.id}
                            className="rounded-xl border p-4 space-y-3"
                        >


                            <div className="flex items-start justify-between gap-3">


                                <div>

                                    <h3 className="font-medium">
                                        {item.title}
                                    </h3>


                                    <p className="text-sm text-muted-foreground">
                                        {item.message}
                                    </p>

                                </div>


                                <Badge>
                                    {item.priority}
                                </Badge>


                            </div>



                            <div className="flex gap-2">


                                <Badge variant="outline">
                                    {item.type}
                                </Badge>


                                <Badge variant="outline">
                                    {item.audiences?.[0]?.targetType ?? "GLOBAL"}
                                </Badge>


                            </div>



                            <Button

                                size="sm"

                                onClick={() => {

                                    readMutation.mutate(
                                        item.id
                                    );

                                }}

                                disabled={readMutation.isPending}

                            >

                                Mark Read

                            </Button>


                        </div>

                    ))
                }


            </div>



        </div>
    );
}