import { Router } from "express";
import { RoleEnum } from "@prisma/client";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  updateSubscriptionStatus,
  deleteSubscription,
  renewSubscription,
  getActiveSubscriptions,
  getExpiredSubscriptions,
  getSubscriptionStats,
  getSchoolSubscriptions,
} from "./subscriptions.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { auditMiddleware } from "../../../utils/audit";

const router = Router();

router.use(authenticate);
router.use(authorize(RoleEnum.SUPER_ADMIN));

router.get("/", getSubscriptions);
router.get("/stats", getSubscriptionStats);
router.get("/active", getActiveSubscriptions);
router.get("/expired", getExpiredSubscriptions);
router.get("/school/:schoolId", getSchoolSubscriptions);
router.get("/:id", getSubscriptionById);
router.post("/",auditMiddleware("SUBSCRIPTIONS", "CREATE", "SUBSCRIPTION"),createSubscription,);

router.patch("/:id", auditMiddleware("SUBSCRIPTIONS", "UPDATE", "SUBSCRIPTION"),
  updateSubscription,);

router.patch(
  "/:id/status",
  auditMiddleware("SUBSCRIPTIONS", "STATUS_UPDATE", "SUBSCRIPTION"),
  updateSubscriptionStatus,
);

router.patch(
  "/:id/renew",
  auditMiddleware("SUBSCRIPTIONS", "RENEW", "SUBSCRIPTION"),
  renewSubscription,
);

router.delete(
  "/:id",
  auditMiddleware("SUBSCRIPTIONS", "DELETE", "SUBSCRIPTION"),
  deleteSubscription,
);

export default router;
