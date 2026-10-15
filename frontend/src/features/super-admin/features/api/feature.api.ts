import api from "@/api/client";
import type { AssignFeaturePayload, CreateFeaturePayload, ERPModule, FeatureListResponse, FeatureQuery, FeatureResponse, SchoolFeatureResponse, SchoolModule, UpdateFeaturePayload, }from "../types/feature.types";


const BASE_URL = "/super-admin/features";

export const getFeatures = async (params: FeatureQuery = {},): Promise<FeatureListResponse["data"]> => {
  const { data } = await api.get<FeatureListResponse>(BASE_URL, {params: {page: params.page ?? 1,limit: params.limit ?? 10,search: params.search ?? "",},});
  return data.data;
};        

export const createFeature = async (payload: CreateFeaturePayload,): Promise<ERPModule> => {
  const { data } = await api.post<FeatureResponse>(BASE_URL, payload,); return data.data;
};


export const updateFeature = async (
  moduleId: string,
  payload: UpdateFeaturePayload,
): Promise<ERPModule> => {
  const { data } = await api.patch<FeatureResponse>(
    `${BASE_URL}/${moduleId}`,
    payload,
  );

  return data.data;
};

export const deleteFeature = async (moduleId: string,): Promise<void> => {
  await api.delete(`${BASE_URL}/${moduleId}`);
};


export const getSchoolFeatures = async (
  schoolId: string,
): Promise<SchoolModule[]> => {
  if (!schoolId) {
    throw new Error("School ID is required");
  }
  const { data } = await api.get<SchoolFeatureResponse>(
    `${BASE_URL}/schools/${schoolId}`,
  );  
  return data.data;
};

export const assignFeature = async (
  schoolId: string,
  payload: AssignFeaturePayload,
): Promise<SchoolModule> => {
  if (!schoolId) {
    throw new Error("School ID is required");
  }

  const { data } = await api.post<SchoolFeatureResponse>(
    `${BASE_URL}/schools/${schoolId}/assign`,
    payload,
  );

  return data.data[0];
};

export const toggleFeature = async (
  schoolId: string,
  moduleId: string,
  enabled: boolean,
): Promise<SchoolModule> => {
  const { data } = await api.patch<SchoolFeatureResponse>(
    `${BASE_URL}/schools/${schoolId}/${moduleId}`,
    { enabled },
  );

  return data.data[0];
};

export const removeFeature = async (
  schoolId: string,
  moduleId: string,
): Promise<void> => {
  await api.delete(
    `${BASE_URL}/schools/${schoolId}/${moduleId}`,
  );
};




// bulk update Features
export const bulkUpdateFeatures = async (
  schoolId: string,
  features: AssignFeaturePayload[],
): Promise<SchoolModule[]> => {
  const { data } = await api.patch<SchoolFeatureResponse>(
    `${BASE_URL}/schools/${schoolId}`,
    { features },
  );

  return data.data;
};