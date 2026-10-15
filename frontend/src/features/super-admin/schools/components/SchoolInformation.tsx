"use client";

import { CalendarDays, Clock3, Mail, MapPin, Phone, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { School } from "@/features/super-admin/schools/types/school";

interface SchoolInformationProps {
    school: School;
}

const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

export default function SchoolInformation({
    school,
}: SchoolInformationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>School Information</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                    <User className="mt-1 h-5 w-5 text-primary" />

                    <div>
                        <p className="text-sm text-muted-foreground">Principal</p>
                        <p className="font-medium">{school.principal || "-"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-primary" />

                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{school.email || "-"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-primary" />

                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{school.phone || "-"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock3 className="mt-1 h-5 w-5 text-primary" />

                    <div>
                        <p className="text-sm text-muted-foreground">Working Hours</p>
                        <p className="font-medium">
                            {school.startHour || "--:--"} - {school.closeHour || "--:--"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />

                    <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{school.address || "-"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <CalendarDays className="mt-1 h-5 w-5 text-primary" />

                    <div>
                        <p className="text-sm text-muted-foreground">Created At</p>
                        <p className="font-medium">{formatDate(school.createdAt)}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">    
                    <CalendarDays className="mt-1 h-5 w-5 text-primary" />

                    <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{formatDate(school.updatedAt)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}