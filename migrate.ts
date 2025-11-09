import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./api/database/connection.js";

async function run() {
    console.log("🚀 Aplicando migrações...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrações aplicadas com sucesso!");
    process.exit(0);
}

run().catch(err => {
    console.error("❌ Erro na migração:", err);
    process.exit(1);
});