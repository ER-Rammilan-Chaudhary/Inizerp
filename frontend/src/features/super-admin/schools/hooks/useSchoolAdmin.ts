import { useQuery } from "@tanstack/react-query";

import { getSchoolAdmin } from "../api/school-admin.api";

export function useSchoolAdmin(schoolId: string) {
  return useQuery({
    queryKey: ["school-admin", schoolId],

    queryFn: () => getSchoolAdmin(schoolId),

    enabled: !!schoolId,
  });
}
