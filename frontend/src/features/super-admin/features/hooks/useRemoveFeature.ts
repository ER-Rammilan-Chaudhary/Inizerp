import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { removeFeature } from "../api/feature.api";
import { featureKeys } from "./useFeatureList";
import { schoolFeatureKeys } from "./useSchoolFeatures";

interface ApiErrorResponse {
  message?: string;
}

export const useRemoveFeature = (
  schoolId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationKey: ["remove-feature", schoolId],

    mutationFn: (moduleId) =>
      removeFeature(schoolId, moduleId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: schoolFeatureKeys.detail(schoolId),
      });

      await queryClient.invalidateQueries({
        queryKey: featureKeys.all,
      });

      toast.success("Feature removed successfully");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to remove feature",
      );
    },
  });
};