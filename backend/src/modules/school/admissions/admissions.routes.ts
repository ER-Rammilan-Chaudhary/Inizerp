import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createAdmissionSchema,
  updateAdmissionSchema,
} from "./admissions.schema";

import {
  createAdmission,
  deleteAdmission,
  getAdmissionById,
  getAdmissions,
  getNextApplicationNo,
  updateAdmission,
} from "./admissions.controller";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getAdmissions);

router.get("/next-number", getNextApplicationNo);

router.get("/:id", getAdmissionById);

router.post("/", validate(createAdmissionSchema), createAdmission);

router.patch("/:id", validate(updateAdmissionSchema), updateAdmission);

router.delete("/:id", deleteAdmission);

export default router;
