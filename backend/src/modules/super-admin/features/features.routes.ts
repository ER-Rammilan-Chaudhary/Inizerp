import { Router } from "express";
import {
  getFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  getFeatureCategories,
  getSchoolFeatures,
  assignFeature,
  bulkUpdateSchoolFeatures,
  toggleSchoolFeature,
  removeFeatureFromSchool,
  getFeatureStatistics,
  getFeatureUsage,
  searchFeatures,
} from "./features.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import {
  validate,
  validateParams,
} from "../../../middleware/validate.middleware";
import {
  createFeatureSchema,
  updateFeatureSchema,
  assignFeatureSchema,
  toggleFeatureSchema,
  bulkUpdateFeatureSchema,
  featureIdSchema,
  schoolFeatureParamsSchema,
  schoolModuleParamsSchema,
  featureSearchSchema,
} from "./features.validation";
import { RoleEnum } from "../../../constants/roles";

const router = Router();

router.use(authenticate);
router.use(authorize(RoleEnum.SUPER_ADMIN));

router.get("/", getFeatures);

router.get(
  "/search",
  validate(featureSearchSchema),
  searchFeatures,
);

router.get("/categories", getFeatureCategories);

router.get("/statistics", getFeatureStatistics);

router.get("/usage", getFeatureUsage);

router.post(
  "/",
  validate(createFeatureSchema),
  createFeature,
);

router.get(
  "/schools/:schoolId",
  validateParams(schoolFeatureParamsSchema),
  getSchoolFeatures,
);

router.post(
  "/schools/:schoolId/assign",
  validateParams(schoolFeatureParamsSchema),
  validate(assignFeatureSchema),
  assignFeature,
);

router.patch(
  "/schools/:schoolId",
  validateParams(schoolFeatureParamsSchema),
  validate(bulkUpdateFeatureSchema),
  bulkUpdateSchoolFeatures,
);

router.patch(
  "/schools/:schoolId/:moduleId",
  validateParams(schoolModuleParamsSchema),
  validate(toggleFeatureSchema),
  toggleSchoolFeature,
);

router.delete(
  "/schools/:schoolId/:moduleId",
  validateParams(schoolModuleParamsSchema),
  removeFeatureFromSchool,
);

router.get(
  "/:id",
  validateParams(featureIdSchema),
  getFeatureById,
);

router.patch(
  "/:id",
  validateParams(featureIdSchema),
  validate(updateFeatureSchema),
  updateFeature,
);

router.delete(
  "/:id",
  validateParams(featureIdSchema),
  deleteFeature,
);

export default router;