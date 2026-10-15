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
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from "./subjects.controller";
import {
  createSubjectSchema,
  subjectParamsSchema,
  subjectQuerySchema,
  updateSubjectSchema,
} from "./subjects.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", validateQuery(subjectQuerySchema), getSubjects);

router.get("/:id", validateParams(subjectParamsSchema), getSubjectById);

router.post("/", validate(createSubjectSchema), createSubject);

router.patch(
  "/:id",
  validateParams(subjectParamsSchema),
  validate(updateSubjectSchema),
  updateSubject,
);

router.delete("/:id", validateParams(subjectParamsSchema), deleteSubject);

export default router;
