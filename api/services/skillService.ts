import { db } from "../database/connection.js"
import { skillsTable } from "../database/schema.js"
import { eq } from "drizzle-orm";
import { AppException } from "../exceptions/appException.js";

export const skillService = {
    getAllSkilss: async () => {
        try {
            const skills = await db.select().from(skillsTable);
            return skills;

        } catch (error: Error | any) {
            throw new Error(`Could not fetch skills from database: ${error.message}`);
        }
    },

    getSkillById: async (id: number) => {
        try {
            const skill = await db.select().from(skillsTable).where(eq(skillsTable.id, id));

            if (skill.length === 0) {
                throw new AppException(`Skill with id ${id} not found.`);
            }
            
            return skill;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not fetch skill with id ${id}: ${error.message}`);
        }
    },

    createNewSkill: async (
        userId: number, 
        content: string,
    ) => {
        try {
            if (!userId || !content) {
                let emptyFields = [];
                if (!userId) emptyFields.push("userId");
                if (!content) emptyFields.push("content");

                throw new AppException(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const skillCreated = await db.insert(skillsTable).values({
                user_id: userId,
                content: content,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return skillCreated;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not create new skill: ${error.message}`);
        }
    },

    updateSkillById: async (
        id: number,
        userId: number, 
        content: string,
    ) => {
        const skill = await db.select().from(skillsTable).where(eq(skillsTable.id, id));

        if (skill.length === 0) {
            throw new AppException(`Skill with id ${id} not found.`);
        }

        try {
            await db.update(skillsTable).set({
                user_id: userId,
                content: content,
                updated_at: new Date(),
            }).where(eq(skillsTable.id, id));

            const skillUpdated = await db.select().from(skillsTable).where(eq(skillsTable.id, id));

            return skillUpdated;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not update skill with id ${id}: ${error.message}`);
        }
    },

    deleteSkillById: async (id: number) => {
        const skill = await db.select().from(skillsTable).where(eq(skillsTable.id, id));

        if (skill.length === 0) {
            throw new AppException(`Skill with id ${id} not found.`);
        }

        try {
            await db.delete(skillsTable).where(eq(skillsTable.id, id));
            return;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not delete skill with id ${id}: ${error.message}`);
        }
    }
}