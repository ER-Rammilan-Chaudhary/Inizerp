import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import { createInvoiceSchema, updateInvoiceSchema } from "./invoices.schema";

import {
  cancelInvoice,
  createInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "./invoices.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getInvoices);

router.get("/:id", getInvoiceById);

router.post("/", validate(createInvoiceSchema), createInvoice);

router.patch("/:id", validate(updateInvoiceSchema), updateInvoice);

router.patch("/:id/cancel", cancelInvoice);

export default router;
