"use client";

import { useRouter } from "next/navigation";
import SchoolFormLayout from "./SchoolFormLayout";
import { useCreateSchool } from "../../hooks/useCreateSchool";
import type { CreateSchoolFormValues, } from "../../schemas/school.schema";


export default function CreateSchoolForm() {
    const router = useRouter();
    const { mutate, isPending, } = useCreateSchool();
    const handleSubmit = (values: CreateSchoolFormValues) => {
        mutate(values,{
            onSuccess: () => { router.push("/super-admin/schools"); },
        });
    };

    return (
        <SchoolFormLayout<CreateSchoolFormValues>
            mode="create"
            loading={isPending}
            onSubmit={handleSubmit}
        />

    );
}