import { Router } from "express";
import { RoleEnum } from "@prisma/client";

import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  updatePlanStatus,
  deletePlan,
  getPlanModules,
  assignPlanModule,
  removePlanModule,
  bulkAssignPlanModules,
} from "./plans.controller";

import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { auditMiddleware } from "../../../utils/audit";

import {
  createPlanSchema,
  updatePlanSchema,
  updatePlanStatusSchema,
  planIdSchema,
  planModuleParamsSchema,
  assignPlanModuleSchema,
  bulkAssignPlanModulesSchema,
} from "./plans.validation";

const router = Router();

router.use(authenticate);

router.use(authorize(RoleEnum.SUPER_ADMIN));
router.get("/", getPlans);
router.post(
  "/",
  validate(createPlanSchema),
  auditMiddleware("PLAN", "CREATE", "SUBSCRIPTION_PLAN"),
  createPlan,
);
router.get("/:id", validate(planIdSchema), getPlanById);
router.put(
  "/:id",
  validate(planIdSchema.merge(updatePlanSchema)),
  auditMiddleware("PLAN", "UPDATE", "SUBSCRIPTION_PLAN"),
  updatePlan,
);
router.patch(
  "/:id/status",
  validate(planIdSchema.merge(updatePlanStatusSchema)),
  auditMiddleware("PLAN", "STATUS", "SUBSCRIPTION_PLAN"),
  updatePlanStatus,
);
router.delete(
  "/:id",
  validate(planIdSchema),
  auditMiddleware("PLAN", "DELETE", "SUBSCRIPTION_PLAN"),
  deletePlan,
);

router.get("/:id/modules", validate(planIdSchema), getPlanModules);

router.post(
  "/:id/modules",
  validate(planIdSchema.merge(assignPlanModuleSchema)),
  auditMiddleware("PLAN_MODULE", "ASSIGN", "PLAN_MODULE"),
  assignPlanModule,
);

router.put(
  "/:id/modules",
  validate(planIdSchema.merge(bulkAssignPlanModulesSchema)),
  auditMiddleware("PLAN_MODULE", "BULK_ASSIGN", "PLAN_MODULE"),
  bulkAssignPlanModules,
);

router.delete(
  "/:id/modules/:moduleId",
  validate(planModuleParamsSchema),
  auditMiddleware("PLAN_MODULE", "REMOVE", "PLAN_MODULE"),
  removePlanModule,
);

export default router;
