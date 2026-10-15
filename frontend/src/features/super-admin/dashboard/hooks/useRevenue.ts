"use client";

import { useQuery } from "@tanstack/react-query";
import { getRevenueStats } from "../api/dashboard.api";

export function useRevenue() {
  return useQuery({
    queryKey: ["dashboard", "revenue"],
    queryFn: getRevenueStats,
  });
}
