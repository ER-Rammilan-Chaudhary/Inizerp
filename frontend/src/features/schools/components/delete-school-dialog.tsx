"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { School } from "@/types/school";
import { useSchools } from "../hooks/use-schools";

interface DeleteSchoolDialogProps {
  open: boolean;
  school: School | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DeleteSchoolDialog({
  open,
  school,
  onOpenChange,
  onSuccess,
}: DeleteSchoolDialogProps) {
  const { removeSchool } = useSchools();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!school) return;

    try {
      setLoading(true);

      await removeSchool(school.id);

      onOpenChange(false);

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>

          <AlertDialogTitle className="text-center">
            Delete School
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {school?.name}
            </span>
            ?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void handleDelete();
            }}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}