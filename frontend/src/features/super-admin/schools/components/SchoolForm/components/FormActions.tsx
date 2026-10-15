"use client";

import { Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormActionsProps {
    loading?: boolean;
    editMode?: boolean;
    submitText?: string;
    updateText?: string;
    onCancel?: () => void;
}

export default function FormActions({
    loading = false,
    editMode = false,
    submitText = "Create School",
    updateText = "Update School",
    onCancel,
}: FormActionsProps) {
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
            return;
        }

        window.history.back();
    };

    return (
        <div className="sticky bottom-0 z-20 flex flex-col-reverse gap-3 rounded-2xl border bg-background/90 p-4 backdrop-blur md:flex-row md:items-center md:justify-end">
            <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="w-full md:w-auto"
            >
                <X className="mr-2 h-4 w-4" />
                Cancel
            </Button>

            <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto min-w-[180px]"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editMode ? "Updating..." : "Creating..."}
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {editMode ? updateText : submitText}
                    </>
                )}
            </Button>
        </div>
    );
}