import api from "@/api/client";

export interface SchoolAdmin {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  schoolId: string;

  status?: "ACTIVE" | "INACTIVE";

  createdAt: string;

  updatedAt?: string;

  lastLogin?: string | null;
}

export interface UpdateSchoolAdminPayload {
  fullName: string;
  email: string;
  phone?: string;
}

export interface ResetPasswordPayload {
  password: string;
}

// GET CURRENT SCHOOL ADMIN
export async function getSchoolAdmin(schoolId: string): Promise<SchoolAdmin> {
  const { data } = await api.get(`/super-admin/schools/${schoolId}/admin`);

  return data.data;
}

// UPDATE SCHOOL ADMIN DETAILS
export async function updateSchoolAdmin(
  schoolId: string,
  payload: UpdateSchoolAdminPayload,
): Promise<SchoolAdmin> {
  const { data } = await api.patch(
    `/super-admin/schools/${schoolId}/admin`,
    payload,
  );

  return data.data;
}

// RESET SCHOOL ADMIN PASSWORD
export async function resetSchoolAdminPassword(
  schoolId: string,
  payload: ResetPasswordPayload,
): Promise<SchoolAdmin> {
  const { data } = await api.patch(
    `/admin/schools/${schoolId}/super-admin/reset-password`,
    payload,
  );

  return data.data;
}
