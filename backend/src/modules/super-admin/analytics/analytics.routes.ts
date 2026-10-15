import { Router } from "express";
import { RoleEnum } from "@prisma/client";
import {
  getOverview,
  getSubscriptionAnalytics,
  getRevenue,
  getRecentSchools,
  getRecentNotifications,
  getSchoolGrowth,
  getStudentGrowth,
  getTeacherGrowth,
  getUserGrowth,
  getSubscriptionGrowth,
  getNotificationAnalytics,
  getSchoolAnalytics,
  getUserAnalytics,
  getMonthlyRevenue,
} from "./analytics.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validateQuery } from "../../../middleware/validate.middleware";
import { analyticsYearSchema } from "./analytics.validation";



const router = Router();

router.use(authenticate, authorize(RoleEnum.SUPER_ADMIN));

router.get("/overview", getOverview);

router.get("/subscriptions", getSubscriptionAnalytics);

router.get("/revenue", getRevenue);

router.get(
  "/revenue/monthly",
  validateQuery(analyticsYearSchema),
  getMonthlyRevenue,
);

router.get("/schools", getSchoolAnalytics);

router.get("/schools/recent", getRecentSchools);

router.get(
  "/schools/growth",
  validateQuery(analyticsYearSchema),
  getSchoolGrowth,
);

router.get(
  "/students/growth",
  validateQuery(analyticsYearSchema),
  getStudentGrowth,
);

router.get(
  "/teachers/growth",
  validateQuery(analyticsYearSchema),
  getTeacherGrowth,
);

router.get("/users", getUserAnalytics);

router.get("/users/growth", validateQuery(analyticsYearSchema), getUserGrowth);

router.get(
  "/subscriptions/growth",
  validateQuery(analyticsYearSchema),
  getSubscriptionGrowth,
);

router.get("/notifications", getNotificationAnalytics);

router.get("/notifications/recent", getRecentNotifications);

export default router;
