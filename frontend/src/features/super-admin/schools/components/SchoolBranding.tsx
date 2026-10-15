"use client";

import { Palette, Quote, Target, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { School } from "@/features/super-admin/schools/types/school";

interface SchoolBrandingProps {
    school: School;
}

export default function SchoolBranding({
    school,
}: SchoolBrandingProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Branding & Identity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <p className="font-medium">Primary Color</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className="h-10 w-10 rounded-full border"
                                style={{ backgroundColor: school.primaryColor || "#e5e7eb" }}
                            />

                            <span className="font-medium">
                                {school.primaryColor || "-"}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <p className="font-medium">Secondary Color</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className="h-10 w-10 rounded-full border"
                                style={{ backgroundColor: school.secondaryColor || "#e5e7eb" }}
                            />

                            <span className="font-medium">
                                {school.secondaryColor || "-"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <Quote className="h-5 w-5 text-primary" />
                        <p className="font-medium">School Slogan</p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {school.slogan || "No slogan available"}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        <p className="font-medium">Mission Statement</p>
                    </div>

                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {school.missionStatement || "No mission statement available"}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        <p className="font-medium">Vision Statement</p>
                    </div>

                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {school.visionStatement || "No vision statement available"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

