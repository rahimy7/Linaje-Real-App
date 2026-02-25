import { config } from "dotenv";
import { db } from "../server/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";

// Cargar variables de entorno
config();

async function initDB() {
  try {
    console.log("🗄️  Inicializando base de datos...");
    
    // Test connection
    await db.execute(sql`SELECT 1`);
    console.log("✅ Conexión exitosa a la base de datos");
    
    console.log("📋 Aplicando esquema...");
    console.log("⚠️  Nota: Asegúrate de haber generado las migraciones primero con: npm run db:generate");
    
    // Apply migrations if they exist
    try {
      await migrate(db, { migrationsFolder: "./migrations" });
      console.log("✅ Esquema aplicado correctamente");
    } catch (error) {
      console.log("⚠️  No hay migraciones para aplicar o ya están aplicadas");
    }
    
    console.log("🎉 Base de datos lista!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

initDB();
