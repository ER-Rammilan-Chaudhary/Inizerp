"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import FeatureForm from "./FeatureForm";
import { useUpdateFeature } from "../hooks/useUpdateFeature";

import type { ERPModule } from "../types/feature.types";
import type { FeatureFormValues } from "../schemas/feature.schema";

interface Props {
    feature: ERPModule;
}

export default function EditFeatureDialog({
    feature,
}: Props) {
    const [open, setOpen] = useState(false);

    const {
        mutateAsync: updateFeature,
        isPending,
    } = useUpdateFeature();

    const defaultValues: FeatureFormValues = {
        name: feature.name,
        key: feature.key,
        category: feature.category,
        description: feature.description ?? "",
        icon: feature.icon ?? "",
        route: feature.route ?? "",
        isActive: feature.isActive,
    };

    const handleSubmit = async (
        values: FeatureFormValues,
    ) => {
        await updateFeature({
            moduleId: feature.id,
            payload: values,
        });

        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                }
            />

            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Edit Feature
                    </DialogTitle>
                </DialogHeader>

                <FeatureForm
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                    isSubmitting={isPending}
                />
            </DialogContent>
        </Dialog>
    );
}