"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSchoolStatus } from "../api/school.api";
import type { SchoolStatus } from "@/features/super-admin/schools/types/school";
export function useUpdateSchoolStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schoolId,
      status,
    }: {
      schoolId: string;
      status: SchoolStatus;
    }) => updateSchoolStatus(schoolId, status),

    onSuccess: (data, variables) => {
      // update single school cache
      queryClient.setQueryData(["school", variables.schoolId], data);
      // refresh list
      queryClient.invalidateQueries({
        queryKey: ["schools"],
      });
    },
  });
}
