"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardCharts } from "../api/dashboard.api";

export function useDashboardCharts() {
  return useQuery({
    queryKey: ["dashboard-charts"],
    queryFn: getDashboardCharts,
  });
}
