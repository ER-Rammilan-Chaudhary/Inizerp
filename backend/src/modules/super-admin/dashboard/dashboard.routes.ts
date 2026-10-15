import { Router } from "express";
import {
  dashboardStats,
  dashboardCharts,
  recentSchools,
  recentNotifications,
  revenueStats,
  topSchools,
  recentActivities,
  subscriptionOverview,
  platformGrowth,
  expiringSubscriptions,
  systemHealth,
} from "./dashboard.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { RoleEnum } from "@prisma/client";

const router = Router();

router.use(authenticate, authorize(RoleEnum.SUPER_ADMIN));

router.get("/", dashboardStats);
router.get("/charts", dashboardCharts);
router.get("/recent-schools", recentSchools);
router.get("/recent-notifications", recentNotifications);
router.get("/revenue", revenueStats);
router.get("/top-schools", topSchools);
router.get("/recent-activities", recentActivities);
router.get("/subscription", subscriptionOverview);
router.get("/platform-growth", platformGrowth);
router.get("/expiring-subscriptions", expiringSubscriptions);
router.get("/system-health", systemHealth);

export default router;
