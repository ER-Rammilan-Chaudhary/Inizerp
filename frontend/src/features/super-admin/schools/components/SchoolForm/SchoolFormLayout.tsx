"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import FormActions from "./components/FormActions";
import type { DefaultValues } from "react-hook-form";
import SchoolInformationSection from "./sections/SchoolInformationSection";
import SchoolAdminSection from "./sections/SchoolAdminSection";
import SchoolBrandingSection from "./sections/SchoolBrandingSection";
import SchoolMissionSection from "./sections/SchoolMissionSection";
import SchoolTimingSection from "./sections/SchoolTimingSection";

import {
    createSchoolSchema,
    updateSchoolSchema,
    CreateSchoolFormValues,
    UpdateSchoolFormValues,
} from "../../schemas/school.schema";

interface SchoolFormLayoutProps<T> {
    mode: "create" | "edit";
    loading?: boolean;
    defaultValues?: Partial<T>;
    onSubmit: (values: T) => void;
}

export default function SchoolFormLayout<T extends CreateSchoolFormValues | UpdateSchoolFormValues>({
    mode, loading = false, defaultValues, onSubmit, }: SchoolFormLayoutProps<T>) {

    const editMode = mode === "edit";
    const defaultFormValues = {
        name: "", email: "", phone: "", address: "", principal: "", logo: undefined, primaryColor: "#2563eb", secondaryColor: "#ffffff", slogan: "", missionStatement: "", visionStatement: "", startHour: "08:00", closeHour: "15:00",
        ...(editMode ? {} : { ownerName: "", ownerEmail: "", ownerPassword: "", ownerPhone: "", }
        ),
    } as DefaultValues<T>;


    const form = useForm<T, unknown, T>({
        resolver: zodResolver(editMode ? updateSchoolSchema : createSchoolSchema) as never,
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        if (!defaultValues) return;
        form.reset({ ...form.getValues(), ...defaultValues, }
        );
    }, [defaultValues, form,]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Main Details Column (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <SchoolInformationSection control={form.control} />
                        {!editMode && <SchoolAdminSection control={form.control} />}
                        <SchoolMissionSection control={form.control} />
                    </div>

                    {/* Branding, Timings & Preferences Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <SchoolBrandingSection control={form.control} />
                        <SchoolTimingSection control={form.control} />
                    </div>
                </div>

                <FormActions loading={loading} editMode={editMode} />
            </form>
        </Form>
    );
}