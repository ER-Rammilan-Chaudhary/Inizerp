"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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

import { useRenewSubscription } from "../hooks/useSubscriptionMutation";

import { Subscription } from "../types/subscription";

const schema = z.object({
    endDate: z.string().min(1, "End date is required"),
});

type FormValues = z.infer<typeof schema>;

interface RenewSubscriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscription?: Subscription;
}

export default function RenewSubscriptionDialog({
    open,
    onOpenChange,
    subscription,
}: RenewSubscriptionDialogProps) {
    const renewMutation =
        useRenewSubscription();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),

        defaultValues: {
            endDate: "",
        },
    });

    useEffect(() => {
        if (!subscription) {
            form.reset({
                endDate: "",
            });

            return;
        }

        form.reset({ endDate: subscription.endDate.slice(0, 10,), });
    }, [subscription, form]);

    const onSubmit = async (values: FormValues,) => {
        if (!subscription) { return; }


        try {
            await renewMutation.mutateAsync({
                id: subscription.id,
                endDate: values.endDate,
            });

            onOpenChange(false);

            form.reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-md">

                <DialogHeader>

                    <DialogTitle>
                        Renew Subscription
                    </DialogTitle>

                </DialogHeader>

                <Form {...form}>

                    <form
                        onSubmit={form.handleSubmit(
                            onSubmit,
                        )}
                        className="space-y-6"
                    >

                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>

                                    <FormLabel>
                                        New End Date
                                    </FormLabel>

                                    <FormControl>

                                        <Input
                                            type="date"
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
                                onClick={() =>
                                    onOpenChange(false)
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    renewMutation.isPending
                                }
                            >
                                {renewMutation.isPending
                                    ? "Renewing..."
                                    : "Renew Subscription"}
                            </Button>

                        </div>

                    </form>

                </Form>

            </DialogContent>
        </Dialog>
    );
}