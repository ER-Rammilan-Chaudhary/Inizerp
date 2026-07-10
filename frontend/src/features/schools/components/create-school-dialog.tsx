"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import SchoolForm from "./school-form";

import { CreateSchoolDto } from "@/types/school";
import { useSchools } from "../hooks/use-schools";

interface CreateSchoolDialogProps {
  onSuccess?: () => void;
}

export default function CreateSchoolDialog({
  onSuccess,
}: CreateSchoolDialogProps) {
  const { addSchool, loading } = useSchools();

  const [open, setOpen] = useState(false);

  const handleSubmit = async (
    values: CreateSchoolDto,
  ) => {
    await addSchool(values);

    setOpen(false);

    onSuccess?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create School
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Create School
          </DialogTitle>

          <DialogDescription>
            Add a new school to your ERP.
          </DialogDescription>
        </DialogHeader>

        <SchoolForm
          loading={loading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}