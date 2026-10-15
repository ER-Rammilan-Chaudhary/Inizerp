"use client";

import { useState } from "react";
import {
    Trash2,
    TriangleAlert,
} from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { useDeleteFeature } from "../hooks/useDeleteFeature";
import type { ERPModule } from "../types/feature.types";

interface Props {
    feature: ERPModule;
}

export default function DeleteFeatureDialog({
    feature,
}: Props) {
    const [open, setOpen] = useState(false);

    const {
        mutateAsync: deleteFeature,
        isPending,
    } = useDeleteFeature();

    const handleDelete = async () => {
        await deleteFeature(feature.id);
        setOpen(false);
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogTrigger
                render={
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                }
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <TriangleAlert className="size-6 text-destructive" />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                        Delete Feature
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{feature.name}</strong>?
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        disabled={isPending}
                        onClick={handleDelete}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}