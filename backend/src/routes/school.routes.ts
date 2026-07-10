import { Router } from "express";
import * as schoolController from "../controllers/school.controller";

const router = Router();

/**
 * School CRUD
 */

// Create School
router.post("/", schoolController.createSchool);

// Get All Schools
router.get("/", schoolController.getSchools);

// Get School By Id
router.get("/:id", schoolController.getSchoolById);

// Update School
router.put("/:id", schoolController.updateSchool);

// Delete School
router.delete("/:id", schoolController.deleteSchool);

export default router;
