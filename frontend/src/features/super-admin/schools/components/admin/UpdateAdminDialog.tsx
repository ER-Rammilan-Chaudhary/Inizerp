"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUpdateSchoolAdmin } from "@/features/super-admin/schools/hooks/useUpdateSchoolAdmin";

import type { SchoolAdmin } from "@/features/super-admin/schools/api/school-admin.api";
import { getErrorMessage } from "@/lib/error-message";

const schema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface UpdateAdminDialogProps {
    schoolId: string;
    admin: SchoolAdmin;
}

export function UpdateAdminDialog({
    schoolId,
    admin,
}: UpdateAdminDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: admin.fullName,
            email: admin.email,
            phone: admin.phone ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                fullName: admin.fullName,
                email: admin.email,
                phone: admin.phone ?? "",
            });
        }
    }, [open, admin, form]);

    const { mutate, isPending } = useUpdateSchoolAdmin(schoolId);

    const onSubmit = (values: FormValues) => {
        mutate(values, {
            onSuccess: () => {
                toast.success("School administrator updated successfully.");
                setOpen(false);
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "Failed to update administrator."));
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Admin
                    </Button>
                }
            />

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit School Administrator</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>

                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>

                                    <FormControl>
                                        <Input
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? "Updating..." : "Update Admin"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}