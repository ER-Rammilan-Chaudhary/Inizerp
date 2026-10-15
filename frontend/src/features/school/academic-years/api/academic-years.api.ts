import api from "@/api/client";
import type {
  AcademicYearResponse,
  AcademicYearsResponse,
  CreateAcademicYearPayload,
  UpdateAcademicYearPayload,
} from "../types/academic-years.types";

export const getAcademicYears = async (): Promise<AcademicYearsResponse> => {
  const { data } = await api.get<AcademicYearsResponse>(
    "/school/academic-years",
  );

  return data;
};

export const getCurrentAcademicYear =
  async (): Promise<AcademicYearResponse> => {
    const { data } = await api.get<AcademicYearResponse>(
      "/school/academic-years/current",
    );

    return data;
  };

export const getAcademicYearById = async (
  id: string,
): Promise<AcademicYearResponse> => {
  const { data } = await api.get<AcademicYearResponse>(
    `/school/academic-years/${id}`,
  );

  return data;
};

export const createAcademicYear = async (
  payload: CreateAcademicYearPayload,
): Promise<AcademicYearResponse> => {
  const { data } = await api.post<AcademicYearResponse>(
    "/school/academic-years",
    payload,
  );

  return data;
};

export const updateAcademicYear = async (
  id: string,
  payload: UpdateAcademicYearPayload,
): Promise<AcademicYearResponse> => {
  const { data } = await api.patch<AcademicYearResponse>(
    `/school/academic-years/${id}`,
    payload,
  );

  return data;
};

export const setCurrentAcademicYear = async (
  id: string,
): Promise<AcademicYearResponse> => {
  const { data } = await api.patch<AcademicYearResponse>(
    `/school/academic-years/${id}/set-current`,
  );

  return data;
};

export const deleteAcademicYear = async (
  id: string,
): Promise<AcademicYearResponse> => {
  const { data } = await api.delete<AcademicYearResponse>(
    `/school/academic-years/${id}`,
  );

  return data;
};
