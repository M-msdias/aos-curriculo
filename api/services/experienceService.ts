import { db } from "../database/connection.js"
import { experience } from "../database/schema.js"
import { eq } from "drizzle-orm";
import { AppException } from "../exceptions/appException.js";

export const experiencesService = {
    getAllExperience: async () => {
        try {
            const experiences = await db.select().from(experience);
            return experiences;

        } catch (error: Error | any) {
            throw new Error(`Could not fetch experiences from database: ${error.message}`);
        }
    },

    getExperienceById: async (id: number) => {
        try {
            const result = await db.select().from(experience).where(eq(experience.id, id));

            if (result.length === 0) {
                throw new AppException(`Skill with id ${id} not found.`);
            }
            
            return result;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not fetch skill with id ${id}: ${error.message}`);
        }
    },

    createNewExperience: async (
        userId: number, 
        content: string,
        start: string,
        end: string
    ) => {
        try {
            if (!userId || !content) {
                let emptyFields = [];
                if (!userId) emptyFields.push("userId");
                if (!content) emptyFields.push("content");

                throw new AppException(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const skillCreated = await db.insert(experience).values({
                user_id: userId,
                content: content,
                start: start,
                end: end,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return skillCreated;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not create new experience: ${error.message}`);
        }
    },

    updateExperienceById: async (
        id: number,
        userId: number, 
        content: string,
        start: string,
        end: string,
    ) => {
        const skill = await db.select().from(experience).where(eq(experience.id, id));

        if (skill.length === 0) {
            throw new AppException(`experience with id ${id} not found.`);
        }

        try {
            await db.update(experience).set({
                user_id: userId,
                content: content,
                start: start,
                end: end,
                updated_at: new Date(),
            }).where(eq(experience.id, id));

            const skillUpdated = await db.select().from(experience).where(eq(experience.id, id));

            return skillUpdated;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not update experience with id ${id}: ${error.message}`);
        }
    },

    deleteExperienceById: async (id: number) => {
        const skill = await db.select().from(experience).where(eq(experience.id, id));

        if (skill.length === 0) {
            throw new AppException(`experience with id ${id} not found.`);
        }

        try {
            await db.delete(experience).where(eq(experience.id, id));
            return;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not delete experience with id ${id}: ${error.message}`);
        }
    }
}