import { Request, Response, NextFunction } from "express";
import { SubscriptionStatus } from "@prisma/client";
import {
  createSubscriptionService,
  getSubscriptionsService,
  getSubscriptionByIdService,
  updateSubscriptionService,
  updateSubscriptionStatusService,
  deleteSubscriptionService,
  renewSubscriptionService,
  getActiveSubscriptionsService,
  getExpiredSubscriptionsService,
  getSubscriptionStatsService,
  getSchoolSubscriptionsService,
} from "./subscriptions.service";

export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await createSubscriptionService(req.body);

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchoolSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscriptions = await getSchoolSubscriptionsService(
      String(req.params.schoolId),
    );

    return res.status(200).json({
      success: true,
      message: "School subscriptions fetched successfully",
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getSubscriptionsService({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search ? String(req.query.search) : undefined,
      status: req.query.status
        ? (String(req.query.status) as SubscriptionStatus)
        : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Subscriptions fetched successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await getSubscriptionByIdService(
      String(req.params.id),
    );

    return res.status(200).json({
      success: true,
      message: "Subscription fetched successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await updateSubscriptionService(
      String(req.params.id),
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.body;

    if (
      !Object.values(SubscriptionStatus).includes(status as SubscriptionStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription status",
      });
    }

    const subscription = await updateSubscriptionStatusService(
      String(req.params.id),
      status as SubscriptionStatus,
    );

    return res.status(200).json({
      success: true,
      message: "Subscription status updated successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteSubscriptionService(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const renewSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { endDate } = req.body;

    if (!endDate) {
      return res.status(400).json({
        success: false,
        message: "endDate is required",
      });
    }

    const subscription = await renewSubscriptionService(
      String(req.params.id),
      String(endDate),
    );

    return res.status(200).json({
      success: true,
      message: "Subscription renewed successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveSubscriptions = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getActiveSubscriptionsService();

    return res.status(200).json({
      success: true,
      message: "Active subscriptions fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpiredSubscriptions = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getExpiredSubscriptionsService();

    return res.status(200).json({
      success: true,
      message: "Expired subscriptions fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getSubscriptionStatsService();

    return res.status(200).json({
      success: true,
      message: "Subscription statistics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
