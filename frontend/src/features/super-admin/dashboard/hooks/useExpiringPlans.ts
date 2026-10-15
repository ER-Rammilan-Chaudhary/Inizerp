import { useQuery } from "@tanstack/react-query";
import { getExpiringSubscriptions } from "../api/dashboard.api";

export function useExpiringPlans() {
  return useQuery({
    queryKey: ["expiring-plans"],
    queryFn: getExpiringSubscriptions,
  });
}
