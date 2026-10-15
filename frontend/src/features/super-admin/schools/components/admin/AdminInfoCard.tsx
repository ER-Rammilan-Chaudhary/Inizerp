"use client";

import { format } from "date-fns";
import { CalendarDays, Clock3, Mail, Phone, ShieldCheck, } from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { SchoolAdmin } from "@/features/super-admin/schools/api/school-admin.api";

import { UpdateAdminDialog } from "./UpdateAdminDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

interface AdminInfoCardProps {
    schoolId: string;
    admin: SchoolAdmin;
}

export function AdminInfoCard({
    schoolId,
    admin,
}: AdminInfoCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>School Administrator</CardTitle>

                <Badge
                    variant={
                        admin.status === "ACTIVE" ? "default" : "secondary"
                    }
                >
                    {admin.status ?? "ACTIVE"}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-6">

                <div className="flex items-center gap-4">

                    <Avatar className="h-16 w-16">
                        <AvatarImage src={admin.avatar ?? ""} />

                        <AvatarFallback>
                            {admin.fullName
                                ?.split(" ")
                                .map((x) => x[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h3 className="text-lg font-semibold">
                            {admin.fullName}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            {admin.role}
                        </p>
                    </div>

                </div>

                <div className="grid gap-4 md:grid-cols-2">

                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{admin.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{admin.phone || "-"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <span>{admin.role}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />

                        <span>
                            {admin.createdAt
                                ? format(
                                    new Date(admin.createdAt),
                                    "dd MMM yyyy"
                                )
                                : "-"}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 md:col-span-2">
                        <Clock3 className="h-4 w-4 text-muted-foreground" />

                        <span>
                            {admin.lastLogin
                                ? format(
                                    new Date(admin.lastLogin),
                                    "dd MMM yyyy hh:mm a"
                                )
                                : "Never Logged In"}
                        </span>
                    </div>

                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                    <UpdateAdminDialog
                        schoolId={schoolId}
                        admin={admin}
                    />

                    <ResetPasswordDialog
                        schoolId={schoolId}
                    />

                </div>

            </CardContent>
        </Card>
    );
}