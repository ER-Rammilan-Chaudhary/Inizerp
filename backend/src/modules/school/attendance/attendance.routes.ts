import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createAttendanceController,
  deleteAttendanceController,
  getAttendanceByIdController,
  getAttendanceController,
  updateAttendanceController,
} from "./attendance.controller";

import {
  createAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getAttendanceController);

router.get("/:id", getAttendanceByIdController);

router.post("/", validate(createAttendanceSchema), createAttendanceController);

router.patch(
  "/:id",
  validate(updateAttendanceSchema),
  updateAttendanceController,
);

router.delete("/:id", deleteAttendanceController);

export default router;
