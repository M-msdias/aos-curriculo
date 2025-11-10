import type { Request, Response } from "express";
import { experiencesService } from "../services/experienceService.js";
import { AppException } from "../exceptions/appException.js";

export const experienceController = {
    getAllExperiences: async (req: Request, res: Response) => {
        try {
            const result = await experiencesService.getAllExperience();

            return res.status(200).json(result);
        } catch (error: Error | any) {
            throw new Error("Error fetching users: " + error.message);
        }
    },

    getExperienceById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            const result = await experiencesService.getExperienceById(id);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) { 
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewExperience: async (req: Request, res: Response) => {
        const {
            userId,
            content,
            start,
            end
        } = req.body;

        try {
            const result = await experiencesService.createNewExperience(
                userId,
                content,
                start,
                end
            );
            return res.status(201).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateExperienceById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const {
                userId,
                content,
                start,
                end
            } = req.body;

            const result = await experiencesService.updateExperienceById(id, userId, content, start, end);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteExperienceById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            await experiencesService.deleteExperienceById(id);
            return res.status(204).send();
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }   
    }

}