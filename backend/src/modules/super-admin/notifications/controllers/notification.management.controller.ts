import { Request, Response } from "express";

import {
  createNotification,
  updateNotification,
  deleteNotification,
  bulkDeleteNotifications,
} from "../services/notification.management.service";

import {
  getManagedNotifications,
  getManagedNotificationById,
  getNotificationsBySchool,
} from "../services/notification.query.service";

const getUserId = (req: Request): string => {
  if (!req.user?.userId) {
    throw new Error("Authenticated user is required");
  }
  return req.user.userId;
};

export const createNotificationController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);

  const notification = await createNotification(userId, req.body);

  return res.status(201).json({
    success: true,
    message: "Notification created successfully",
    data: notification,
  });
};

export const getNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);

  const filters = res.locals.validatedQuery ?? req.query;

  const result = await getManagedNotifications(userId, filters);

  return res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    data: result.notifications,
    pagination: result.pagination,
  });
};

export const getSchoolNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const filters = res.locals.validatedQuery ?? req.query;

  const result = await getNotificationsBySchool(
    userId,
    params.schoolId,
    filters,
  );

  return res.status(200).json({
    success: true,
    message: "School notifications fetched successfully",
    data: result.notifications,
    pagination: result.pagination,
  });
};

export const getNotificationController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const notification = await getManagedNotificationById(userId, params.id);

  return res.status(200).json({
    success: true,
    message: "Notification fetched successfully",
    data: notification,
  });
};

export const updateNotificationController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const notification = await updateNotification(userId, params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Notification updated successfully",
    data: notification,
  });
};

export const deleteNotificationController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const result = await deleteNotification(userId, params.id);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      id: result.id,
    },
  });
};

export const bulkDeleteNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);

  const result = await bulkDeleteNotifications(
    userId,
    req.body.notificationIds,
  );

  return res.status(200).json({
    success: true,
    message: "Notifications deleted successfully",
    data: result,
  });
};
