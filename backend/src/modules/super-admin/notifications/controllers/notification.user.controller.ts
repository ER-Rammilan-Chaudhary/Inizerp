import { Request, Response } from "express";

import {
  getMyNotifications,
  getMyNotificationById,
  getMyUnreadNotifications,
  getMyNotificationSummary,
} from "../services/notification.user.service";

import {
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  bulkMarkNotificationsAsRead,
  getUnreadNotificationCount,
  isNotificationRead,
} from "../services/notification.read.service";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

const getUserId = (req: Request): string => {
  if (!req.user?.userId) {
    throw new Error("Authenticated user is required");
  }
  return req.user.userId;
};

export const getMyNotificationsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const query = res.locals.validatedQuery ?? req.query;

  const result = await getMyNotifications(userId, query);

  return res.status(200).json({
    success: true,
    message: "My notifications fetched successfully",
    data: result.notifications,
    pagination: result.pagination,
  });
};

export const getMyNotificationController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const notification = await getMyNotificationById(userId, params.id);

  return res.status(200).json({
    success: true,
    message: "Notification fetched successfully",
    data: notification,
  });
};

export const getMyUnreadNotificationsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const query = res.locals.validatedQuery ?? req.query;

  const limit = query.limit ?? 10;

  const notifications = await getMyUnreadNotifications(userId, limit);

  return res.status(200).json({
    success: true,
    message: "Unread notifications fetched successfully",
    data: notifications,
  });
};

export const getMyNotificationSummaryController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const summary = await getMyNotificationSummary(userId);

  return res.status(200).json({
    success: true,
    message: "Notification summary fetched successfully",
    data: summary,
  });
};

export const getUnreadNotificationCountController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const result = await getUnreadNotificationCount(userId);

  return res.status(200).json({
    success: true,
    message: "Unread notification count fetched successfully",
    data: result,
  });
};

export const markNotificationAsReadController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const result = await markNotificationAsRead(userId, params.id);

  return res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: result,
  });
};

export const markNotificationAsUnreadController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const result = await markNotificationAsUnread(userId, params.id);

  return res.status(200).json({
    success: true,
    message: "Notification marked as unread",
    data: result,
  });
};

export const markAllNotificationsAsReadController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const result = await markAllNotificationsAsRead(userId);

  return res.status(200).json({
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
};

export const bulkMarkNotificationsAsReadController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const result = await bulkMarkNotificationsAsRead(
    userId,
    req.body.notificationIds,
  );

  return res.status(200).json({
    success: true,
    message: "Notifications marked as read",
    data: result,
  });
};

export const getNotificationReadStatusController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const result = await isNotificationRead(userId, params.id);

  return res.status(200).json({
    success: true,
    message: "Notification read status fetched successfully",
    data: result,
  });
};
