import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";
import {
  createHomeworkSchema,
  homeworkListSchema,
  homeworkParamsSchema,
  updateHomeworkSchema,
} from "./homework.schema";
import {
  createHomework,
  deleteHomework,
  getHomeworkById,
  getHomeworks,
  updateHomework,
} from "./homework.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", validate(homeworkListSchema), getHomeworks);

router.get("/:id", validate(homeworkParamsSchema), getHomeworkById);

router.post("/", validate(createHomeworkSchema), createHomework);

router.patch(
  "/:id",
  validate(homeworkParamsSchema),
  validate(updateHomeworkSchema),
  updateHomework,
);

router.delete("/:id", validate(homeworkParamsSchema), deleteHomework);

export default router;
