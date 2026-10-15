import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createGuardianSchema,
  guardianParamsSchema,
  updateGuardianSchema,
} from "./guardians.schema";

import {
  createGuardian,
  deleteGuardian,
  getGuardianById,
  getGuardians,
  updateGuardian,
} from "./guardians.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getGuardians);

router.get("/:id", validate(guardianParamsSchema), getGuardianById);

router.post("/", validate(createGuardianSchema), createGuardian);

router.patch("/:id", validate(updateGuardianSchema), updateGuardian);

router.delete("/:id", validate(guardianParamsSchema), deleteGuardian);

export default router;
