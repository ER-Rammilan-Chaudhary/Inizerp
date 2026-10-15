"use client";
import { useQuery } from "@tanstack/react-query";
import { getRecentSchools } from "../api/dashboard.api";

export function useRecentSchools() {
  return useQuery({
    queryKey: ["recent-schools"],
    queryFn: getRecentSchools,
  });
}
