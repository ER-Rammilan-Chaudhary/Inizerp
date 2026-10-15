import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import {
  validate,
  validateParams,
} from "../../../middleware/validate.middleware";

import {
  getAcademicYears,
  getCurrentAcademicYear,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  setCurrentAcademicYear,
  deleteAcademicYear,
} from "./academic-years.controller";

import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
  academicYearParamsSchema,
} from "./academic-years.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getAcademicYears);

router.get("/current", getCurrentAcademicYear);

router.get(
  "/:id",
  validateParams(academicYearParamsSchema),
  getAcademicYearById,
);

router.post("/", validate(createAcademicYearSchema), createAcademicYear);

router.patch(
  "/:id",
  validateParams(academicYearParamsSchema),
  validate(updateAcademicYearSchema),
  updateAcademicYear,
);

router.patch(
  "/:id/set-current",
  validateParams(academicYearParamsSchema),
  setCurrentAcademicYear,
);

router.delete(
  "/:id",
  validateParams(academicYearParamsSchema),
  deleteAcademicYear,
);

export default router;
