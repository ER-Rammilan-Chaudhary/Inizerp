import { Request, Response } from "express";
import { RoleEnum } from "@prisma/client";

import {
  getNotificationStats,
  getNotificationReadStats,
  getNotificationStatusStats,
  getNotificationTypeStats,
  getNotificationPriorityStats,
} from "../services/notification.stats.service";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: RoleEnum;
    schoolId?: string | null;
  };
};

const getUserId = (req: Request): string => {
  if (!req.user?.userId) {
    throw new Error("Authenticated user is required");
  }
  return req.user.userId;
};

export const getNotificationStatsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const query = res.locals.validatedQuery ?? req.query;

  const stats = await getNotificationStats(userId, query.schoolId);

  return res.status(200).json({
    success: true,
    message: "Notification statistics fetched successfully",
    data: stats,
  });
};

export const getNotificationReadStatsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const params = res.locals.validatedParams ?? req.params;

  const stats = await getNotificationReadStats(userId, params.id);

  return res.status(200).json({
    success: true,
    message: "Notification read statistics fetched successfully",
    data: stats,
  });
};

export const getNotificationStatusStatsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const query = res.locals.validatedQuery ?? req.query;

  const stats = await getNotificationStatusStats(userId, query.schoolId);

  return res.status(200).json({
    success: true,
    message: "Notification status statistics fetched successfully",
    data: stats,
  });
};

export const getNotificationTypeStatsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const query = res.locals.validatedQuery ?? req.query;

  const stats = await getNotificationTypeStats(userId, query.schoolId);

  return res.status(200).json({
    success: true,
    message: "Notification type statistics fetched successfully",
    data: stats,
  });
};

export const getNotificationPriorityStatsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = getUserId(req);

  const query = res.locals.validatedQuery ?? req.query;

  const stats = await getNotificationPriorityStats(userId, query.schoolId);

  return res.status(200).json({
    success: true,
    message: "Notification priority statistics fetched successfully",
    data: stats,
  });
};
