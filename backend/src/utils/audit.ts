import { Request, Response, NextFunction } from "express";

import { createAuditLogService } from "../modules/super-admin/audit-logs/audit-logs.service";

const SENSITIVE_FIELDS = new Set([
  "password",
  "ownerPassword",
  "confirmPassword",
  "currentPassword",
  "newPassword",
  "oldPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "secret",
  "clientSecret",
  "cookie",
  "setCookie",
]);

export const sanitizeAuditData = (data: unknown): unknown => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeAuditData(item));
  }

  if (typeof data !== "object") {
    return data;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_FIELDS.has(key)) {
      result[key] = "[REDACTED]";
      continue;
    }

    result[key] = sanitizeAuditData(value);
  }

  return result;
};

const getIpAddress = (req: Request): string | undefined => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }

  return req.ip || undefined;
};

const getBrowser = (req: Request): string | undefined => {
  const userAgent = req.headers["user-agent"];

  if (!userAgent || typeof userAgent !== "string") {
    return undefined;
  }

  if (/edg/i.test(userAgent)) {
    return "Microsoft Edge";
  }

  if (/chrome/i.test(userAgent)) {
    return "Google Chrome";
  }

  if (/firefox/i.test(userAgent)) {
    return "Mozilla Firefox";
  }

  if (/safari/i.test(userAgent)) {
    return "Safari";
  }

  if (/opera|opr/i.test(userAgent)) {
    return "Opera";
  }

  return "Unknown";
};

const getDevice = (req: Request): string | undefined => {
  const userAgent = req.headers["user-agent"];

  if (!userAgent || typeof userAgent !== "string") {
    return undefined;
  }

  if (/tablet|ipad/i.test(userAgent)) {
    return "Tablet";
  }

  if (/mobile/i.test(userAgent)) {
    return "Mobile";
  }

  return "Desktop";
};

const getEntityId = (req: Request, body: unknown): string | undefined => {
  if (typeof req.params?.id === "string") {
    return req.params.id;
  }

  if (typeof body === "object" && body !== null && "data" in body) {
    const data = (body as { data?: unknown }).data;

    if (
      typeof data === "object" &&
      data !== null &&
      "id" in data &&
      typeof (data as { id?: unknown }).id === "string"
    ) {
      return (data as { id: string }).id;
    }
  }

  return undefined;
};

const getSchoolId = (req: Request, body: unknown): string | undefined => {
  if (typeof req.params?.schoolId === "string") {
    return req.params.schoolId;
  }

  if (typeof req.body?.schoolId === "string") {
    return req.body.schoolId;
  }

  if (typeof body === "object" && body !== null && "data" in body) {
    const data = (body as { data?: unknown }).data;

    if (
      typeof data === "object" &&
      data !== null &&
      "schoolId" in data &&
      typeof (data as { schoolId?: unknown }).schoolId === "string"
    ) {
      return (data as { schoolId: string }).schoolId;
    }
  }

  return undefined;
};

export const auditMiddleware = (
  module: string,
  action: string,
  entity: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = (body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.userId;

        const entityId = getEntityId(req, body);

        const schoolId = getSchoolId(req, body);

        const meta = {
          request: {
            method: req.method,
            path: req.originalUrl,
            params: sanitizeAuditData(req.params),
            query: sanitizeAuditData(req.query),
            body: sanitizeAuditData(req.body),
          },
          response: {
            statusCode: res.statusCode,
          },
        };

        void createAuditLogService({
          userId,
          schoolId,
          action,
          module,
          entity,
          entityId,
          meta,
          browser: getBrowser(req),
          device: getDevice(req),
          ipAddress: getIpAddress(req),
          userAgent:
            typeof req.headers["user-agent"] === "string"
              ? req.headers["user-agent"]
              : undefined,
        }).catch((error) => {
          console.error("Failed to create audit log:", error);
        });
      }

      return originalJson(body);
    };

    next();
  };
};
