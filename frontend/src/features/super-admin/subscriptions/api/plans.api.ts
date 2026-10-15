import api from "@/api/client";

const ENDPOINT = "/super-admin/plans";

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
}

export async function getPlans(): Promise<Plan[]> {
  const { data } = await api.get(ENDPOINT);

  return data.data.plans ?? [];
}
