import type { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { AppException } from "../exceptions/appException.js";

export const userController = {
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const result = await userService.getAllUsers();

            return res.status(200).json(result);
        } catch (error: Error | any) {
            throw new Error("Error fetching users: " + error.message);
        }
    },

    getUserById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            const result = await userService.getUserById(id);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) { 
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewUser: async (req: Request, res: Response) => {
        const {
            fullName,
            birthDate,
            description,
            address,
        } = req.body;

        try {
            const result = await userService.createNewUser(
                fullName,
                birthDate,
                description,
                address,
            );
            return res.status(201).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateUserById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const {
                fullName,
                birthDate,
                description,
                address,
            } = req.body;

            const result = await userService.updateUserById(id, fullName, birthDate, description, address);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteUserById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            await userService.deleteUserById(id);
            return res.status(204).send();
        } catch (error: Error | any) {
            if (error instanceof AppException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }   
    }

}