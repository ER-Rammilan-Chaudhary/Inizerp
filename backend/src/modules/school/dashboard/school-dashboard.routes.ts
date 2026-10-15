import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";

import {
	getSchoolDashboard,
	getSchoolEnabledModuleKeys,
} from "./school-dashboard.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN", "TEACHER", "PARENT", "STUDENT"),
);
router.get("/modules", getSchoolEnabledModuleKeys);
router.get("/", getSchoolDashboard);

export default router;


