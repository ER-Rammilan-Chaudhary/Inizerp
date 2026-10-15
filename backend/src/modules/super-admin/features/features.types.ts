export type FeatureCategory = string;

export interface FeatureSearchQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  active?: boolean;
}

export interface CreateFeatureInput {
  name: string;
  key: string;
  description?: string;
  category?: string;
  icon?: string;
  route?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateFeatureInput {
  name?: string;
  key?: string;
  description?: string;
  category?: string;
  icon?: string;
  route?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface AssignFeatureInput {
  moduleId: string;
  enabled?: boolean;
}

export interface ToggleFeatureInput {
  enabled: boolean;
}

export interface BulkFeatureItem {
  moduleId: string;
  enabled: boolean;
}

export interface BulkUpdateFeatureInput {
  features: BulkFeatureItem[];
}

export interface FeatureStatistics {
  totalFeatures: number;
  activeFeatures: number;
  inactiveFeatures: number;
  totalAssignments: number;
  enabledAssignments: number;
  disabledAssignments: number;
}
