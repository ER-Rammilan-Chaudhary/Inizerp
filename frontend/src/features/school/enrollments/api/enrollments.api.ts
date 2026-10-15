import api from "@/api/client";
import type {
  CreateEnrollmentPayload,
  EnrollmentApiResponse,
  EnrollmentListParams,
  EnrollmentsApiResponse,
  PromoteApiResponse,
  PromoteStudentsPayload,
  UpdateEnrollmentPayload,
} from "../types/enrollments.types";

const buildParams = (params?: EnrollmentListParams) => {
  const searchParams = new URLSearchParams();

  if (!params) {
    return searchParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
};

export const getEnrollmentsApi = async (
  params?: EnrollmentListParams,
): Promise<EnrollmentsApiResponse> => {
  const query = buildParams(params).toString();
  const url = query ? `/school/enrollments?${query}` : "/school/enrollments";
  const response = await api.get<EnrollmentsApiResponse>(url);
  return response.data;
};

export const getEnrollmentByIdApi = async (
  id: string,
): Promise<EnrollmentApiResponse> => {
  const response = await api.get<EnrollmentApiResponse>(
    `/school/enrollments/${id}`,
  );
  return response.data;
};

export const createEnrollmentApi = async (
  payload: CreateEnrollmentPayload,
): Promise<EnrollmentApiResponse> => {
  const response = await api.post<EnrollmentApiResponse>(
    "/school/enrollments",
    payload,
  );
  return response.data;
};

export const updateEnrollmentApi = async (
  id: string,
  payload: UpdateEnrollmentPayload,
): Promise<EnrollmentApiResponse> => {
  const response = await api.patch<EnrollmentApiResponse>(
    `/school/enrollments/${id}`,
    payload,
  );
  return response.data;
};

export const deleteEnrollmentApi = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/school/enrollments/${id}`,
  );
  return response.data;
};

export const promoteStudentsApi = async (
  payload: PromoteStudentsPayload,
): Promise<PromoteApiResponse> => {
  const response = await api.post<PromoteApiResponse>(
    "/school/enrollments/promote",
    payload,
  );
  return response.data;
};
