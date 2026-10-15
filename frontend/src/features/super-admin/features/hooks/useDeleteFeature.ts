import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteFeature } from "../api/feature.api";
import { featureKeys } from "./useFeatureList";

interface ApiErrorResponse {
  message?: string;
}

export const useDeleteFeature = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,string>({
    mutationFn: deleteFeature,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: featureKeys.all,
      });

      toast.success("Feature deleted successfully");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to delete feature",
      );
    },
  });
};