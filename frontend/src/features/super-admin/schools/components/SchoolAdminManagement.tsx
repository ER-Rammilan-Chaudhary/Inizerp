

"use client";

import { useState } from "react";
import { Mail, Phone, ShieldCheck, User, Pencil, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import ErrorPage from "@/components/common/error/ErrorPage";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSchoolAdmin } from "../hooks/useSchoolAdmin";
import { useUpdateSchoolAdmin } from "../hooks/useUpdateSchoolAdmin";
import { useResetSchoolAdminPassword } from "../hooks/useResetSchoolAdminPassword";


interface Props {
    schoolId: string;
}


export default function SchoolAdminManagement({
    schoolId,
}: Props) {

    const {
        data: admin,
        isLoading,
        isError,
        error,
    } = useSchoolAdmin(schoolId);


    const updateMutation =
        useUpdateSchoolAdmin(schoolId);


    const resetMutation =
        useResetSchoolAdminPassword(schoolId);


    const [openEdit, setOpenEdit] = useState(false);
    const [openReset, setOpenReset] = useState(false);


    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
    });


    const [password, setPassword] =
        useState("");



    const openEditDialog = () => {

        if (admin) {

            setForm({
                fullName: admin.fullName,
                email: admin.email,
                phone: admin.phone ?? "",
            });

        }

        setOpenEdit(true);
    };



    const handleUpdate = () => {

        updateMutation.mutate(form, {

            onSuccess: () => {

                toast.success(
                    "Admin updated successfully"
                );

                setOpenEdit(false);

            },

            onError: () => {

                toast.error(
                    "Failed to update admin"
                );

            }

        });

    };



    const handleResetPassword = () => {

        resetMutation.mutate(
            {
                password
            },
            {

                onSuccess: () => {

                    toast.success(
                        "Password reset successfully"
                    );

                    setPassword("");
                    setOpenReset(false);

                },

                onError: () => {

                    toast.error(
                        "Password reset failed"
                    );

                }

            });

    };

    if (isLoading) {
        return <Loader text="Loading admin details..." />;
    }

    if (isError) {
        return (
            <ErrorPage
                title="Unable to load admin"
                message={error instanceof Error ? error.message : "Please try again in a moment."}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (

        <div className="rounded-xl border bg-card p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-semibold">
                        School Admin
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage administrator access
                    </p>
                </div>


                <ShieldCheck className="h-5 w-5 text-primary" />

            </div>



            {admin ? (

                <div className="space-y-4">


                    <div className="grid gap-3 sm:grid-cols-2">


                        <InfoCard
                            icon={<User />}
                            label="Name"
                            value={admin.fullName}
                        />


                        <InfoCard
                            icon={<Mail />}
                            label="Email"
                            value={admin.email}
                        />


                        <InfoCard
                            icon={<Phone />}
                            label="Phone"
                            value={admin.phone || "-"}
                        />


                        <InfoCard
                            icon={<ShieldCheck />}
                            label="Role"
                            value={admin.role}
                        />


                    </div>



                    <div className="flex gap-2">

                        <Dialog
                            open={openEdit}
                            onOpenChange={setOpenEdit}
                        >

                            <DialogTrigger
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                onClick={openEditDialog}
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Admin
                            </DialogTrigger>


                            <DialogContent>

                                <DialogHeader>
                                    <DialogTitle>
                                        Update Admin
                                    </DialogTitle>
                                </DialogHeader>


                                <div className="space-y-3">

                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            value={form.fullName}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    fullName: e.target.value
                                                })
                                            }
                                        />
                                    </div>


                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value
                                                })
                                            }
                                        />
                                    </div>


                                    <div>
                                        <Label>Phone</Label>
                                        <Input
                                            value={form.phone}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    phone: e.target.value
                                                })
                                            }
                                        />
                                    </div>


                                    <Button
                                        onClick={handleUpdate}
                                        disabled={
                                            updateMutation.isPending
                                        }
                                    >
                                        Save Changes
                                    </Button>


                                </div>

                            </DialogContent>


                        </Dialog>



                        <Dialog
                            open={openReset}
                            onOpenChange={setOpenReset}
                        >

                            <DialogTrigger
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
                            >
                                <KeyRound className="h-4 w-4" />
                                Reset Password
                            </DialogTrigger>


                            <DialogContent>

                                <DialogHeader>

                                    <DialogTitle>
                                        Reset Admin Password
                                    </DialogTitle>

                                </DialogHeader>


                                <Input
                                    type="password"
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />


                                <Button
                                    onClick={
                                        handleResetPassword
                                    }
                                >
                                    Reset Password
                                </Button>


                            </DialogContent>

                        </Dialog>


                    </div>

                </div>


            ) : (

                <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                    No admin assigned
                </div>

            )}


        </div>

    );

}



function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {

    return (

        <div className="flex items-center gap-3 rounded-lg border p-3">

            <div className="text-muted-foreground">
                {icon}
            </div>

            <div>
                <p className="text-xs text-muted-foreground">
                    {label}
                </p>

                <p className="font-medium">
                    {value}
                </p>
            </div>

        </div>

    );

}