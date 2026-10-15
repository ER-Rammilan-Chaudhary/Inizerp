"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
}

export const maintenanceQueryKey = ["maintenance-status"] as const;

export async function fetchMaintenanceStatus(): Promise<MaintenanceStatus> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const res = await fetch(`${baseUrl}/auth/maintenance-status?_t=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
    },
  });

  if (!res.ok) {
    return {
      enabled: false,
      message: "System operational",
    };
  }

  const json = await res.json();
  return (
    json?.data ?? {
      enabled: false,
      message: "System operational",
    }
  );
}

export function useMaintenanceStatus() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: maintenanceQueryKey,
    queryFn: fetchMaintenanceStatus,
    staleTime: 2_000,
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });

  // Listen for instant local updates across components
  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKey });
      query.refetch();
    };

    window.addEventListener("maintenance-status-updated", handleUpdate);
    return () => {
      window.removeEventListener("maintenance-status-updated", handleUpdate);
    };
  }, [queryClient, query]);

  return query;
}
