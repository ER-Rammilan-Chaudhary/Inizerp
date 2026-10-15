import api from "@/api/client";
import type {
  CreateParentPayload,
  ParentResponse,
  ParentsResponse,
  UpdateParentPayload,
} from "../types/parents.types";

const BASE_URL = "/school/parents";

export async function getParents(): Promise<ParentsResponse> {
  const { data } = await api.get<ParentsResponse>(BASE_URL);
  return data;
}

export async function getParentById(id: string): Promise<ParentResponse> {
  const { data } = await api.get<ParentResponse>(`${BASE_URL}/${id}`);
  return data;
}

export async function createParent(
  payload: CreateParentPayload,
): Promise<ParentResponse> {
  const { data } = await api.post<ParentResponse>(BASE_URL, payload);
  return data;
}

export async function updateParent(
  id: string,
  payload: UpdateParentPayload,
): Promise<ParentResponse> {
  const { data } = await api.patch<ParentResponse>(`${BASE_URL}/${id}`, payload);
  return data;
}

export async function deleteParent(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete<{ success: boolean; message: string }>(
    `${BASE_URL}/${id}`,
  );
  return data;
}
