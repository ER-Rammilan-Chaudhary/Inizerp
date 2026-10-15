// features/audit-logs/types/audit-logs.types.ts
export interface AuditLog {
  id: string;
  userId?: string | null;
  schoolId?: string | null;
  action: string;
  module: string;
  entity: string;
  entityId?: string | null;
  meta?: unknown;
  browser?: string | null;
  device?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: {
    id?: string;
    fullName: string;
    email?: string;
  } | null;
  school?: {
    id?: string;
    name: string;
  } | null;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  module?: string;
  schoolId?: string;
  userId?: string;
  from?: string;
  to?: string;
}

export interface AuditLogsResponse {
  success: boolean;
  message: string;
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuditLogResponse {
  success: boolean;
  message: string;
  data: AuditLog;
}

export interface RecentAuditLogsResponse {
  success: boolean;
  message: string;
  count: number;
  data: AuditLog[];
}

export interface AuditStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

export interface AuditStatsResponse {
  success: boolean;
  message: string;
  data: AuditStats;
}
