import { Router } from "express";
import * as controller from "./rbac.controller";

const router = Router();

router.get("/", controller.getRoles);

router.post("/", controller.createRole);

router.patch("/:id", controller.updateRole);

router.delete("/:id", controller.deleteRole);

router.post("/:id/permissions", controller.assignPermissions);
router.get("/permissions", controller.getPermissions);

export default router;
