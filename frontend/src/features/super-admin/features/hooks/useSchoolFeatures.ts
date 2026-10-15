import { useQuery } from "@tanstack/react-query";

import { getSchoolFeatures } from "../api/feature.api";
import type { SchoolModule } from "../types/feature.types";

export const schoolFeatureKeys = {
  all: ["school-features"] as const,
  detail: (schoolId: string) =>
    ["school-features", schoolId] as const,
};

export const useSchoolFeatures = (
  schoolId: string,
) => {
  return useQuery<SchoolModule[]>({
    queryKey: schoolFeatureKeys.detail(schoolId),
    queryFn: () => getSchoolFeatures(schoolId),
    enabled: Boolean(schoolId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};