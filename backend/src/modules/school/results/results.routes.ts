import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createResultController,
  deleteResultController,
  getResultByIdController,
  getResultsController,
  updateResultController,
} from "./results.controller";

import { createResultSchema, updateResultSchema } from "./results.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getResultsController);

router.get("/:id", getResultByIdController);

router.post("/", validate(createResultSchema), createResultController);

router.patch("/:id", validate(updateResultSchema), updateResultController);

router.delete("/:id", deleteResultController);

export default router;
