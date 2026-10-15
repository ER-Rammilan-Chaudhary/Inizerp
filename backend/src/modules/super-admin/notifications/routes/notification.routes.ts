import { Router } from "express";
import { RoleEnum } from "@prisma/client";

import { authenticate } from "../../../../middleware/auth.middleware";
import { authorize } from "../../../../middleware/rbac.middleware";
import {
  validate,
  validateParams,
  validateQuery,
} from "../../../../middleware/validate.middleware";

import {
  createNotificationController,
  getNotificationsController,
  getSchoolNotificationsController,
  getNotificationController,
  updateNotificationController,
  deleteNotificationController,
  bulkDeleteNotificationsController,
} from "../controllers/notification.management.controller";

import {
  getNotificationStatsController,
  getNotificationReadStatsController,
  getNotificationStatusStatsController,
  getNotificationTypeStatsController,
  getNotificationPriorityStatsController,
} from "../controllers/notification.stats.controller";

import {
  getMyNotificationsController,
  getMyNotificationController,
  getMyUnreadNotificationsController,
  getMyNotificationSummaryController,
  getUnreadNotificationCountController,
  markNotificationAsReadController,
  markNotificationAsUnreadController,
  markAllNotificationsAsReadController,
  bulkMarkNotificationsAsReadController,
  getNotificationReadStatusController,
} from "../controllers/notification.user.controller";

import {
  createNotificationSchema,
  updateNotificationSchema,
  notificationQuerySchema,
  myNotificationQuerySchema,
  notificationIdSchema,
  notificationSchoolIdSchema,
  bulkReadNotificationSchema,
  bulkDeleteNotificationSchema,
} from "../schema/notification.schema";

const router = Router();

router.use(authenticate);

router.get(
  "/stats/overview",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateQuery(notificationQuerySchema),
  getNotificationStatsController,
);

router.get(
  "/stats/status",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateQuery(notificationQuerySchema),
  getNotificationStatusStatsController,
);

router.get(
  "/stats/type",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateQuery(notificationQuerySchema),
  getNotificationTypeStatsController,
);

router.get(
  "/stats/priority",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateQuery(notificationQuerySchema),
  getNotificationPriorityStatsController,
);

router.get(
  "/stats/:id/read",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateParams(notificationIdSchema),
  getNotificationReadStatsController,
);

router.get(
  "/my",
  validateQuery(myNotificationQuerySchema),
  getMyNotificationsController,
);

router.get(
  "/my/unread",
  validateQuery(myNotificationQuerySchema),
  getMyUnreadNotificationsController,
);

router.get("/my/summary", getMyNotificationSummaryController);

router.get("/my/unread-count", getUnreadNotificationCountController);

router.get(
  "/my/:id",
  validateParams(notificationIdSchema),
  getMyNotificationController,
);

router.patch("/read-all", markAllNotificationsAsReadController);
router.patch(
  "/bulk/read",
  validate(bulkReadNotificationSchema),
  bulkMarkNotificationsAsReadController,
);

router.patch(
  "/:id/read",
  validateParams(notificationIdSchema),
  markNotificationAsReadController,
);

router.patch(
  "/:id/unread",
  validateParams(notificationIdSchema),
  markNotificationAsUnreadController,
);

router.get(
  "/:id/read-status",
  validateParams(notificationIdSchema),
  getNotificationReadStatusController,
);

router.delete(
  "/bulk/delete",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validate(bulkDeleteNotificationSchema),
  bulkDeleteNotificationsController,
);

router.get(
  "/school/:schoolId",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateParams(notificationSchoolIdSchema),
  validateQuery(notificationQuerySchema),
  getSchoolNotificationsController,
);

router.post(
  "/",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validate(createNotificationSchema),
  createNotificationController,
);
router.get(
  "/",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateQuery(notificationQuerySchema),
  getNotificationsController,
);

router.patch(
  "/:id",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateParams(notificationIdSchema),
  validate(updateNotificationSchema),
  updateNotificationController,
);

router.delete(
  "/:id",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateParams(notificationIdSchema),
  deleteNotificationController,
);

router.get(
  "/:id",
  authorize(RoleEnum.SUPER_ADMIN, RoleEnum.SCHOOL_ADMIN),
  validateParams(notificationIdSchema),
  getNotificationController,
);

export default router;
