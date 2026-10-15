import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import {
  validate,
  validateParams,
} from "../../../middleware/validate.middleware";
import { userUpload } from "../../../middleware/upload.middleware";

import {
  createStudentController,
  deleteStudentController,
  getStudentByIdController,
  getStudentsController,
  updateStudentController,
} from "./students.controller";

import {
  createStudentSchema,
  studentParamsSchema,
  updateStudentSchema,
} from "./students.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getStudentsController);

router.get(
  "/:id",
  validateParams(studentParamsSchema),
  getStudentByIdController,
);

router.post(
  "/",
  userUpload.single("avatar"),
  validate(createStudentSchema),
  createStudentController,
);

router.patch(
  "/:id",
  userUpload.single("avatar"),
  validateParams(studentParamsSchema),
  validate(updateStudentSchema),
  updateStudentController,
);

router.delete(
  "/:id",
  validateParams(studentParamsSchema),
  deleteStudentController,
);

export default router;
