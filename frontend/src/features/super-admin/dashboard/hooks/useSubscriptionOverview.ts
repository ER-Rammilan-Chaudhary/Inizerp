"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscriptionOverview } from "../api/dashboard.api";

export function useSubscriptionOverview() {
  return useQuery({
    queryKey: ["subscription-overview"],
    queryFn: getSubscriptionOverview,
  });
}
