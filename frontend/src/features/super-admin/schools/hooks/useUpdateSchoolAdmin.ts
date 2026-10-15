import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateSchoolAdmin,
  type UpdateSchoolAdminPayload,
} from "../api/school-admin.api";

export function useUpdateSchoolAdmin(schoolId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSchoolAdminPayload) =>
      updateSchoolAdmin(schoolId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["school-admin", schoolId],
      });
    },
  });
}
