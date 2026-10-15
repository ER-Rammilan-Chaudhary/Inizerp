"use client";

import { useQuery } from "@tanstack/react-query";

import { getSchoolById } from "../api/school.api";
import { queryKeys } from "@/lib/react-query/queryKeys";

export function useSchool(schoolId?: string) {
  return useQuery({
    queryKey: schoolId ? queryKeys.schools.detail(schoolId)
      : queryKeys.schools.all,

    queryFn: () => getSchoolById(schoolId!),

    enabled: !!schoolId,

    staleTime: 1000 * 60 * 5,
  });
}
