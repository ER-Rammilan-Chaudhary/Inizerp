import api from "@/api/client";

const ENDPOINT = "/super-admin/subscriptions";

// List
export async function getSubscriptions(
  page: number,
  limit: number,
  search?: string,
) {
  const { data } = await api.get(ENDPOINT, {
    params: { page, limit, search, },
  });

  return data;
}

// Stats
export async function getSubscriptionStats() {
  const { data } = await api.get(`${ENDPOINT}/stats`);

  return data.data;
}

// School Subscriptions
export async function getSchoolSubscriptions(schoolId: string) {
  const { data } = await api.get(`${ENDPOINT}/school/${schoolId}`);

  return data.data;
}

// Delete
export async function deleteSubscription(id: string) {
  const { data } = await api.delete(`${ENDPOINT}/${id}`);

  return data.data;
}

// ======================================
// GET SINGLE
// ======================================

export async function getSubscription(id: string) {
  const { data } = await api.get(`${ENDPOINT}/${id}`);

  return data.data;
}

// ======================================
// CREATE
// ======================================

export async function createSubscription(payload: unknown) {
  const { data } = await api.post(ENDPOINT, payload);

  return data;
}

// ======================================
// UPDATE
// ======================================

export async function updateSubscription(id: string, payload: unknown) {
  const { data } = await api.patch(`${ENDPOINT}/${id}`, payload);

  return data;
}

// ======================================
// UPDATE STATUS
// ======================================

export async function updateSubscriptionStatus(id: string, status: string) {
  const { data } = await api.patch(`${ENDPOINT}/${id}/status`, {
    status,
  });

  return data;
}

// ======================================
// RENEW
// ======================================

export async function renewSubscription(id: string, endDate: string) {
  const { data } = await api.patch(`${ENDPOINT}/${id}/renew`, {
    endDate,
  });

  return data;
}
