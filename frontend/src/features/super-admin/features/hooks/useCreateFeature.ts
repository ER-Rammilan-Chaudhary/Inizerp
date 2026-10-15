import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createFeature } from "../api/feature.api";
import type {CreateFeaturePayload,ERPModule,
} from "../types/feature.types";
import { featureKeys } from "./useFeatureList";

interface ApiErrorResponse {
  message?: string;
}

export const useCreateFeature = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ERPModule,
    AxiosError<ApiErrorResponse>,
    CreateFeaturePayload
  >({
    mutationFn: createFeature,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: featureKeys.all,
      });

      toast.success("Feature created successfully");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to create feature",
      );
    },
  });
};