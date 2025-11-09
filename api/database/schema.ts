import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("user", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  full_name: varchar("full_name").notNull(),
  birth_date: date("birth_date").notNull(),
  description: varchar("short_description", { length: 500 }).notNull(),
  address: varchar("address").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const skillsTable = pgTable("skills", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const experience = pgTable("experience", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  skills: many(skillsTable),
  experiences: many(experience),
}));

export const skillsRelations = relations(skillsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [skillsTable.user_id],
    references: [usersTable.id],
  }),
}));

const experienceRelations = relations(experience, ({ one }) => ({
  user: one(usersTable, {
    fields: [experience.user_id],
    references: [usersTable.id],
  }),
}));

export const schema = {
  usersTable,
  skillsTable,
  experience,
  userRelations,
  skillsRelations,
  experienceRelations
};