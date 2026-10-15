"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { resetSchoolAdminPassword } from "../api/school.api";
import { getErrorMessage } from "@/lib/error-message";

export function useResetSchoolPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schoolId: string) => resetSchoolAdminPassword(schoolId),

    onSuccess: (response) => {
      toast.success(response.message || "Password reset successfully");

      queryClient.invalidateQueries({
        queryKey: ["schools"],
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Password reset failed"));
    },
  });
}
