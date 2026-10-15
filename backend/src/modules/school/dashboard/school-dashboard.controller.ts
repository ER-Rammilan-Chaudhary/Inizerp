import { Request, Response } from "express";

import {
  getSchoolDashboardService,
  getSchoolEnabledModuleKeysService,
} from "./school-dashboard.service";

export const getSchoolEnabledModuleKeys = async (
  req: Request,
  res: Response,
) => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    return res.status(403).json({
      success: false,
      message: "School context is required",
    });
  }

  const data = await getSchoolEnabledModuleKeysService(schoolId);

  return res.status(200).json({
    success: true,
    message: "School modules fetched successfully",
    data,
  });
};

export const getSchoolDashboard = async (req: Request, res: Response) => {
  const schoolId = req.tenant?.schoolId;

  if (!schoolId) {
    return res.status(403).json({
      success: false,
      message: "School context is required",
    });
  }

  const data = await getSchoolDashboardService(schoolId);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "School not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "School dashboard fetched successfully",
    data,
  });
};
