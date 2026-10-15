import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { verifyAccessToken } from "../utils/jwt";

interface MaintenanceCache {
  enabled: boolean;
  message: string;
  cachedAt: number;
}

let cache: MaintenanceCache | null = null;
const CACHE_TTL_MS = 2000; // 2 seconds cache for near-instant updates

export const invalidateMaintenanceCache = () => {
  cache = null;
};

export const getMaintenanceStatus = async (): Promise<{
  enabled: boolean;
  message: string;
}> => {
  const now = Date.now();
  if (cache && now - cache.cachedAt < CACHE_TTL_MS) {
    return { enabled: cache.enabled, message: cache.message };
  }

  try {
    const [modeSetting, msgSetting] = await Promise.all([
      prisma.setting.findFirst({
        where: { key: "maintenance_mode", schoolId: null },
        select: { value: true },
      }),
      prisma.setting.findFirst({
        where: { key: "maintenance_message", schoolId: null },
        select: { value: true },
      }),
    ]);

    const enabled =
      modeSetting?.value === true ||
      modeSetting?.value === "true" ||
      modeSetting?.value === "1";

    const message =
      typeof msgSetting?.value === "string"
        ? msgSetting.value
        : "InizERP is currently undergoing scheduled maintenance. Please check back shortly.";

    cache = { enabled, message, cachedAt: now };
    return { enabled, message };
  } catch {
    return {
      enabled: false,
      message: "System operational",
    };
  }
};

/**
 * Maintenance mode middleware:
 * When maintenance is active, only SUPER_ADMIN routes and essential health checks are permitted.
 * School admin, teacher, student, and parent routes will receive HTTP 503.
 */
export const maintenanceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fullPath = req.originalUrl || req.baseUrl + req.path || req.path;

  // Always permit health checks and static uploads
  if (
    req.path === "/" ||
    req.path === "/healthz" ||
    req.path === "/readyz" ||
    req.path.startsWith("/uploads") ||
    fullPath.startsWith("/uploads")
  ) {
    return next();
  }

  // Always permit super-admin endpoints so administrators can operate the platform
  if (
    fullPath.startsWith("/api/super-admin") ||
    fullPath.startsWith("/super-admin") ||
    req.path.startsWith("/api/super-admin") ||
    req.path.startsWith("/super-admin")
  ) {
    return next();
  }

  // Permit public status checks
  if (
    fullPath.startsWith("/api/auth/maintenance-status") ||
    req.path === "/api/auth/maintenance-status"
  ) {
    return next();
  }

  const { enabled, message } = await getMaintenanceStatus();

  if (!enabled) {
    return next();
  }

  // Maintenance is active:
  // 1. If user is already authenticated on req as SUPER_ADMIN
  const user = (req as any).user;
  if (user && user.role === "SUPER_ADMIN") {
    return next();
  }

  // 2. Check Authorization header for valid SUPER_ADMIN token
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7).trim();
      const payload = verifyAccessToken(token);
      if (payload && payload.role === "SUPER_ADMIN") {
        (req as any).user = payload;
        return next();
      }
    } catch {
      // Invalid/expired token - proceed to maintenance block
    }
  }

  return res.status(503).json({
    success: false,
    code: "MAINTENANCE_MODE",
    error: "System Under Maintenance",
    message: message || "System is currently undergoing scheduled maintenance.",
  });
};
