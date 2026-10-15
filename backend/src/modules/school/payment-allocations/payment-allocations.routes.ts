import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import { createPaymentAllocationSchema } from "./payment-allocations.schema";

import {
  listPaymentAllocations,
  getPaymentAllocation,
  createPaymentAllocationController,
  deletePaymentAllocationController,
} from "./payment-allocations.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", listPaymentAllocations);

router.get("/:id", getPaymentAllocation);

router.post(
  "/",
  validate(createPaymentAllocationSchema),
  createPaymentAllocationController,
);

router.delete("/:id", deletePaymentAllocationController);

export default router;
