import { config } from "dotenv";
config();
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function main() {
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS miembros (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      iglesia TEXT NOT NULL DEFAULT 'Linaje Real',
      estado VARCHAR(30) NOT NULL DEFAULT 'activo',
      fecha_registro TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("Table 'miembros' created successfully");
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
