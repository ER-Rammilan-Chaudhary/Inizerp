import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";
import {
  createHomeworkSubmissionSchema,
  homeworkSubmissionListSchema,
  homeworkSubmissionParamsSchema,
  updateHomeworkSubmissionSchema,
} from "./homework-submission.schema";
import {
  createHomeworkSubmission,
  deleteHomeworkSubmission,
  getHomeworkSubmissionById,
  getHomeworkSubmissions,
  updateHomeworkSubmission,
} from "./homework-submission.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", validate(homeworkSubmissionListSchema), getHomeworkSubmissions);

router.get(
  "/:id",
  validate(homeworkSubmissionParamsSchema),
  getHomeworkSubmissionById,
);

router.post(
  "/",
  validate(createHomeworkSubmissionSchema),
  createHomeworkSubmission,
);

router.patch(
  "/:id",
  validate(homeworkSubmissionParamsSchema),
  validate(updateHomeworkSubmissionSchema),
  updateHomeworkSubmission,
);

router.delete(
  "/:id",
  validate(homeworkSubmissionParamsSchema),
  deleteHomeworkSubmission,
);

export default router;
