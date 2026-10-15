// hooks/useSettings.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { getSettings } from "../api/settings.api";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.list,
    queryFn: getSettings,
    staleTime: 30_000,
  });
}
