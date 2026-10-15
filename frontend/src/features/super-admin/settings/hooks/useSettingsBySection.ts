// features/settings/hooks/useSettingsBySection.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { getSettingsBySection } from "../api/settings.api";

export function useSettingsBySection(
  section: "general" | "security" | "system",
) {
  return useQuery({
    queryKey: queryKeys.settings.section(section),
    queryFn: () => getSettingsBySection(section),
    enabled: Boolean(section),
  });
}
