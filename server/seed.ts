import { config } from "dotenv";
import { db } from "./db";
import { 
  users, 
  products, 
  orders, 
  activities,
  professionalAreas,
  jobs,
  userProfiles,
  jobApplications,
  categories,
  threads,
  posts
} from "@shared/schema";

// Cargar variables de entorno
config();

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.delete(posts);
    await db.delete(threads);
    await db.delete(categories);
    await db.delete(jobApplications);
    await db.delete(userProfiles);
    await db.delete(jobs);
    await db.delete(professionalAreas);
    await db.delete(activities);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(users);

    // Seed Users
    console.log("👤 Seeding users...");
    const [user1, user2] = await db.insert(users).values([
      {
        username: "juan.perez",
        password: "password123", // In production, this should be hashed
        email: "juan.perez@ejemplo.com",
        role: "admin"
      },
      {
        username: "maria.gonzalez",
        password: "password123",
        email: "maria.gonzalez@ejemplo.com",
        role: "user"
      }
    ]).returning();

    // Seed Products
    console.log("📦 Seeding products...");
    await db.insert(products).values([
      {
        productId: "PRD-001",
        name: "Auriculares Inalámbricos Pro",
        description: "Auriculares inalámbricos de alta calidad con cancelación de ruido",
        price: "$159.99",
        category: "Electrónica",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80",
        sales: 324
      },
      {
        productId: "PRD-002",
        name: "Altavoz Bluetooth Portátil",
        description: "Altavoz portátil con 20 horas de batería",
        price: "$89.99",
        category: "Electrónica",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80",
        sales: 256
      },
      {
        productId: "PRD-003",
        name: "Zapatillas Deportivas Run+",
        description: "Zapatillas para correr de alto rendimiento",
        price: "$129.99",
        category: "Ropa",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80",
        sales: 198
      }
    ]);

    // Seed Activities
    console.log("📊 Seeding activities...");
    await db.insert(activities).values([
      {
        type: "user",
        message: "Nuevo usuario registrado <span class=\"font-medium\">Laura Sánchez</span>",
        timeAgo: "Hace 5 minutos"
      },
      {
        type: "order",
        message: "Nuevo pedido <span class=\"font-medium\">#ORD-0102</span> completado",
        timeAgo: "Hace 27 minutos"
      },
      {
        type: "refund",
        message: "Solicitud de reembolso para el pedido <span class=\"font-medium\">#ORD-0097</span>",
        timeAgo: "Hace 1 hora"
      },
      {
        type: "message",
        message: "Nuevo mensaje de <span class=\"font-medium\">Carlos Rodríguez</span>",
        timeAgo: "Hace 3 horas"
      }
    ]);

    // Seed Professional Areas
    console.log("💼 Seeding professional areas...");
    const [area1, area2, area3, area4, area5] = await db.insert(professionalAreas).values([
      { name: "Tecnología", description: "Desarrollo de software, IT, sistemas" },
      { name: "Marketing", description: "Marketing digital, publicidad, ventas" },
      { name: "Finanzas", description: "Contabilidad, análisis financiero, banca" },
      { name: "Recursos Humanos", description: "Gestión de talento, reclutamiento" },
      { name: "Diseño", description: "Diseño gráfico, UX/UI, creatividad" }
    ]).returning();

    // Seed Jobs
    console.log("💼 Seeding jobs...");
    const [job1, job2, job3] = await db.insert(jobs).values([
      {
        title: "Desarrollador Frontend React",
        company: "TechCorp",
        description: "Buscamos un desarrollador frontend con experiencia en React y TypeScript.",
        requirements: ["React", "TypeScript", "CSS", "Git"],
        benefits: ["Trabajo remoto", "Seguro médico", "Capacitaciones"],
        professionalAreaId: area1.id,
        location: "Santo Domingo, RD",
        jobType: "full-time",
        experienceLevel: "mid",
        salaryRange: "$35,000 - $45,000",
        contactEmail: "reclutamiento@techcorp.com",
        contactPhone: "809-555-0123",
        isActive: true,
        publishedBy: user1.id
      },
      {
        title: "Especialista en Marketing Digital",
        company: "MarketPro",
        description: "Buscamos un especialista en marketing digital para gestionar nuestras campañas.",
        requirements: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
        benefits: ["Horario flexible", "Bonos por rendimiento"],
        professionalAreaId: area2.id,
        location: "Santiago, RD",
        jobType: "full-time",
        experienceLevel: "entry",
        salaryRange: "$25,000 - $32,000",
        contactEmail: "jobs@marketpro.com",
        isActive: true,
        publishedBy: user1.id
      },
      {
        title: "Diseñador UX/UI",
        company: "DesignStudio",
        description: "Únete a nuestro equipo creativo como diseñador UX/UI.",
        requirements: ["Figma", "Adobe XD", "Prototipado", "User Research"],
        benefits: ["Ambiente creativo", "Proyectos internacionales", "Crecimiento profesional"],
        professionalAreaId: area5.id,
        location: "Santo Domingo, RD",
        jobType: "full-time",
        experienceLevel: "senior",
        salaryRange: "$40,000 - $55,000",
        contactEmail: "careers@designstudio.com",
        contactPhone: "809-555-0456",
        isActive: true,
        publishedBy: user1.id
      }
    ]).returning();

    // Seed User Profiles
    console.log("👥 Seeding user profiles...");
    const [profile1, profile2] = await db.insert(userProfiles).values([
      {
        userId: user2.id,
        fullName: "María González",
        email: "maria.gonzalez@ejemplo.com",
        phone: "809-555-1234",
        professionalAreaId: area1.id,
        experience: "3 años de experiencia en desarrollo frontend con React y Vue.js.",
        skills: ["React", "Vue.js", "JavaScript", "TypeScript", "HTML", "CSS", "Git"],
        education: "Ingeniería en Sistemas, PUCMM",
        summary: "Desarrolladora frontend apasionada por crear interfaces de usuario intuitivas.",
        expectedSalary: "$30,000 - $40,000",
        availableForWork: true
      },
      {
        userId: user1.id,
        fullName: "Juan Pérez",
        email: "juan.perez@ejemplo.com",
        phone: "809-555-5678",
        professionalAreaId: area2.id,
        experience: "5 años en marketing digital, especializado en Google Ads y Facebook Ads.",
        skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics", "Marketing Automation"],
        education: "Licenciatura en Marketing, UASD",
        summary: "Especialista en marketing digital con track record comprobado.",
        expectedSalary: "$35,000 - $45,000",
        availableForWork: true
      }
    ]).returning();

    // Seed Job Applications
    console.log("📝 Seeding job applications...");
    await db.insert(jobApplications).values([
      {
        jobId: job1.id,
        userProfileId: profile1.id,
        coverLetter: "Estimado equipo de reclutamiento, estoy muy interesada en la posición de Desarrollador Frontend React.",
        status: "pending"
      },
      {
        jobId: job2.id,
        userProfileId: profile2.id,
        coverLetter: "Hola equipo de MarketPro, soy Juan Pérez y me postulo para la posición de Especialista en Marketing Digital.",
        status: "reviewed",
        reviewedBy: user1.id,
        notes: "Candidato prometedor con buena experiencia."
      }
    ]);

    // Seed Forum Categories
    console.log("💬 Seeding forum categories...");
    const [cat1, cat2, cat3] = await db.insert(categories).values([
      {
        name: "Comunión Diaria",
        description: "Reflexiones y comunión diaria con Dios",
        icon: "BookOpen",
        color: "blue",
        slug: "comunion-diaria",
        position: 1,
        schedule: "Lunes a Viernes, 7:00 AM",
        maxParticipants: 100,
        isActive: true
      },
      {
        name: "Cursos Bíblicos",
        description: "Aprende más sobre la Palabra de Dios",
        icon: "GraduationCap",
        color: "green",
        slug: "cursos-biblicos",
        position: 2,
        isActive: true
      },
      {
        name: "Eventos",
        description: "Próximos eventos y actividades de la iglesia",
        icon: "Calendar",
        color: "purple",
        slug: "eventos",
        position: 3,
        isActive: true
      }
    ]).returning();

    // Seed Forum Threads
    console.log("📝 Seeding forum threads...");
    const [thread1, thread2] = await db.insert(threads).values([
      {
        categoryId: cat1.id,
        authorId: String(user1.id),
        title: "Reflexión del día - La fe que mueve montañas",
        content: "Hoy quiero compartir una reflexión sobre Mateo 17:20...",
        isSticky: true,
        isLocked: false,
        viewCount: 145,
        replyCount: 2
      },
      {
        categoryId: cat2.id,
        authorId: String(user1.id),
        title: "Nuevo curso: Introducción al Antiguo Testamento",
        content: "Estamos iniciando un nuevo curso sobre el Antiguo Testamento...",
        isSticky: false,
        isLocked: false,
        viewCount: 89,
        replyCount: 1
      }
    ]).returning();

    // Seed Forum Posts
    console.log("💬 Seeding forum posts...");
    await db.insert(posts).values([
      {
        threadId: thread1.id,
        authorId: String(user2.id),
        content: "¡Excelente reflexión! Me encanta cómo explicas el poder de la fe.",
        isModerated: false
      },
      {
        threadId: thread1.id,
        authorId: String(user1.id),
        content: "Gracias por tus palabras. La fe es fundamental en nuestra vida cristiana.",
        isModerated: false
      },
      {
        threadId: thread2.id,
        authorId: String(user2.id),
        content: "¿Cuándo inicia el curso y cuál es el horario?",
        isModerated: false
      }
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed().then(() => {
  console.log("🎉 Seed completed!");
  process.exit(0);
});
