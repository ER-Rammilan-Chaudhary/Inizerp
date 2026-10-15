"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSchool } from "../api/school.api";

export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schoolId: string) => deleteSchool(schoolId),

    onSuccess: (_, schoolId) => {
      queryClient.removeQueries({
        queryKey: ["school", schoolId],
      });

      queryClient.invalidateQueries({
        queryKey: ["schools"],
      });
    },
  });
}
