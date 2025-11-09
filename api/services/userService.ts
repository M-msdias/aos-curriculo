import { db } from  "../database/connection.js";
import { usersTable, skillsTable, experience } from "../database/schema.js"
import { desc, eq } from "drizzle-orm";
import { AppException } from "../exceptions/appException.js";

export const userService = {
    getAllUsers: async () => {
    try {
        const users = await db.query.usersTable.findMany({
        with: {
            skills: {
                orderBy: [desc(usersTable.created_at)],
            },
            experiences: {
                orderBy: [desc(usersTable.created_at)],
            },
        },
        });

        return users;
    } catch (error: any) {
        throw new Error(`Erro: ${error.message}`);
    }
    },

    getUserById: async (id: number) => {
        try {
            const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, id),
            with: {
                skills: {
                orderBy: [desc(skillsTable.created_at)],
                },
            },
            });

            if (!user) {
                throw new AppException(`User with id ${id} not found.`);
            }
            
            return user;
        } catch (error: Error | any) {
            throw new Error(`Could not fetch user with id ${id}: ${error.message}`);
        }
    },

    createNewUser: async (
        fullName: string, 
        birthDate: string,
        description: string,
        address: string,
    ) => {
        try {
            if (!fullName || !birthDate || !description || !address) {
                let emptyFields = [];
                if (!fullName) emptyFields.push("fullName");
                if (!birthDate) emptyFields.push("birthDate");
                if (!description) emptyFields.push("description");
                if (!address) emptyFields.push("address");

                throw new AppException(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const userCreated = await db.insert(usersTable).values({
                full_name: fullName,
                birth_date: birthDate,
                description: description,
                address,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return userCreated;
        } catch (error: Error | any) {
            throw new Error(`Could not create new user: ${error.message}`);
        }
    },

    updateUserById: async (
        id: number,
        fullName: string,
        birthDate: string,
        description: string,
        address: string,
    ) => {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

        if (user.length === 0) {
            throw new AppException(`User with id ${id} not found.`);
        }

        if (!fullName || !birthDate || !description || !address) {
            let emptyFields = [];
            if (!fullName) emptyFields.push("fullName");
            if (!birthDate) emptyFields.push("birthDate");
            if (!description) emptyFields.push("description");
            if (!address) emptyFields.push("address");

            throw new AppException(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
        }
        
        try {
            await db.update(usersTable).set({
                full_name: fullName,
                birth_date: birthDate,
                description: description,
                address,
                updated_at: new Date(),
            }).where(eq(usersTable.id, id));

            const updatedUser = await db.select().from(usersTable).where(eq(usersTable.id, id));

            return updatedUser;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not update user with id ${id}: ${error.message}`);
        }
    },

    deleteUserById: async (id: number) => {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

        if (user.length === 0) {
            throw new AppException(`User with id ${id} not found.`);
        }

        try {
            await db.delete(usersTable).where(eq(usersTable.id, id));
            return;
        } catch (error: Error | any) {
            if (error instanceof AppException) throw error;
            throw new Error(`Could not delete user with id ${id}: ${error.message}`);
        }
    }
}