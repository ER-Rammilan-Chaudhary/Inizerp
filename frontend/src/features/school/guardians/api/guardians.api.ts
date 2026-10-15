import api from "@/api/client";
import type {
  CreateGuardianPayload,
  GuardianResponse,
  GuardiansResponse,
} from "../types/guardians.types";

const BASE_URL = "/school/guardians";

export async function getGuardians(): Promise<GuardiansResponse> {
  const { data } = await api.get<GuardiansResponse>(BASE_URL);
  return data;
}

export async function createGuardian(
  payload: CreateGuardianPayload,
): Promise<GuardianResponse> {
  const { data } = await api.post<GuardianResponse>(BASE_URL, payload);
  return data;
}
