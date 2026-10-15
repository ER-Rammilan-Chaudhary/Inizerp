import api from "@/api/client";
import type {
  ClassListParams,
  ClassListResponse,
  ClassResponse,
  CreateClassPayload,
  CreateSectionPayload,
  DeleteResponse,
  SectionResponse,
  SectionResponseSingle,
  UpdateClassPayload,
  UpdateSectionPayload,
} from "../types/classes.types";

const BASE_URL = "/school/classes";

export async function getClasses(
  params?: ClassListParams,
): Promise<ClassListResponse> {
  const { data } = await api.get<ClassListResponse>(BASE_URL, {params,
  });

  return data;
}

export async function getClassById(id: string): Promise<ClassResponse> {
  const { data } = await api.get<ClassResponse>(`${BASE_URL}/${id}`);

  return data;
}

export async function createClass(
  payload: CreateClassPayload,
): Promise<ClassResponse> {
  const { data } = await api.post<ClassResponse>(BASE_URL, payload);

  return data;
}

export async function updateClass(
  id: string,
  payload: UpdateClassPayload,
): Promise<ClassResponse> {
  const { data } = await api.patch<ClassResponse>(`${BASE_URL}/${id}`, payload);

  return data;
}

export async function deleteClass(id: string): Promise<DeleteResponse> {
  const { data } = await api.delete<DeleteResponse>(`${BASE_URL}/${id}`);

  return data;
}

export async function getSections(classId: string): Promise<SectionResponse> {
  const { data } = await api.get<SectionResponse>(
    `${BASE_URL}/${classId}/sections`,
  );

  return data;
}

export async function createSection(
  classId: string,
  payload: CreateSectionPayload,
): Promise<SectionResponseSingle> {
  const { data } = await api.post<SectionResponseSingle>(
    `${BASE_URL}/${classId}/sections`,
    payload,
  );

  return data;
}

export async function updateSection(
  classId: string,
  sectionId: string,
  payload: UpdateSectionPayload,
): Promise<SectionResponseSingle> {
  const { data } = await api.patch<SectionResponseSingle>(
    `${BASE_URL}/${classId}/sections/${sectionId}`,
    payload,
  );

  return data;
}

export async function deleteSection(
  classId: string,
  sectionId: string,
): Promise<DeleteResponse> {
  const { data } = await api.delete<DeleteResponse>(
    `${BASE_URL}/${classId}/sections/${sectionId}`,
  );

  return data;
}
