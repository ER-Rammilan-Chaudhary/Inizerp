import { Request, Response, NextFunction } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshUserToken,
} from "./auth.service";
import { env } from "../../config/env";
import { getMaintenanceStatus } from "../../middleware/maintenance.middleware";
import { verifyRefreshToken } from "../../utils/jwt";

const cookieOptions = () => ({
  domain: env.COOKIE_DOMAIN,
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite:
    env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const sessionHintOptions = () => ({
  domain: env.COOKIE_DOMAIN,
  httpOnly: false,
  secure: env.NODE_ENV === "production",
  sameSite:
    env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginUser(req.body, {
      ipAddress: req.ip,
      userAgent:
        typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : undefined,
    });

    // Check maintenance mode: only SUPER_ADMIN is permitted when active
    const maintenance = await getMaintenanceStatus();
    if (maintenance.enabled && result.user.role !== "SUPER_ADMIN") {
      return res.status(503).json({
        success: false,
        code: "MAINTENANCE_MODE",
        error: "System Under Maintenance",
        message:
          maintenance.message ||
          "InizERP is currently under maintenance. Only Super Administrators may access the system.",
      });
    }

    res.cookie("refresh_token", result.refreshToken, cookieOptions());

    res.cookie("session_hint", "1", sessionHintOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refresh_token as string | undefined;

    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        const maintenance = await getMaintenanceStatus();
        if (maintenance.enabled && payload.role !== "SUPER_ADMIN") {
          return res.status(503).json({
            success: false,
            code: "MAINTENANCE_MODE",
            error: "System Under Maintenance",
            message:
              maintenance.message ||
              "InizERP is currently under maintenance. Only Super Administrators may access the system.",
          });
        }
      } catch {
        // let refreshUserToken handle invalid or expired tokens
      }
    }

    const result = await refreshUserToken(refreshToken || "");

    res.cookie("refresh_token", result.refreshToken, cookieOptions());

    res.cookie("session_hint", "1", sessionHintOptions());

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await logoutUser(req.cookies?.refresh_token);

    res.clearCookie("refresh_token", {
      ...cookieOptions(),
      maxAge: undefined,
    });

    res.clearCookie("session_hint", {
      ...sessionHintOptions(),
      maxAge: undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await getCurrentUser(req.user.userId);

    const maintenance = await getMaintenanceStatus();
    if (maintenance.enabled && user.role !== "SUPER_ADMIN") {
      return res.status(503).json({
        success: false,
        code: "MAINTENANCE_MODE",
        error: "System Under Maintenance",
        message:
          maintenance.message ||
          "InizERP is currently under maintenance. Only Super Administrators may access the system.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
