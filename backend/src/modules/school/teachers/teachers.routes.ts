import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachers,
  updateTeacher,
} from "./teachers.controller";

import { createTeacherSchema, updateTeacherSchema } from "./teachers.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getTeachers);

router.get("/:id", getTeacherById);

router.post("/", validate(createTeacherSchema), createTeacher);

router.patch("/:id", validate(updateTeacherSchema), updateTeacher);

router.delete("/:id", deleteTeacher);

export default router;
