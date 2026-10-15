import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import {
  validate,
  validateParams,
} from "../../../middleware/validate.middleware";

import {
  createEnrollmentController,
  deleteEnrollmentController,
  getEnrollmentByIdController,
  getEnrollmentsController,
  promoteStudentsController,
  updateEnrollmentController,
} from "./enrollments.controller";

import {
  createEnrollmentSchema,
  enrollmentParamsSchema,
  promoteStudentsSchema,
  updateEnrollmentSchema,
} from "./enrollments.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getEnrollmentsController);

router.post(
  "/promote",
  validate(promoteStudentsSchema),
  promoteStudentsController,
);

router.get(
  "/:id",
  validateParams(enrollmentParamsSchema),
  getEnrollmentByIdController,
);

router.post("/", validate(createEnrollmentSchema), createEnrollmentController);

router.patch(
  "/:id",
  validateParams(enrollmentParamsSchema),
  validate(updateEnrollmentSchema),
  updateEnrollmentController,
);

router.delete(
  "/:id",
  validateParams(enrollmentParamsSchema),
  deleteEnrollmentController,
);

export default router;
