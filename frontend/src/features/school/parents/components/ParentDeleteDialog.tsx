"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Parent } from "../types/parents.types";

interface ParentDeleteDialogProps {
    open: boolean;
    parentItem: Parent | null;
    loading: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
}

export default function ParentDeleteDialog({
    open,
    parentItem,
    loading,
    onOpenChange,
    onConfirm,
}: ParentDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-destructive font-bold">
                        Delete Parent Account
                    </DialogTitle>
                    <DialogDescription className="space-y-2 pt-1 text-sm text-muted-foreground">
                        Are you sure you want to delete{" "}
                        <strong className="text-foreground">
                            {parentItem?.user.fullName}
                        </strong>
                        ? This will remove the parent's portal account and dissociate any linked students.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                        className="font-medium"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Parent
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
