"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecentActivities } from "../api/dashboard.api";

export function useRecentActivities() {
  return useQuery({
    queryKey: ["recent-activities"],
    queryFn: getRecentActivities,
  });
}
