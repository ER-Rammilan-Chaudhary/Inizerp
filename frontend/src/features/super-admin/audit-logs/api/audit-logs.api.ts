// features/audit-logs/api/audit-logs.api.ts
import api from "@/api/client";
import type {
  AuditLogFilters,
  AuditLogsResponse,
  AuditLogResponse,
  AuditStatsResponse,
  RecentAuditLogsResponse,
} from "../types/audit-logs.types";

const BASE_URL = "/super-admin/audit-logs";

export const getAuditLogs = async (
  filters?: AuditLogFilters,
): Promise<AuditLogsResponse> => {
  const { data } = await api.get(BASE_URL, {
    params: filters,
  });
  return data;
};

export const getAuditLogById = async (
  id: string,
): Promise<AuditLogResponse> => {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
};

export const getRecentAuditLogs =
  async (): Promise<RecentAuditLogsResponse> => {
    const { data } = await api.get(`${BASE_URL}/recent`);
    return data;
  };

export const getAuditStats = async (): Promise<AuditStatsResponse> => {
  const { data } = await api.get(`${BASE_URL}/stats`);
  return data;
};

export const exportAuditLogsCSV = async (
  filters?: Omit<AuditLogFilters, "page" | "limit">,
): Promise<Blob> => {
  const response = await api.get(`${BASE_URL}/export/csv`, {
    params: filters,
    responseType: "blob",
  });
  return response.data;
};
