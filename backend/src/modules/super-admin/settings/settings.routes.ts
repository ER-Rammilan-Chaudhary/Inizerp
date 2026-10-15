import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  getSettings,
  getSettingByKey,
  createOrUpdateSetting,
  updateSetting,
  deleteSetting,
} from "./settings.controller";

import {
  createOrUpdateSettingSchema,
  updateSettingSchema,
  settingParamsSchema,
} from "./settings.schema";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN"));

router.get("/", getSettings);
router.get("/:key", validate(settingParamsSchema), getSettingByKey);
router.post("/", validate(createOrUpdateSettingSchema), createOrUpdateSetting);
router.patch("/:key", validate(settingParamsSchema), validate(updateSettingSchema), updateSetting, );
router.delete("/:key", validate(settingParamsSchema), deleteSetting);

export default router;
