export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  price: number | string;
  currency: string;
  durationInDays: number;
  maxStudents: number;
  maxTeachers: number;
  maxAdmins: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PlanListResponse {
  success: boolean;
  message: string;
  data: {
    plans: SubscriptionPlan[];
    pagination: PlanPagination;
  };
}

export interface SinglePlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan;
}

export interface CreatePlanDto {
  name: string;
  code: string;
  description?: string;
  price: number;
  currency?: string;
  durationInDays: number;
  maxStudents: number;
  maxTeachers: number;
  maxAdmins: number;
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> {}
