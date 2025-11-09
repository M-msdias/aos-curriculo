import { Router } from "express";
import { skillController } from "../controllers/skillController.js";

const router = Router();

router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSkillById);
router.post("/", skillController.createNewSkill);
router.patch("/:id", skillController.updateSkillById);
router.delete("/:id", skillController.deleteSkillById);

export default router;