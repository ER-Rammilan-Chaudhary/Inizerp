import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import {
  validate,
  validateParams,
} from "../../../middleware/validate.middleware";

import {
  createClassController,
  createSectionController,
  deleteClassController,
  deleteSectionController,
  getClassByIdController,
  getClassesController,
  getSectionsController,
  updateClassController,
  updateSectionController,
} from "./classes.controller";

import {
  classIdParamsSchema,
  classParamsSchema,
  createClassSchema,
  createSectionSchema,
  sectionParamsSchema,
  updateClassSchema,
  updateSectionSchema,
} from "./classes.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getClassesController);
router.get("/:classId/sections", validateParams(classIdParamsSchema), getSectionsController,);
router.post("/:classId/sections", validateParams(classIdParamsSchema), validate(createSectionSchema), createSectionController,);
router.patch("/:classId/sections/:sectionId", validateParams(sectionParamsSchema), validate(updateSectionSchema), updateSectionController,);
router.delete("/:classId/sections/:sectionId", validateParams(sectionParamsSchema), deleteSectionController,);
router.get("/:id", validateParams(classParamsSchema), getClassByIdController);
router.post("/", validate(createClassSchema), createClassController);
router.patch("/:id", validateParams(classParamsSchema), validate(updateClassSchema), updateClassController, );
router.delete("/:id", validateParams(classParamsSchema), deleteClassController);

export default router;
