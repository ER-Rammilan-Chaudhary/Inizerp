import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";
import { cancelNotificationController, createNotificationController, deleteNotificationController, getNotificationByIdController, getNotificationsController, sendNotificationController, updateNotificationController, }from "./notifications.controller";
import { createNotificationSchema, updateNotificationSchema, }from "./notifications.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));
router.get("/", getNotificationsController);
router.get("/:id", getNotificationByIdController);
router.post("/", validate(createNotificationSchema), createNotificationController,);
router.patch("/:id", validate(updateNotificationSchema), updateNotificationController,);
router.patch("/:id/send", sendNotificationController);
router.patch("/:id/cancel", cancelNotificationController);
router.delete("/:id", deleteNotificationController);


export default router;
