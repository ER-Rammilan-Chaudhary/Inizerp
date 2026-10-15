import { Router } from "express";
import { RoleEnum } from "@prisma/client";

import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";

import {
  getAuditLogs,
  getAuditLogById,
  getRecentAuditLogs,
  getAuditStats,
} from "./audit-logs.controller";

import { exportAuditLogsCSV } from "./audit-logs.export.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(RoleEnum.SUPER_ADMIN));

router.get("/", getAuditLogs);

router.get("/recent", getRecentAuditLogs);

router.get("/stats", getAuditStats);

router.get("/export/csv", exportAuditLogsCSV);

router.get("/:id", getAuditLogById);

export default router;
