export interface ERPModule {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  icon?: string | null;
  route?: string | null;
  category: string;
  isActive: boolean;
}

export interface SchoolModule {
  id: string;
  enabled: boolean;
  assignedAt: string;
  assignedBy?: string | null;
  module: ERPModule;
}

export interface AssignFeaturePayload {
  moduleId: string;
  enabled: boolean;
}

export interface CreateFeaturePayload {
  name: string;
  key: string;
  description?: string;
  icon?: string;
  route?: string;
  category: string;
  isActive?: boolean;
}

export interface UpdateFeaturePayload {
  name?: string;
  key?: string;
  description?: string;
  icon?: string;
  route?: string;
  category?: string;
  isActive?: boolean;
}

export interface FeatureQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FeaturePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type FeatureListData = ERPModule[];

export interface SchoolFeatureResponse {
  success: boolean;
  message: string;
  data: SchoolModule[];
}

export interface FeatureResponse {
  success: boolean;
  message: string;
  data: ERPModule;
}

export interface FeatureListResponse {
  success: boolean;
  message: string;
  data: ERPModule[];
}