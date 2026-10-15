import api from "@/api/client";

import type { TeacherListResponse } from "../types/teachers.types";

const BASE_URL = "/school/teachers";

export async function getTeachers(): Promise<TeacherListResponse> {
  const { data } = await api.get<TeacherListResponse>(BASE_URL);

  return data;
}
