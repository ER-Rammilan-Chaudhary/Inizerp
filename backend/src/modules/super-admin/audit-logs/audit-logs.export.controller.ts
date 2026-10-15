import { Request, Response, NextFunction } from "express";

import { exportAuditLogsCSVService } from "./audit-logs.export.service";

export const exportAuditLogsCSV = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const csv = await exportAuditLogsCSVService({
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

    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="audit-logs.csv"',
    );

    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
