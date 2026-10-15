export type SubscriptionStatus = "ACTIVE" | "TRIAL" | "EXPIRED" | "CANCELLED";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration?: number;
}

export interface SubscriptionSchool {
  id: string;
  name: string;
}

export interface Subscription {
  id: string;

  schoolId: string;
  planId: string;

  startDate: string;
  endDate: string;

  status: SubscriptionStatus;

  amount: number;
  discount: number;
  tax: number;
  finalAmount: number;

  createdAt: string;
  updatedAt: string;

  school: SubscriptionSchool;
  plan: SubscriptionPlan;
}

export interface SubscriptionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubscriptionListResponse {
  success: boolean;
  message: string;
  data: Subscription[];
  pagination: SubscriptionPagination;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  trial: number;
  expired: number;
  cancelled: number;
}
