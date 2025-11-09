import type { Request, Response } from "express";
import { skillService } from "../services/skillService.js";
import { AppException } from "../exceptions/appException.js";

export const skillController = {
    getAllSkills: async (req: Request, res: Response) => {
        try {
            const result = await skillService.getAllSkilss();

            return res.status(200).json(result);
        } catch (error: Error | any) {
            throw new Error("Error fetching skills: " + error.message);
        }
    },

    getSkillById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            const result = await skillService.getSkillById(id);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) { 
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewSkill: async (req: Request, res: Response) => {
        const {
            userId, 
            content,
        } = req.body;

        try {
            const result = await skillService.createNewSkill(
                userId, 
                content,
            );
            return res.status(201).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateSkillById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const {
                userId, 
                content,
            } = req.body;

            const result = await skillService.updateSkillById(id, userId, content);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(404).json({ message: error.message });
            if (error instanceof AppException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteSkillById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            await skillService.deleteSkillById(id);
            return res.status(204).send();
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }   
    }

}