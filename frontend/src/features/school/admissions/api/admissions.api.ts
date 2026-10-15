import api from "@/api/client";

import type {
  AdmissionResponse,
  AdmissionsResponse,
  AdmissionsFilterParams,
  CreateAdmissionPayload,
  UpdateAdmissionPayload,
} from "../types/admissions.types";

const BASE_URL = "school/admissions";

export const admissionsApi = {getAdmissions: async (params?: AdmissionsFilterParams,): Promise<AdmissionsResponse> => {
    const { data } = await api.get<AdmissionsResponse>(BASE_URL, {params,});

    return data;
  },

  getAdmissionById: async (id: string): Promise<AdmissionResponse> => {
    const { data } = await api.get<AdmissionResponse>(`${BASE_URL}/${id}`);

    return data;
  },

  createAdmission: async (payload: CreateAdmissionPayload,): Promise<AdmissionResponse> => {
    const { data } = await api.post<AdmissionResponse>(`${ BASE_URL }`,payload,);

    return data;
  },

  updateAdmission: async (id: string,payload: UpdateAdmissionPayload,): Promise<AdmissionResponse> => {
    const { data } = await api.patch<AdmissionResponse>(`${BASE_URL}/${id}`,payload,);

    return data;
  },

  deleteAdmission: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete<{ success: boolean; message: string }>(
      `${BASE_URL}/${id}`,
    );

    return data;
  },

  getNextApplicationNo: async (
    academicYearId?: string,
  ): Promise<{ success: boolean; data: { applicationNo: string } }> => {
    const { data } = await api.get<{
      success: boolean;
      data: { applicationNo: string };
    }>(`${BASE_URL}/next-number`, {
      params: academicYearId ? { academicYearId } : undefined,
    });

    return data;
  },
};
