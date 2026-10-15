import api from "@/api/client";
import {
  CreatePlanDto,
  PlanListResponse,
  SinglePlanResponse,
  SubscriptionPlan,
  UpdatePlanDto,
} from "../types/plan.types";

const ENDPOINT = "/super-admin/plans";

export async function getPlans(
  page = 1,
  limit = 12,
  search = "",
): Promise<PlanListResponse["data"]> {
  const { data } = await api.get<PlanListResponse>(ENDPOINT, {
    params: { page, limit, search },
  });

  return data.data;
}

export async function getPlanById(id: string): Promise<SubscriptionPlan> {
  const { data } = await api.get<SinglePlanResponse>(`${ENDPOINT}/${id}`);
  return data.data;
}

export async function createPlan(
  payload: CreatePlanDto,
): Promise<SubscriptionPlan> {
  const { data } = await api.post<SinglePlanResponse>(ENDPOINT, payload);
  return data.data;
}

export async function updatePlan(
  id: string,
  payload: UpdatePlanDto,
): Promise<SubscriptionPlan> {
  const { data } = await api.put<SinglePlanResponse>(`${ENDPOINT}/${id}`, payload);
  return data.data;
}

export async function togglePlanStatus(
  id: string,
  isActive: boolean,
): Promise<SubscriptionPlan> {
  const { data } = await api.patch<SinglePlanResponse>(
    `${ENDPOINT}/${id}/status`,
    { isActive },
  );
  return data.data;
}

export async function deletePlan(id: string): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
