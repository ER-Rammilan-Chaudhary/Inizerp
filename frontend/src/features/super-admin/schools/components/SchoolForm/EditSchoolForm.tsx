"use client";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import SchoolFormLayout from "./SchoolFormLayout";
import { useSchool } from "../../hooks/useSchool";
import { useUpdateSchool } from "../../hooks/useUpdateSchool";
import type { UpdateSchoolFormValues, } from "../../schemas/school.schema";
interface EditSchoolFormProps { schoolId: string; }


export default function EditSchoolForm({ schoolId, }: EditSchoolFormProps) {

    const router = useRouter();
    const { data: school, isLoading, isError, error, } = useSchool(schoolId);

    const { mutate, isPending, } = useUpdateSchool();
    const handleSubmit = (values: UpdateSchoolFormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined) { formData.append(key, value as string); }
        });
        mutate({ schoolId, payload: formData, }, {
            onSuccess: () => {
                router.push(`/super-admin/schools/${schoolId}`);
            },
        });
    };
    if (isLoading) {
        return (
            <Loader text="Loading School..." />
        )
    }

    if (isError) {
        return (
            <ErrorPage title="Unable to load School"
                message={error instanceof Error ? error.message : "Please try again in a moment."}
                onRetry={() => window.location.reload()}
            />
        );
    }


    return (<SchoolFormLayout<UpdateSchoolFormValues> mode="edit" loading={isPending}

        defaultValues={{
            name: school?.name ?? "",
            email: school?.email ?? "",
            phone: school?.phone ?? "",
            address: school?.address ?? "",
            principal: school?.principal ?? "",
            primaryColor: school?.primaryColor ?? "#2563eb",
            secondaryColor: school?.secondaryColor ?? "#ffffff",
            slogan: school?.slogan ?? "",
            missionStatement: school?.missionStatement ?? "",
            visionStatement: school?.visionStatement ?? "",
            startHour: school?.startHour ?? "08:00",
            closeHour: school?.closeHour ?? "15:00",
        }
        }
        onSubmit={handleSubmit}
    />
    );
}
