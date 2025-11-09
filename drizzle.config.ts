import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./api/database/schema.ts",
  out: "./drizzle",
});