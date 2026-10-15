"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import FeatureForm from "./FeatureForm";
import { useCreateFeature } from "../hooks/useCreateFeature";
import type { FeatureFormValues } from "../schemas/feature.schema";

export default function CreateFeatureDialog() {
    const [open, setOpen] = useState(false);

    const {
        mutateAsync: createFeature,
        isPending,
    } = useCreateFeature();

    const handleSubmit = async (
        values: FeatureFormValues,
    ) => {
        await createFeature(values);
        setOpen(false);
        toast.success("Feature created successfully");
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                render={
                    <Button type="button">
                        Add Feature
                    </Button>
                }
            />

            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Create Feature
                    </DialogTitle>
                </DialogHeader>

                <FeatureForm
                    onSubmit={handleSubmit}
                    isSubmitting={isPending}
                />
            </DialogContent>
        </Dialog>
    );
}