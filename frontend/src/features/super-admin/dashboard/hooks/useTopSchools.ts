"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopSchools } from "../api/dashboard.api";

export function useTopSchools() {
  return useQuery({
    queryKey: ["top-schools"],
    queryFn: getTopSchools,
  });
}
