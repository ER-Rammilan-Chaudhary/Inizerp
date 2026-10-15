"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscriptionStats } from "../api/subscription.api";
import { queryKeys } from "@/lib/react-query/queryKeys";

export function useSubscriptionStats() {
  return useQuery({
    queryKey: queryKeys.subscriptions.stats,
    queryFn: getSubscriptionStats,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
