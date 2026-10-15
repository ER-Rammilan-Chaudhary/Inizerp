import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createExamController,
  deleteExamController,
  getExamByIdController,
  getExamsController,
  updateExamController,
} from "./exams.controller";

import { createExamSchema, updateExamSchema } from "./exams.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getExamsController);

router.get("/:id", getExamByIdController);

router.post("/", validate(createExamSchema), createExamController);

router.patch("/:id", validate(updateExamSchema), updateExamController);

router.delete("/:id", deleteExamController);

export default router;
