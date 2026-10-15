"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useDeleteSchool, } from "../hooks/useDeleteSchool";

interface DeleteSchoolDialogProps { schoolId: string; schoolName: string; }

export default function DeleteSchoolDialog({ schoolId, schoolName, }: DeleteSchoolDialogProps) {

    const [confirmName, setConfirmName] = useState(""); const deleteMutation = useDeleteSchool();
    const canDelete = confirmName.trim().toLowerCase() === schoolName.trim().toLowerCase();


    function handleDelete() {
        if (!canDelete) return;
        deleteMutation.mutate(schoolId, {
            onSuccess: () => {
                toast.success("School deleted successfully");
                window.location.href = "/super-admin/schools";
            },

            onError: () => {
                toast.error("Failed to delete school");
            },
        }
        );
    }

    return (
        <AlertDialog>

            <AlertDialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition cursor-pointer" >
                <Trash2 className="h-4 w-4" />Delete School
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 font-semibold text-lg">
                        Delete School
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground leading-6">
                        This action cannot be undone.
                        All school related data will be permanently removed.
                    </AlertDialogDescription>
                    <label className="space-y-2 text-sm font-medium">
                        Type {schoolName} to confirm
                        <Input
                            value={confirmName}
                            onChange={(event) => setConfirmName(event.target.value)}
                            autoComplete="off"
                        />
                    </label>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        onClick={handleDelete}
                        disabled={!canDelete || deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

}