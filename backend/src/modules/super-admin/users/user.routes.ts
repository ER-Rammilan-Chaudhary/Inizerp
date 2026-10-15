import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} from "./user.controller";

import {
  createSchoolAdminSchema,
  updateSchoolAdminSchema,
  resetPasswordSchema,
} from "./user.validation";

import { validate } from "../../../middleware/validate.middleware";
import { userUpload } from "../../../middleware/upload.middleware";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post(
  "/",
  userUpload.single("avatar"),
  validate(createSchoolAdminSchema),
  createUser,
);
router.patch(
  "/:id",
  userUpload.single("avatar"),
  validate(updateSchoolAdminSchema),
  updateUser,
);
router.delete("/:id", deleteUser);
router.patch(
  "/:id/reset-password",
  validate(resetPasswordSchema),
  resetPassword,
);
export default router;
