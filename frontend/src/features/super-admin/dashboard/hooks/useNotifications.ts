

import { useQuery } from "@tanstack/react-query";
import { getRecentNotifications } from "../api/dashboard.api";

export function useNotifications() {
  return useQuery({
    queryKey: ["dashboard-notifications"],
    queryFn: getRecentNotifications,
    staleTime: 1000 * 60,
  });
}
