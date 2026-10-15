import api from "@/api/client";

import {
  CreateSchoolDto,
  CreateSchoolResponse,
  School,
  SchoolDetailsResponse,
  SchoolListResponse,
  SchoolStatus,
  ResetPasswordResponse,
} from "@/features/super-admin/schools/types/school";

const ENDPOINT = "/super-admin/schools";

// ==============================
// GET ALL SCHOOLS
// ==============================

interface SchoolModulesResponse {
  success: boolean;
  message: string;
  data: string[];
}

export const getSchoolEnabledModuleKeys = async (): Promise<string[]> => {
  const { data } = await api.get<SchoolModulesResponse>(
    "/school/dashboard/modules",
  );

  return data.data;
};


export async function getSchools(
  page = 1,
  limit = 10,
  search = "",
): Promise<SchoolListResponse> {
  const { data } = await api.get(ENDPOINT, {
    params: {
      page,
      limit,
      search,
    },
  });

  return data.data;
}

// ==============================
// GET SCHOOL BY ID
// ==============================

export async function getSchoolById(
  schoolId: string,
): Promise<SchoolDetailsResponse> {
  const { data } = await api.get(`${ENDPOINT}/${schoolId}`);

  return data.data;
}

// ==============================
// CREATE SCHOOL + SCHOOL ADMIN
// ==============================

export async function createSchool(
  payload: CreateSchoolDto,
): Promise<CreateSchoolResponse> {
  const { data } = await api.post(ENDPOINT, payload);
  return data;
}

// ==============================
// UPDATE SCHOOL
// ==============================
export async function updateSchool(
  schoolId: string,
  payload: FormData,
): Promise<School> {
  const { data } = await api.put(`${ENDPOINT}/${schoolId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}

// ==============================
// UPDATE SCHOOL STATUS
// ==============================

export async function updateSchoolStatus(
  schoolId: string,
  status: SchoolStatus,
): Promise<School> {
  const { data } = await api.patch(`${ENDPOINT}/${schoolId}/status`, {
    status,
  });

  return data.data;
}

// ==============================
// DELETE SCHOOL
// ==============================

export async function deleteSchool(schoolId: string): Promise<void> {
  await api.delete(`${ENDPOINT}/${schoolId}`);
}

// ==============================
// RESET SCHOOL ADMIN PASSWORD
// ==============================
export async function resetSchoolAdminPassword(
  schoolId: string,
): Promise<ResetPasswordResponse> {
  const { data } = await api.patch(`${ENDPOINT}/${schoolId}/reset-password`);

  return data;
}
