import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import {
  validate,
  validateParams,
  validateQuery,
} from "../../../middleware/validate.middleware";

import {
  addPeriodController,
  createTimetableController,
  deletePeriodController,
  deleteTimetableController,
  getPeriodsController,
  getTimetableByIdController,
  getTimetablesController,
  savePeriodsController,
  updateTimetableController,
  upsertTimetableController,
} from "./timetables.controller";

import {
  addPeriodSchema,
  createTimetableSchema,
  periodParamsSchema,
  savePeriodsSchema,
  timetableListSchema,
  timetableParamsSchema,
  updateTimetableSchema,
} from "./timetables.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

// Period Master routes (Must be before /:id)
router.get("/periods", getPeriodsController);
router.post("/periods", validate(savePeriodsSchema), savePeriodsController);
router.post("/periods/add", validate(addPeriodSchema), addPeriodController);
router.delete(
  "/periods/:periodId",
  validateParams(periodParamsSchema),
  deletePeriodController,
);

// Timetable Upsert (assign/update seamlessly)
router.post(
  "/upsert",
  validate(createTimetableSchema),
  upsertTimetableController,
);

router.get("/", validateQuery(timetableListSchema), getTimetablesController);

router.get(
  "/:id",
  validateParams(timetableParamsSchema),
  getTimetableByIdController,
);

router.post("/", validate(createTimetableSchema), createTimetableController);

router.patch(
  "/:id",
  validateParams(timetableParamsSchema),
  validate(updateTimetableSchema),
  updateTimetableController,
);

router.delete(
  "/:id",
  validateParams(timetableParamsSchema),
  deleteTimetableController,
);

export default router;
