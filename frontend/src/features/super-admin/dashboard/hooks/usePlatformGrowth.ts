"use client";
import { useQuery } from "@tanstack/react-query";
import { getPlatformGrowth } from "../api/dashboard.api";
import type { PlatformGrowthResponse } from "@/features/super-admin/dashboard/types/dashboard";


export function usePlatformGrowth() {
  return useQuery<PlatformGrowthResponse>({
    queryKey: ["platform-growth"],

    queryFn: getPlatformGrowth,
  });
}
