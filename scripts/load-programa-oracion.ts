// Script para cargar el programa de 40 días de oración a la base de datos
// Ejecutar con: npx tsx scripts/load-programa-oracion.ts

const BASE_URL = "http://localhost:5000";
const PROGRAMA_ID = 1; // ID del programa existente "Vida de Oracion"

async function main() {
  // 1. Leer el JSON del programa
  const fs = await import("fs");
  const path = await import("path");
  const { fileURLToPath } = await import("url");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const jsonPath = path.resolve(__dirname, "..", "programa_40_dias_oracion.json");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  console.log("╔═══════════════════════════════════════════════════════════");
  console.log("║ Cargando programa: " + data.programa.nombre);
  console.log("║ Total días: " + data.dias.length);
  console.log("╚═══════════════════════════════════════════════════════════");

  // 2. Actualizar metadata del programa
  console.log("\n📝 Actualizando metadata del programa...");
  const updateRes = await fetch(`${BASE_URL}/api/programas/${PROGRAMA_ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: data.programa.slug,
      nombre: data.programa.nombre,
      descripcion: data.programa.descripcion,
      icono: data.programa.icono,
      color: data.programa.color,
      categoria: data.programa.categoria,
      version: data.programa.version,
      totalDias: data.programa.totalDias,
      duracion: data.programa.duracion,
      nivel: data.programa.nivel,
      publicado: data.programa.publicado,
    }),
  });

  if (!updateRes.ok) {
    console.error("❌ Error al actualizar programa:", await updateRes.text());
    process.exit(1);
  }
  console.log("✅ Programa actualizado correctamente");

  // 3. Obtener y eliminar días existentes
  console.log("\n🗑️  Eliminando días anteriores...");
  const diasExistentes = await fetch(`${BASE_URL}/api/programas/${PROGRAMA_ID}/dias`);
  const diasViejos: any[] = await diasExistentes.json();
  
  let eliminados = 0;
  for (const dia of diasViejos) {
    const delRes = await fetch(`${BASE_URL}/api/dias/${dia.id}`, { method: "DELETE" });
    if (delRes.ok) {
      eliminados++;
    } else {
      console.error(`❌ Error eliminando día ${dia.numero} (id=${dia.id})`);
    }
  }
  console.log(`✅ ${eliminados}/${diasViejos.length} días eliminados`);

  // 4. Insertar los 40 nuevos días
  console.log("\n📥 Insertando nuevos días...");
  let insertados = 0;
  let errores = 0;

  for (const dia of data.dias) {
    const payload = {
      numero: dia.numero,
      titulo: dia.titulo,
      descripcion: dia.descripcion,
      versiculoRef: dia.versiculoRef,
      versiculoTexto: dia.versiculoTexto,
      reflexion: dia.reflexion,
      actividadTitulo: dia.actividadTitulo,
      actividadDescripcion: dia.actividadDescripcion,
      ayunoDescripcion: dia.ayunoDescripcion,
      lecturas: dia.lecturas,
      audioUrl: dia.audioUrl || null,
      videoUrl: dia.videoUrl || null,
    };

    const res = await fetch(`${BASE_URL}/api/programas/${PROGRAMA_ID}/dias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      insertados++;
      process.stdout.write(`  ✅ Día ${dia.numero}: ${dia.titulo}\n`);
    } else {
      errores++;
      const errorText = await res.text();
      console.error(`  ❌ Día ${dia.numero}: ${errorText}`);
    }
  }

  console.log("\n╔═══════════════════════════════════════════════════════════");
  console.log(`║ ✅ Insertados: ${insertados}/40`);
  console.log(`║ ❌ Errores: ${errores}`);
  console.log("╚═══════════════════════════════════════════════════════════");

  // 5. Verificación final
  const verificacion = await fetch(`${BASE_URL}/api/programas/${PROGRAMA_ID}/dias`);
  const diasFinales: any[] = await verificacion.json();
  console.log(`\n🔍 Verificación: ${diasFinales.length} días en la base de datos`);
  
  // Verificar que no hay títulos repetidos
  const titulos = diasFinales.map((d: any) => d.titulo);
  const titulosUnicos = new Set(titulos);
  if (titulosUnicos.size === titulos.length) {
    console.log("✅ Todos los títulos son únicos (sin repeticiones)");
  } else {
    console.log(`⚠️  Hay ${titulos.length - titulosUnicos.size} títulos duplicados`);
  }
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
