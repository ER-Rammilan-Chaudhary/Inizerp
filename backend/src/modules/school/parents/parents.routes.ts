import { Router } from "express";
import { authorize } from "../../../middleware/rbac.middleware";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createParentController,
  deleteParentController,
  getParentByIdController,
  getParentsController,
  updateParentController,
} from "./parents.controller";

import { createParentSchema, updateParentSchema } from "./parents.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getParentsController);

router.get("/:id", getParentByIdController);

router.post("/", validate(createParentSchema), createParentController);

router.patch("/:id", validate(updateParentSchema), updateParentController);

router.delete("/:id", deleteParentController);

export default router;
