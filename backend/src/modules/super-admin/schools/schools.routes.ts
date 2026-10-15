import { Router } from "express";
import { RoleEnum } from "@prisma/client";
import * as schoolController from "./schools.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { auditMiddleware } from "../../../utils/audit";
import { upload } from "../../../middleware/upload.middleware";
import {
  createSchoolSchema,
  updateSchoolSchema,
  updateSchoolStatusSchema,
  updateSchoolAdminSchema,
  resetSchoolAdminPasswordSchema,
} from "./schools.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(RoleEnum.SUPER_ADMIN),
  upload.single("logo"),
  validate(createSchoolSchema),
  auditMiddleware("SCHOOL", "CREATE", "School"),
  schoolController.createSchool,
);

router.get("/", authorize(RoleEnum.SUPER_ADMIN), schoolController.getSchools);

router.get(
  "/:id",
  authorize(RoleEnum.SUPER_ADMIN),
  schoolController.getSchoolById,
);

router.put(
  "/:id",
  authorize(RoleEnum.SUPER_ADMIN),
  upload.single("logo"),
  validate(updateSchoolSchema),
  auditMiddleware("SCHOOL", "UPDATE", "School"),
  schoolController.updateSchool,
);

router.patch(
  "/:id/status",
  authorize(RoleEnum.SUPER_ADMIN),
  validate(updateSchoolStatusSchema),
  auditMiddleware("SCHOOL", "UPDATE_STATUS", "School"),
  schoolController.updateSchoolStatus,
);

router.delete(
  "/:id",
  authorize(RoleEnum.SUPER_ADMIN),
  auditMiddleware("SCHOOL", "DELETE", "School"),
  schoolController.deleteSchool,
);

router.get(
  "/:id/admin",
  authorize(RoleEnum.SUPER_ADMIN),
  schoolController.getSchoolAdminController,
);

router.patch(
  "/:id/admin",
  authorize(RoleEnum.SUPER_ADMIN),
  validate(updateSchoolAdminSchema),
  auditMiddleware("SCHOOL_ADMIN", "UPDATE", "USER"),
  schoolController.updateSchoolAdminController,
);

router.patch(
  "/:id/admin/reset-password",
  authorize(RoleEnum.SUPER_ADMIN),
  validate(resetSchoolAdminPasswordSchema),
  auditMiddleware("SCHOOL_ADMIN", "RESET_PASSWORD", "USER"),
  schoolController.resetSchoolAdminPasswordController,
);

export default router;
