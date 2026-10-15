"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSchool } from "../api/school.api";

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({schoolId,payload,}: {
      schoolId: string;

      payload: FormData;
    }) => updateSchool(schoolId, payload),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(["school", variables.schoolId], data);

      queryClient.invalidateQueries({
        queryKey: ["schools"],
      });
    },
  });
}
