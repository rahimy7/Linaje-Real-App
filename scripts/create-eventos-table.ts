import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS eventos (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      fecha TIMESTAMP NOT NULL,
      hora VARCHAR(30) NOT NULL,
      lugar TEXT,
      tipo VARCHAR(30) NOT NULL DEFAULT 'culto',
      image_url TEXT,
      publicado BOOLEAN DEFAULT true,
      creado_en TIMESTAMP DEFAULT NOW(),
      actualizado_en TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("✓ Table 'eventos' created successfully");
  await sql.end();
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
