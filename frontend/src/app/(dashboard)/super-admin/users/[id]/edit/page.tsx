"use client";

import { useParams, useRouter } from "next/navigation";
import UserEditForm from "@/features/super-admin/users/components/UserEditForm";
import { useUser } from "@/features/super-admin/users/hooks/useUsers";
import { useSchools } from "@/features/super-admin/schools/hooks/useSchools";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const id = typeof params.id === "string" ? params.id : "";
    const { data: userData, isLoading: userLoading, isError: userError, error: userQueryError, } = useUser(id);
    const { data: schoolsData, isLoading: schoolsLoading, } = useSchools({ page: 1, limit: 100, });
    const schools = schoolsData?.schools ?? [];
    const user = userData?.data;

    if (userLoading || schoolsLoading) {
        return (<Loader text=" User Loading..."></Loader>)
    }


    if (userError || !user) {
        return (
            <ErrorPage
                title="Unable to load user"
                message={userQueryError instanceof Error ? userQueryError.message : "Please try again in a moment."}
                onRetry={() => window.location.reload()}
            />
        );
    }
    // --------------------------------------------
    // Page
    // --------------------------------------------

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit User: {user.fullName}</h1>
                <p className="text-xs text-muted-foreground">Update administrator credentials, assigned school, and account status.</p>
            </div>

            {/* Form */}
            <UserEditForm key={user.id} user={user}
                schools={schools}
                onSuccess={() => router.push("/super-admin/users",)}
                onCancel={() => router.push("/super-admin/users",)}
            />
        </div>
    );
}