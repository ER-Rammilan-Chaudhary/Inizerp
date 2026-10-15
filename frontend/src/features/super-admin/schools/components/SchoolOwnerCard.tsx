"use client";

import Link from "next/link";
import { Mail, Phone, ShieldCheck, User, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { School } from "@/features/super-admin/schools/types/school";

interface SchoolOwnerCardProps {
    school: School;
}

export default function SchoolOwnerCard({
    school,
}: SchoolOwnerCardProps) {
    const owner = school.owner;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>School Administrator</CardTitle>

                {owner ? (
                    <Button asChild size="sm">
                        <Link href={`/super-admin/schools/${school.id}/admins`}>
                            Manage Admin
                        </Link>
                    </Button>
                ) : (
                    <Button asChild size="sm">
                        <Link href={`/super-admin/schools/${school.id}/admins`}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign Admin
                        </Link>
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                {owner ? (
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-7 w-7 text-primary" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">{owner.fullName}</h3>

                                <p className="text-sm text-muted-foreground">
                                    School Administrator
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-1 h-5 w-5 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>

                                    <p className="font-medium">{owner.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="mt-1 h-5 w-5 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>

                                    <p className="font-medium">{owner.phone || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-1 h-5 w-5 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">Role</p>

                                    <p className="font-medium">{owner.role}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="mt-1 h-5 w-5 text-primary" />

                                <div>
                                    <p className="text-sm text-muted-foreground">User ID</p>

                                    <p className="font-medium break-all">{owner.id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button asChild>
                                <Link href={`/super-admin/schools/${school.id}/admins`}>
                                    Manage Admin
                                </Link>
                            </Button>

                            <Button asChild variant="outline">
                                <Link href={`/super-admin/schools/${school.id}/admins?tab=password`}>
                                    Reset Password
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <UserPlus className="mb-4 h-12 w-12 text-muted-foreground" />

                        <h3 className="text-lg font-semibold">
                            No School Administrator
                        </h3>

                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            This school does not have an administrator assigned yet.
                        </p>

                        <Button asChild className="mt-6">
                            <Link href={`/super-admin/schools/${school.id}/admins`}>
                                Assign School Admin
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}