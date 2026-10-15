"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useResetSchoolAdminPassword } from "@/features/super-admin/schools/hooks/useResetSchoolAdminPassword";
import { getErrorMessage } from "@/lib/error-message";

const schema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type FormValues = z.infer<typeof schema>;

interface ResetPasswordDialogProps {
    schoolId: string;
}

export function ResetPasswordDialog({
    schoolId,
}: ResetPasswordDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const { mutate, isPending } =
        useResetSchoolAdminPassword(schoolId);

    const onSubmit = (values: FormValues) => {
        mutate(
            {
                password: values.password,
            },
            {
                onSuccess: () => {
                    toast.success("Password reset successfully.");

                    form.reset();

                    setOpen(false);
                },

                onError: (error) => {
                    toast.error(getErrorMessage(error, "Failed to reset password."));
                },
            }
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                render={
                    <Button variant="outline">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Reset Password
                    </Button>
                }
            />

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Reset Administrator Password
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>

                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter new password"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Confirm Password
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm password"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Resetting..."
                                    : "Reset Password"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}