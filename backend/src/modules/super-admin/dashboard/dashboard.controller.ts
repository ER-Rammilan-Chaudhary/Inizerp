import { Request, Response, NextFunction } from "express";
import * as service from "./dashboard.service";

export const dashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getDashboardStats(req.user);

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const dashboardCharts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getDashboardCharts(req.user);

    return res.status(200).json({
      success: true,
      message: "Dashboard charts fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const recentSchools = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getRecentSchools(req.user);

    return res.status(200).json({
      success: true,
      message: "Recent schools fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const recentNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getRecentNotifications(req.user);

    return res.status(200).json({
      success: true,
      message: "Recent notifications fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const revenueStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getRevenueStats();

    return res.status(200).json({
      success: true,
      message: "Revenue statistics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const topSchools = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getTopSchools(req.user);

    return res.status(200).json({
      success: true,
      message: "Top schools fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const recentActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getRecentActivities(req.user);

    return res.status(200).json({
      success: true,
      message: "Recent activities fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const subscriptionOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getSubscriptionOverview(req.user);

    return res.status(200).json({
      success: true,
      message: "Subscription overview fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const platformGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getPlatformGrowth(req.user);

    return res.status(200).json({
      success: true,
      message: "Platform growth fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const expiringSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getExpiringSubscriptions(req.user);

    return res.status(200).json({
      success: true,
      message: "Expiring subscriptions fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const systemHealth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.getSystemHealth(req.user);

    return res.status(200).json({
      success: true,
      message: "System health fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
