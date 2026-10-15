import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createLeaveRequestSchema,
  updateLeaveRequestSchema,
} from "./leave-requests.schema";

import {
  approveLeaveRequest,
  cancelLeaveRequest,
  createLeaveRequest,
  deleteLeaveRequest,
  getLeaveRequestById,
  getLeaveRequests,
  rejectLeaveRequest,
  updateLeaveRequest,
} from "./leave-requests.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getLeaveRequests);

router.get("/:id", getLeaveRequestById);

router.post("/", validate(createLeaveRequestSchema), createLeaveRequest);

router.patch("/:id", validate(updateLeaveRequestSchema), updateLeaveRequest);

router.patch("/:id/approve", approveLeaveRequest);

router.patch("/:id/reject", rejectLeaveRequest);

router.patch("/:id/cancel", cancelLeaveRequest);

router.delete("/:id", deleteLeaveRequest);

export default router;
