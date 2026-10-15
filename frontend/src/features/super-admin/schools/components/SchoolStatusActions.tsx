"use client";

import { CheckCircle, Clock, Ban, } from "lucide-react";
import { Button } from "@/components/ui/button"; import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { toast } from "sonner";
import { useUpdateSchoolStatus } from "../hooks/useUpdateSchoolStatus";
import type { SchoolStatus } from "@/features/super-admin/schools/types/school";

interface Props { schoolId: string; currentStatus: SchoolStatus; }

const statuses =
    [
    { label: "Active", value: "ACTIVE" as SchoolStatus, icon: CheckCircle, },
    { label: "Trial", value: "TRIAL" as SchoolStatus, icon: Clock, },
     { label: "Suspended", value: "SUSPENDED" as SchoolStatus, icon: Ban, }
,];

export default function SchoolStatusActions({

    schoolId,

    currentStatus,

}: Props) {

    const mutation =
        useUpdateSchoolStatus();

    function changeStatus(
        status: SchoolStatus
    ) {

        if (status === currentStatus) {
            return;
        }

        mutation.mutate(
            {
                schoolId,
                status,
            },

            {

                onSuccess: () => {

                    toast.success(
                        `School status changed to ${status}`
                    );

                },

                onError: () => {

                    toast.error(
                        "Status update failed"
                    );

                }

            }

        );

    }

    return (

        <Card>

            <CardHeader>

                <CardTitle>
                    Change School Status
                </CardTitle>

            </CardHeader>

            <CardContent className="flex flex-wrap gap-3">

                {
                    statuses.map((item) => {

                        const Icon = item.icon;

                        return (

                            <Button

                                key={item.value}

                                variant={
                                    currentStatus === item.value
                                        ?
                                        "default"
                                        :
                                        "outline"
                                }

                                disabled={
                                    mutation.isPending
                                }

                                onClick={() => changeStatus(item.value)}

                            >

                                <Icon className="mr-2 h-4 w-4" />

                                {item.label}

                            </Button>

                        );

                    })
                }

            </CardContent>

        </Card>

    );

}