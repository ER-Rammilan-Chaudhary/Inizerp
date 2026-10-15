import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import { createPaymentSchema, reversePaymentSchema } from "./payments.schema";

import {
  listPayments,
  getPayment,
  createPaymentController,
  reversePaymentController,
  cancelPaymentController,
} from "./payments.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", listPayments);

router.get("/:id", getPayment);

router.post("/", validate(createPaymentSchema), createPaymentController);

router.patch(
  "/:id/reverse",
  validate(reversePaymentSchema),
  reversePaymentController,
);

router.patch("/:id/cancel", cancelPaymentController);

export default router;
