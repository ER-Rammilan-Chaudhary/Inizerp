import { Request, Response } from "express";

import { ApiError } from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";

import {
  cancelNotification,
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  sendNotification,
  updateNotification,
} from "./notifications.service";

const getSchoolId = (req: Request): string => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    throw new ApiError(403, "School context is required");
  }

  return schoolId;
};

const getUserId = (req: Request): string => {
  const userId = req.user?.userId || req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  return userId;
};

const getParam = (value: string | string[] | undefined): string => {
  if (typeof value !== "string") {
    throw new ApiError(400, "Invalid route parameter");
  }

  return value;
};

export const getNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);

    const notifications = await getNotifications(schoolId);

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  },
);

export const getNotificationByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const notificationId = getParam(req.params.id);

    const notification = await getNotificationById(schoolId, notificationId);

    res.status(200).json({
      success: true,
      message: "Notification fetched successfully",
      data: notification,
    });
  },
);

export const createNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    const notification = await createNotification(schoolId, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  },
);

export const updateNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const notificationId = getParam(req.params.id);

    const notification = await updateNotification(
      schoolId,
      notificationId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  },
);

export const sendNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const notificationId = getParam(req.params.id);

    const notification = await sendNotification(schoolId, notificationId);

    res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  },
);

export const cancelNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const notificationId = getParam(req.params.id);

    const notification = await cancelNotification(schoolId, notificationId);

    res.status(200).json({
      success: true,
      message: "Notification cancelled successfully",
      data: notification,
    });
  },
);

export const deleteNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const notificationId = getParam(req.params.id);

    const notification = await deleteNotification(schoolId, notificationId);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  },
);
