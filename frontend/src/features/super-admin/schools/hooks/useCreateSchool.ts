"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { createSchool } from "../api/school.api";

import type { CreateSchoolDto } from "@/features/super-admin/schools/types/school";
import { getErrorMessage } from "@/lib/error-message";

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSchoolDto) => createSchool(payload),

    onSuccess: (response) => {
      toast.success(response.message || "School created successfully");

      queryClient.invalidateQueries({
        queryKey: ["schools"],
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create school"));
    },
  });
}
