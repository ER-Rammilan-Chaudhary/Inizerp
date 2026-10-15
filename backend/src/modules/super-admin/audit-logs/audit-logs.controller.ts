import { Request, Response, NextFunction } from "express";

import {
  getAuditLogsService,
  getAuditLogByIdService,
  getRecentAuditLogsService,
  getAuditStatsService,
} from "./audit-logs.service";

export const getAuditLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getAuditLogsService({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
      action:
        typeof req.query.action === "string" ? req.query.action : undefined,
      module:
        typeof req.query.module === "string" ? req.query.module : undefined,
      entity:
        typeof req.query.entity === "string" ? req.query.entity : undefined,
      schoolId:
        typeof req.query.schoolId === "string" ? req.query.schoolId : undefined,
      userId:
        typeof req.query.userId === "string" ? req.query.userId : undefined,
      from: typeof req.query.from === "string" ? req.query.from : undefined,
      to: typeof req.query.to === "string" ? req.query.to : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Audit logs fetched successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getAuditLogByIdService(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Audit log fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentAuditLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const data = await getRecentAuditLogsService(limit);

    return res.status(200).json({
      success: true,
      message: "Recent audit logs fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getAuditStatsService();

    return res.status(200).json({
      success: true,
      message: "Audit statistics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
