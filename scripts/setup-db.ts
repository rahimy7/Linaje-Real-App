import { config } from "dotenv";
import postgres from "postgres";

// Cargar variables de entorno desde .env
config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL no está configurado en .env");
  console.error("💡 Asegúrate de:");
  console.error("   1. Tener un archivo .env en la raíz del proyecto");
  console.error("   2. Que DATABASE_URL esté descomentado (sin #)");
  console.error("   3. Que tenga un valor válido de Supabase");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL);

async function setupDatabase() {
  console.log("🗄️  Configurando base de datos en Supabase...");
  
  try {
    // Test connection
    console.log("📡 Probando conexión...");
    await sql`SELECT 1`;
    console.log("✅ Conexión exitosa!\n");

    console.log("📋 Creando tablas...");
    
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'users' creada");

    // Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(10) NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        sales INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'products' creada");

    // Orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(10) NOT NULL,
        user_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        total TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'orders' creada");

    // Activities table
    await sql`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        time_ago TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'activities' creada");

    // Professional Areas table
    await sql`
      CREATE TABLE IF NOT EXISTS professional_areas (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'professional_areas' creada");

    // Jobs table
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT[],
        benefits TEXT[],
        professional_area_id INTEGER REFERENCES professional_areas(id),
        location TEXT,
        job_type TEXT NOT NULL,
        experience_level TEXT NOT NULL,
        salary_range TEXT,
        contact_email TEXT NOT NULL,
        contact_phone TEXT,
        application_deadline TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        published_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'jobs' creada");

    // User Profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        professional_area_id INTEGER REFERENCES professional_areas(id),
        experience TEXT,
        skills TEXT[],
        education TEXT,
        summary TEXT,
        expected_salary TEXT,
        available_for_work BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'user_profiles' creada");

    // Job Applications table
    await sql`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id),
        user_profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
        cover_letter TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TIMESTAMP,
        notes TEXT,
        applied_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'job_applications' creada");

    // Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        description TEXT,
        icon VARCHAR NOT NULL,
        color VARCHAR NOT NULL,
        slug VARCHAR NOT NULL UNIQUE,
        position INTEGER NOT NULL DEFAULT 0,
        schedule VARCHAR,
        max_participants INTEGER,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'categories' creada");

    // Subforums table
    await sql`
      CREATE TABLE IF NOT EXISTS subforums (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        name VARCHAR NOT NULL,
        description TEXT,
        position INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'subforums' creada");

    // Threads table
    await sql`
      CREATE TABLE IF NOT EXISTS threads (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        subforum_id INTEGER REFERENCES subforums(id),
        author_id VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        content TEXT NOT NULL,
        is_sticky BOOLEAN NOT NULL DEFAULT false,
        is_locked BOOLEAN NOT NULL DEFAULT false,
        view_count INTEGER NOT NULL DEFAULT 0,
        reply_count INTEGER NOT NULL DEFAULT 0,
        last_reply_at TIMESTAMP,
        last_reply_by VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'threads' creada");

    // Posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        thread_id INTEGER NOT NULL REFERENCES threads(id),
        author_id VARCHAR NOT NULL,
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES posts(id),
        is_moderated BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'posts' creada");

    // Reactions table
    await sql`
      CREATE TABLE IF NOT EXISTS reactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        post_id INTEGER REFERENCES posts(id),
        thread_id INTEGER REFERENCES threads(id),
        type VARCHAR NOT NULL DEFAULT 'like',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'reactions' creada");

    // Bookmarks table
    await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        thread_id INTEGER NOT NULL REFERENCES threads(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'bookmarks' creada");

    // Subscriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        subforum_id INTEGER REFERENCES subforums(id),
        thread_id INTEGER REFERENCES threads(id),
        notification_level VARCHAR NOT NULL DEFAULT 'all',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'subscriptions' creada");

    // Private Messages table
    await sql`
      CREATE TABLE IF NOT EXISTS private_messages (
        id SERIAL PRIMARY KEY,
        from_user_id VARCHAR NOT NULL,
        to_user_id VARCHAR NOT NULL,
        subject VARCHAR NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'private_messages' creada");

    // Notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        content TEXT,
        related_id INTEGER,
        related_type VARCHAR,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'notifications' creada");

    // Programas (cursos app móvil)
    await sql`
      CREATE TABLE IF NOT EXISTS programas (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        icono VARCHAR(10) DEFAULT '📖',
        imagen_url TEXT,
        color VARCHAR(20) DEFAULT '#3478F6',
        categoria VARCHAR(80) DEFAULT 'formacion-cristiana',
        version VARCHAR(20) DEFAULT '1.0.0',
        total_dias INTEGER DEFAULT 21,
        duracion VARCHAR(50),
        nivel VARCHAR(30) DEFAULT 'Básico',
        publicado BOOLEAN DEFAULT false,
        creado_en TIMESTAMP DEFAULT NOW(),
        actualizado_en TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'programas' creada");

    // Días de programa
    await sql`
      CREATE TABLE IF NOT EXISTS dias_programa (
        id SERIAL PRIMARY KEY,
        programa_id INTEGER NOT NULL REFERENCES programas(id) ON DELETE CASCADE,
        numero INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        versiculo_ref VARCHAR(100),
        versiculo_texto TEXT,
        reflexion TEXT,
        actividad_titulo VARCHAR(200),
        actividad_descripcion TEXT,
        audio_url TEXT,
        video_url TEXT,
        ayuno_descripcion TEXT,
        lecturas TEXT[],
        creado_en TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'dias_programa' creada");

    // Asegurar columna ayuno_descripcion si la tabla ya existía sin ella
    await sql`
      ALTER TABLE dias_programa
        ADD COLUMN IF NOT EXISTS ayuno_descripcion TEXT
    `;
    console.log("✅ Columna 'ayuno_descripcion' asegurada en 'dias_programa'");

    await sql`
      CREATE TABLE IF NOT EXISTS peticiones_oracion (
        id SERIAL PRIMARY KEY,
        peticion TEXT NOT NULL,
        autor TEXT NOT NULL,
        estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
        contador_oraciones INTEGER NOT NULL DEFAULT 0,
        privada BOOLEAN NOT NULL DEFAULT false,
        categoria VARCHAR(80) NOT NULL DEFAULT 'general',
        creado_en TIMESTAMP DEFAULT NOW(),
        actualizado_en TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Tabla 'peticiones_oracion' creada");

    console.log("\n🎉 ¡Base de datos configurada exitosamente!");
    console.log("\n📝 Próximo paso: Ejecuta 'npm run db:seed' para poblar con datos de ejemplo");
    
  } catch (error: any) {
    console.error("\n❌ Error al configurar la base de datos:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupDatabase();
