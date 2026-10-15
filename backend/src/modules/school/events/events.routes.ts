import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { tenantMiddleware } from "../../../middleware/tenant.middleware";
import { authorize } from "../../../middleware/rbac.middleware";
import { validate } from "../../../middleware/validate.middleware";

import {
  createEventController,
  deleteEventController,
  getEventByIdController,
  getEventsController,
  updateEventController,
} from "./events.controller";

import { createEventSchema, updateEventSchema } from "./events.schema";

const router = Router();

router.use(authenticate);
router.use(tenantMiddleware);
router.use(authorize("SCHOOL_ADMIN"));

router.get("/", getEventsController);

router.get("/:id", getEventByIdController);

router.post("/", validate(createEventSchema), createEventController);

router.patch("/:id", validate(updateEventSchema), updateEventController);

router.delete("/:id", deleteEventController);

export default router;
