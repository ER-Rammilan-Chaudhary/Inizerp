import client from "@/api/client";

import type {
  NotificationFilters,
  CreateNotificationDto,
  UpdateNotificationDto,
  BulkReadDto,
  BulkDeleteDto,
  NotificationListResponse,
  NotificationResponse,
  NotificationReadResponse,
  NotificationStatsResponse,
  Notification,
} from "../types/notification.types";

const BASE_URL = "/super-admin/notifications";

const getScopeFromAudiences = (
  audiences: NonNullable<Notification["audiences"]>,
) => {
  const audience = audiences[0];

  if (!audience) return "GLOBAL";
  if (audience.targetType === "GLOBAL") return "GLOBAL";
  if (audience.targetType === "SCHOOL") return "SCHOOL";
  if (audience.targetType === "USER") return "USER";
  if (audience.targetType === "ROLE") {
    if (audience.role === "SCHOOL_ADMIN") return "ADMIN";
    if (audience.role === "TEACHER") return "ALL_TEACHERS";
    if (audience.role === "STUDENT") return "ALL_STUDENTS";
    if (audience.role === "PARENT") return "ALL_PARENTS";
  }

  return "GLOBAL";
};

const mapNotification = (notification: Notification): Notification => ({
  ...notification,
  scope: getScopeFromAudiences(notification.audiences ?? []),
  userId:
    notification.audiences?.find((item) => item.targetType === "USER")
      ?.userId ?? null,
  classId:
    notification.audiences?.find((item) => item.targetType === "CLASS")
      ?.classId ?? null,
  sectionId:
    notification.audiences?.find((item) => item.targetType === "SECTION")
      ?.sectionId ?? null,
  studentId:
    notification.audiences?.find((item) => item.targetType === "STUDENT")
      ?.studentId ?? null,
});

const mapListResponse = (
  response: NotificationListResponse,
): NotificationListResponse => ({
  ...response,
  data: response.data.map(mapNotification),
});

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

export const getNotifications = async (
  filters?: NotificationFilters,
): Promise<NotificationListResponse> => {
  const params = { ...filters };
  delete params.scope;
  const { data } = await client.get<NotificationListResponse>(BASE_URL, {
    params,
  });
  return mapListResponse(data);
};

export const getGlobalNotifications = async (
  filters?: Omit<NotificationFilters, "scope">,
): Promise<NotificationListResponse> => {
  const { data } = await client.get<NotificationListResponse>(BASE_URL, {
    params: filters,
  });
  return mapListResponse(data);
};

export const getSchoolNotifications = async (
  schoolId: string,
  filters?: NotificationFilters,
): Promise<NotificationListResponse> => {
  const params = { ...filters };
  delete params.scope;
  const { data } = await client.get<NotificationListResponse>(
    `${BASE_URL}/school/${schoolId}`,
    {
      params,
    },
  );
  return mapListResponse(data);
};

export const getMyNotifications = async (
  filters?: NotificationFilters,
): Promise<NotificationListResponse> => {
  const params = { ...filters };
  delete params.scope;
  delete params.schoolId;
  const { data } = await client.get(`${BASE_URL}/my`, { params });
  return mapListResponse(data);
};

export const getNotificationById = async (
  id: string,
): Promise<NotificationResponse> => {
  const { data } = await client.get(`${BASE_URL}/${id}`);

  return { ...data, data: mapNotification(data.data) };
};

export const createNotification = async (
  payload: CreateNotificationDto,
): Promise<NotificationResponse> => {
  const { data } = await client.post(BASE_URL, payload);

  return { ...data, data: mapNotification(data.data) };
};

export const updateNotification = async (
  id: string,
  payload: UpdateNotificationDto,
): Promise<NotificationResponse> => {
  const { data } = await client.patch(`${BASE_URL}/${id}`, payload);

  return { ...data, data: mapNotification(data.data) };
};

export const deleteNotification = async (id: string): Promise<ApiResponse> => {
  const { data } = await client.delete(`${BASE_URL}/${id}`);

  return data;
};

export const markNotificationAsRead = async (
  id: string,
): Promise<NotificationReadResponse> => {
  const { data } = await client.patch(`${BASE_URL}/${id}/read`);

  return data;
};

export const markAllNotificationsAsRead = async (): Promise<ApiResponse> => {
  const { data } = await client.patch(`${BASE_URL}/read-all`);
  return data;
};

export const bulkReadNotifications = async (
  payload: BulkReadDto,
): Promise<ApiResponse> => {
  const { data } = await client.patch(`${BASE_URL}/bulk/read`, payload);

  return data;
};

export const bulkDeleteNotifications = async (
  payload: BulkDeleteDto,
): Promise<ApiResponse> => {
  const { data } = await client.delete(`${BASE_URL}/bulk/delete`, {
    data: payload,
  });

  return data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const { data } = await client.get(`${BASE_URL}/my/unread-count`);

  return data;
};

export const getNotificationStats =
  async (): Promise<NotificationStatsResponse> => {
    const { data } = await client.get(`${BASE_URL}/stats/overview`);

    return data;
  };
