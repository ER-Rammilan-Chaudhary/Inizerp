// features/setting/hooks/useUpdateSettings.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { updateSettings } from "../api/settings.api";
import { maintenanceQueryKey } from "@/hooks/useMaintenanceStatus";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Record<string, unknown>) => updateSettings(settings),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.settings.all,
        }),
        queryClient.invalidateQueries({
          queryKey: maintenanceQueryKey,
        }),
      ]);

      await Promise.all([
        queryClient.refetchQueries({
          queryKey: queryKeys.settings.all,
        }),
        queryClient.refetchQueries({
          queryKey: maintenanceQueryKey,
        }),
      ]);

      // Broadcast event for instant 0ms sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("maintenance-status-updated"));
      }
    },
  });
}
