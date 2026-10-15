// features/setting/hooks/useUploadSettingFile.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { uploadSettingFile } from "../api/settings.api";

export function useUploadSettingFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: "logo" | "favicon" }) =>
      uploadSettingFile(file, type),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.settings.all,
      });
    },
  });
}
