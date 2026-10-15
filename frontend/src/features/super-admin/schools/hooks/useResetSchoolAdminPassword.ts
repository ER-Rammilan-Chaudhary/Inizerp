import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  resetSchoolAdminPassword,
  type ResetPasswordPayload,
} from "../api/school-admin.api";

export function useResetSchoolAdminPassword(schoolId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      resetSchoolAdminPassword(schoolId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["school-admin", schoolId],
      });
    },
  });
}
