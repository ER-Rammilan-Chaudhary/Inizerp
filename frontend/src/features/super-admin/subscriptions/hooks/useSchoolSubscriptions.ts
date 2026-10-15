"use client";

import { useQuery } from "@tanstack/react-query";

import { getSchoolSubscriptions } from "../api/subscription.api";

import { queryKeys } from "@/lib/react-query/queryKeys";

export function useSchoolSubscriptions(schoolId: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.school(schoolId),

    queryFn: () => getSchoolSubscriptions(schoolId),

    enabled: !!schoolId,

    staleTime: 1000 * 60 * 5,
  });
}
