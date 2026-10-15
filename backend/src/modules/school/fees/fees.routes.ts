import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createFeeController,
  deleteFeeController,
  getFeeByIdController,
  getFeesController,
  updateFeeController,
} from "./fees.controller";

import { createFeeSchema, updateFeeSchema } from "./fees.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getFeesController);

router.get("/:id", getFeeByIdController);

router.post("/", validate(createFeeSchema), createFeeController);

router.patch("/:id", validate(updateFeeSchema), updateFeeController);

router.delete("/:id", deleteFeeController);

export default router;
