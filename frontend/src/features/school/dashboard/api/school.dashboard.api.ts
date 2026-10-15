import api from "@/api/client";

import type {
  SchoolDashboardResponse,
  SchoolEnabledModulesResponse,
} from "../types/school.types";


//  base url 
const BASE_URL = "/school/dashboard";

// School dashboard
export const getSchoolDashboard =
  async (): Promise<SchoolDashboardResponse> => {
    const { data } = await api.get<SchoolDashboardResponse>(`${BASE_URL}`);
    return data;
  };

  // School moduls 
export const getSchoolEnabledModules =
  async (): Promise<SchoolEnabledModulesResponse> => {
    const { data } = await api.get<SchoolEnabledModulesResponse>(`${BASE_URL}/modules`,);
    console.log("data", data);
    return data;
  };
