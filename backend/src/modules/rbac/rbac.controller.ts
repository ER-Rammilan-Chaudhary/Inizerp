import { Request, Response } from "express";
import * as service from "./rbac.service";
import { prisma } from "../../config/prisma";

export const getRoles = async (_: Request, res: Response) => {
  const roles = await service.getRoles();

  res.json({
    success: true,
    data: roles,
  });
};

export const createRole = async (req: Request, res: Response) => {
  const role = await service.createRole(req.body);

  res.status(201).json({
    success: true,
    data: role,
  });
};

export const updateRole = async (req: Request, res: Response) => {
  const role = await service.updateRole(req.params.id as string, req.body);

  res.json({
    success: true,
    data: role,
  });
};

export const deleteRole = async (req: Request, res: Response) => {
  await service.deleteRole(req.params.id as string);

  res.json({
    success: true,
    message: "Role deleted successfully",
  });
};

export const assignPermissions = async (req: Request, res: Response) => {
  try {
    const role = await service.assignPermissionsToRole(
      req.params.id as string,
      req.body.permissionIds,
    );

    res.status(200).json({
      success: true,
      message: "Permissions assigned successfully",
      data: role,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// GET ALL PERMISSIONS
// =================================

export const getPermissions = async (_req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [
        {
          module: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

