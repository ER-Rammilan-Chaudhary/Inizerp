import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleFeature } from "../api/feature.api";
import { featureKeys } from "./useFeatureList";
import { schoolFeatureKeys } from "./useSchoolFeatures";

interface ToggleFeaturePayload {
  moduleId: string;
  enabled: boolean;
}

interface ApiErrorResponse {
  message?: string;
}

export const useToggleFeature = (
  schoolId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle-feature", schoolId],

    mutationFn: ({
      moduleId,
      enabled,
    }: ToggleFeaturePayload) =>
      toggleFeature(
        schoolId,
        moduleId,
        enabled,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: schoolFeatureKeys.detail(schoolId),
      });

      await queryClient.invalidateQueries({
        queryKey: featureKeys.all,
      });

      toast.success("Feature updated successfully");
    },

    onError: (
      error: AxiosError<ApiErrorResponse>,
    ) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to update feature",
      );
    },
  });
};