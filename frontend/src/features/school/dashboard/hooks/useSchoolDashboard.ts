import { useQuery } from "@tanstack/react-query";

import { getSchoolDashboard } from "../api/school.dashboard.api";

export const schoolDashboardKeys = {all: ["school-dashboard"] as const,

  dashboard: () => [...schoolDashboardKeys.all, "dashboard"] as const,
};

export const useSchoolDashboard = () => {
  return useQuery({
    queryKey: schoolDashboardKeys.dashboard(),
    queryFn: getSchoolDashboard,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
