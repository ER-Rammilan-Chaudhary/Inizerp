"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import UserFilters from "@/features/super-admin/users/components/UserFilters";
import UserTable from "@/features/super-admin/users/components/UserTable";
import DeleteUserDialog from "@/features/super-admin/users/components/DeleteUserDialog";
import ResetPasswordDialog from "@/features/super-admin/users/components/ResetPasswordDialog";
import UserViewDialog from "@/features/super-admin/users/components/UserViewDialog";
import Pagination from "@/components/tables/Pagination";

import {
    useUsers,
    useDeleteUser,
    useResetUserPassword,
} from "@/features/super-admin/users/hooks/useUsers";

import {
    User,
    UserRole,
    UserStatus,
} from "@/features/super-admin/users/types/user.types";

import Loader from "@/components/common/Loader";
import { useSearchStore } from "@/store/search.store";
import { getErrorMessage } from "@/lib/error-message";

export default function UsersPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const search = useSearchStore((state) => state.search);
    // URL se page
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const [role, setRole] = useState<UserRole | "">("");
    const [schoolId, setSchoolId] = useState("");
    const [status, setStatus] = useState<UserStatus | "">("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);

    // CHANGE PAGE
    const changePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // GET USERS
    const { data, isLoading, isFetching, }
        = useUsers({
            page, limit, search, ...(role ? { role } : {}), ...(schoolId ? { schoolId } : {}), ...(status ? { status } : {}),
        });


    const users = data?.data?.users ?? [];
    const pagination = data?.data?.pagination;

    // FILTERS
    const handleRoleChange = (value: UserRole | "") => {
        setRole(value);
        changePage(1);
    };

    const handleSchoolChange = (value: string) => {
        setSchoolId(value);
        changePage(1);
    };

    const handleStatusChange = (value: UserStatus | "") => {
        setStatus(value);
        changePage(1);
    };

    const handleResetFilters = () => {
        setRole("");
        setSchoolId("");
        setStatus("");

        changePage(1);
    };

    // VIEW
    const handleView = (user: User) => {
        setSelectedUser(user);
        setViewOpen(true);
    };

    // EDIT
    const handleEdit = (user: User) => {
        router.push(`/super-admin/users/${user.id}/edit`);
    };

    // DELETE
    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteOpen(true);
    };

    // RESET PASSWORD
    const handleResetPassword = (user: User) => {
        setSelectedUser(user);
        setResetOpen(true);
    };

    // CONFIRM DELETE
    const deleteMutation = useDeleteUser();

    const confirmDelete = async () => {
        if (!selectedUser) {
            return;
        }
        try {
            await deleteMutation.mutateAsync(selectedUser.id);

            toast.success("User deleted successfully");

            setDeleteOpen(false);
            setSelectedUser(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to delete user"));
        }
    };

    // CONFIRM RESET PASSWORD
    const resetMutation = useResetUserPassword();

    const confirmResetPassword = async (
        password: string
    ) => {
        if (!selectedUser) {
            return;
        }

        try {
            await resetMutation.mutateAsync({
                id: selectedUser.id,
                data: {
                    password,
                },
            });

            toast.success("Password reset successfully");

            setResetOpen(false);
            setSelectedUser(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to reset password"));
        }
    };

    // SCHOOLS
    const schools: {
        id: string;
        name: string;
        code: string;
    }[] = [];

    // ADD USER
    const handleAddUser = () => {
        router.push("/super-admin/users/new");
    };

    // RENDER
    return (
        <div className="space-y-6 pb-10">

            {/* HEADER */}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Users
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage Super Admins and School Admins
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={handleAddUser}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* FILTERS */}

            <UserFilters
                role={role}
                schoolId={schoolId}
                status={status}
                schools={schools}
                onRoleChange={handleRoleChange}
                onSchoolChange={handleSchoolChange}
                onStatusChange={handleStatusChange}
                onReset={handleResetFilters}
            />

            {/* TABLE */}

            {isLoading ? (
                <Loader text="Data loading..." />
            ) : (
                <>
                    <UserTable
                        users={users}
                        onView={handleView}
                        onEdit={handleEdit}
                        onResetPassword={handleResetPassword}
                        onDelete={handleDelete}
                    />

                    {/* PAGINATION */}

                    {pagination && (
                        <Pagination
                            pagination={pagination}
                        />
                    )}
                </>
            )}

            {/* FETCHING INDICATOR */}

            {isFetching && !isLoading && (
                <div className="text-center text-xs text-muted-foreground">
                    Updating...
                </div>
            )}

            {/* VIEW USER */}

            <UserViewDialog
                user={selectedUser}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />

            {/* DELETE USER */}

            <DeleteUserDialog
                user={selectedUser}
                open={deleteOpen}
                loading={deleteMutation.isPending}
                onOpenChange={setDeleteOpen}
                onConfirm={confirmDelete}
            />

            {/* RESET PASSWORD */}

            <ResetPasswordDialog
                user={selectedUser}
                open={resetOpen}
                loading={resetMutation.isPending}
                onOpenChange={setResetOpen}
                onConfirm={confirmResetPassword}
            />
        </div>
    );
}
