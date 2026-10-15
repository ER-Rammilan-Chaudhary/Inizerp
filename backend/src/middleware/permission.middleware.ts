import { Request, Response, NextFunction } from "express";
import { RoleEnum } from "@prisma/client";
import { prisma } from "../config/prisma";

export const requirePermission = (permissionKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (req.user.role === RoleEnum.SUPER_ADMIN) {
        return next();
      }

      const userRole = await prisma.userRole.findFirst({
        where: {
          userId: req.user.userId,
          role: {
            permissions: {
              some: {
                permission: {
                  key: permissionKey,
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
