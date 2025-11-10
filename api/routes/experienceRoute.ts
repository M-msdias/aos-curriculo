import { Router } from "express";
import { experienceController } from "../controllers/experienceController.js";

const router = Router();

router.get("/", experienceController.getAllExperiences);
router.get("/:id", experienceController.getExperienceById);
router.post("/", experienceController.createNewExperience);
router.patch("/:id", experienceController.updateExperienceById);
router.delete("/:id", experienceController.deleteExperienceById);

export default router;