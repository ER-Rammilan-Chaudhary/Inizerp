import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createAnnouncementController,
  deleteAnnouncementController,
  getAnnouncementByIdController,
  getAnnouncementsController,
  updateAnnouncementController,
} from "./announcements.controller";

import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "./announcements.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getAnnouncementsController);

router.get("/:id", getAnnouncementByIdController);

router.post(
  "/",
  validate(createAnnouncementSchema),
  createAnnouncementController,
);

router.patch(
  "/:id",
  validate(updateAnnouncementSchema),
  updateAnnouncementController,
);

router.delete("/:id", deleteAnnouncementController);

export default router;
