import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { assignFeature } from "../api/feature.api";
import type {
  AssignFeaturePayload,
} from "../types/feature.types";
import { schoolFeatureKeys } from "./useSchoolFeatures";

interface ApiErrorResponse {
  message?: string;
}

export const useUpdateSchoolFeatures = (
  schoolId: string,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    AssignFeaturePayload
  >({
    mutationFn: (payload) =>
      assignFeature(schoolId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: schoolFeatureKeys.detail(schoolId),
      });

      toast.success("Feature assigned successfully");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to assign feature",
      );
    },
  });

  return {
    assignFeature: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};