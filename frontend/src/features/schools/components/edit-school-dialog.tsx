"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SchoolForm from "./school-form";

import { School, UpdateSchoolDto } from "@/types/school";
import { useSchools } from "../hooks/use-schools";

interface EditSchoolDialogProps {
  open: boolean;
  school: School | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditSchoolDialog({
  open,
  school,
  onOpenChange,
  onSuccess,
}: EditSchoolDialogProps) {
  const { editSchool, loading } = useSchools();

  const [initialData, setInitialData] = useState<School | undefined>(
    undefined,
  );

  useEffect(() => {
    if (school) {
      setInitialData(school);
    } else {
      setInitialData(undefined);
    }
  }, [school]);

  const handleSubmit = async (values: UpdateSchoolDto) => {
    if (!school) return;

    await editSchool(school.id, values);

    onOpenChange(false);

    onSuccess?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>

          <DialogDescription>
            Update school information.
          </DialogDescription>
        </DialogHeader>

        {initialData && (
          <SchoolForm
            initialData={initialData}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}