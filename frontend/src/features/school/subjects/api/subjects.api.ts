import api from "@/api/client";
import type {
  CreateSubjectPayload,
  DeleteSubjectResponse,
  SubjectResponse,
  SubjectsResponse,
  UpdateSubjectPayload,
} from "../types/subjects.types";

export interface GetSubjectsParams {
  search?: string;
  page?: number;
  limit?: number;
  teacherId?: string;
  hasTeachers?: boolean;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const subjectsApi = {
  getSubjects: async (
    params?: GetSubjectsParams,
  ): Promise<SubjectsResponse> => {
    const { data } = await api.get<SubjectsResponse>("/school/subjects", {
      params,
    });

    return data;
  },

  getSubjectById: async (id: string): Promise<SubjectResponse> => {
    const { data } = await api.get<SubjectResponse>(`/school/subjects/${id}`);

    return data;
  },

  createSubject: async (
    payload: CreateSubjectPayload,
  ): Promise<SubjectResponse> => {
    const { data } = await api.post<SubjectResponse>(
      "/school/subjects",
      payload,
    );

    return data;
  },

  updateSubject: async (
    id: string,
    payload: UpdateSubjectPayload,
  ): Promise<SubjectResponse> => {
    const { data } = await api.patch<SubjectResponse>(
      `/school/subjects/${id}`,
      payload,
    );

    return data;
  },

  deleteSubject: async (id: string): Promise<DeleteSubjectResponse> => {
    const { data } = await api.delete<DeleteSubjectResponse>(
      `/school/subjects/${id}`,
    );

    return data;
  },
};
