import { Request, Response, NextFunction } from "express";
import {
  getOverviewService,
  getSubscriptionAnalyticsService,
  getRevenueService,
  getRecentSchoolsService,
  getRecentNotificationsService,
  getSchoolGrowthService,
  getStudentGrowthService,
  getTeacherGrowthService,
  getUserGrowthService,
  getSubscriptionGrowthService,
  getNotificationAnalyticsService,
  getSchoolAnalyticsService,
  getUserAnalyticsService,
  getMonthlyRevenueService,
} from "./analytics.service";

export const getOverview = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getOverviewService();

    return res.status(200).json({
      success: true,
      message: "Analytics overview fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getSubscriptionAnalyticsService();

    return res.status(200).json({
      success: true,
      message: "Subscription analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenue = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getRevenueService();

    return res.status(200).json({
      success: true,
      message: "Revenue analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentSchools = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getRecentSchoolsService();

    return res.status(200).json({
      success: true,
      message: "Recent schools fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentNotifications = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getRecentNotificationsService();

    return res.status(200).json({
      success: true,
      message: "Recent notifications fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year ?? new Date().getFullYear());

    const data = await getSchoolGrowthService(year);

    return res.status(200).json({
      success: true,
      message: "School growth analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year ?? new Date().getFullYear());

    const data = await getStudentGrowthService(year);

    return res.status(200).json({
      success: true,
      message: "Student growth analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year ?? new Date().getFullYear());

    const data = await getTeacherGrowthService(year);

    return res.status(200).json({
      success: true,
      message: "Teacher growth analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year ?? new Date().getFullYear());

    const data = await getUserGrowthService(year);

    return res.status(200).json({
      success: true,
      message: "User growth analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year ?? new Date().getFullYear());

    const data = await getSubscriptionGrowthService(year);

    return res.status(200).json({
      success: true,
      message: "Subscription growth analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getNotificationAnalyticsService();

    return res.status(200).json({
      success: true,
      message: "Notification analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getSchoolAnalyticsService();

    return res.status(200).json({
      success: true,
      message: "School analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getUserAnalyticsService();

    return res.status(200).json({
      success: true,
      message: "User analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const year = Number(req.query.year ?? new Date().getFullYear());

    const data = await getMonthlyRevenueService(year);

    return res.status(200).json({
      success: true,
      message: "Monthly revenue fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
