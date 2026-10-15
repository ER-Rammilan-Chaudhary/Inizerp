import { Request, Response, NextFunction } from "express";
import { RoleEnum } from "@prisma/client";

export const tenantMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role === RoleEnum.SUPER_ADMIN) {
    req.tenant = {
      schoolId: null,
    };

    return next();
  }

  if (!req.user.schoolId) {
    return res.status(403).json({
      success: false,
      message: "School context is required",
    });
  }

  req.tenant = {
    schoolId: req.user.schoolId,
  };

  next();
};
