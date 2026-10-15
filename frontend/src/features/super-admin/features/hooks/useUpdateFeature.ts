import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateFeature } from "../api/feature.api";
import type {
  ERPModule,
  UpdateFeaturePayload,
} from "../types/feature.types";
import { featureKeys } from "./useFeatureList";

interface ApiErrorResponse {
  message?: string;
}

interface UpdateFeatureInput {
  moduleId: string;
  payload: UpdateFeaturePayload;
}

export const useUpdateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ERPModule,
    AxiosError<ApiErrorResponse>,
    UpdateFeatureInput
  >({
    mutationFn: ({ moduleId, payload }) =>
      updateFeature(moduleId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: featureKeys.all,
      });

      toast.success("Feature updated successfully");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to update feature",
      );
    },
  });
};