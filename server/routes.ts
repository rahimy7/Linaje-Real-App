import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============= AUTH ROUTES (para app móvil) =============

  // Login: verifica credenciales, devuelve usuario sin contraseña
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      const { password: _pw, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    } catch (error) {
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  // Register: crea nuevo usuario
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
      }
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ error: "El usuario ya existe" });
      }
      const newUser = await storage.createUser({ username, password, email, role: "user" });
      const { password: _pw, ...safeUser } = newUser;
      res.status(201).json({ success: true, user: safeUser });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  // API Routes
  
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });
  
  // Recent orders
  app.get("/api/orders/recent", async (req, res) => {
    const orders = await storage.getRecentOrders();
    res.json(orders);
  });
  
  // Top selling products
  app.get("/api/products/top-selling", async (req, res) => {
    const products = await storage.getTopSellingProducts();
    res.json(products);
  });
  
  // Recent activities
  app.get("/api/activities/recent", async (req, res) => {
    const activities = await storage.getRecentActivities();
    res.json(activities);
  });
  
  // All orders
  app.get("/api/orders", async (req, res) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });
  
  // All products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });
  
  // All users
  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });


app.get("/api/professional-areas", async (req, res) => {
  try {
    const areas = await storage.getProfessionalAreas();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch professional areas" });
  }
});

app.post("/api/professional-areas", async (req, res) => {
  try {
    const area = await storage.createProfessionalArea(req.body);
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: "Failed to create professional area" });
  }
});

// Jobs (Public routes)
app.get("/api/jobs", async (req, res) => {
  try {
    const { areaId } = req.query;
    const jobs = await storage.getJobs({ 
      professionalAreaId: areaId ? parseInt(areaId as string) : undefined,
      isActive: true 
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const job = await storage.createJob(req.body);
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to create job" });
  }
});

// User Profiles (Public routes)
app.get("/api/user-profiles", async (req, res) => {
  try {
    const { areaId } = req.query;
    const profiles = await storage.getUserProfiles({ 
      professionalAreaId: areaId ? parseInt(areaId as string) : undefined 
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profiles" });
  }
});

app.post("/api/user-profiles", async (req, res) => {
  try {
    const profile = await storage.createUserProfile(req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user profile" });
  }
});

// Job Applications (Public routes)
app.get("/api/job-applications", async (req, res) => {
  try {
    const applications = await storage.getJobApplications();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
});

app.post("/api/job-applications", async (req, res) => {
  try {
    const application = await storage.createJobApplication(req.body);
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to create job application" });
  }
});

// ============= ADMIN ROUTES =============

// Admin - Job Applications Management
app.get("/api/admin/job-applications", async (req, res) => {
  try {
    const applications = await storage.getJobApplicationsWithDetails();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

app.post("/api/admin/job-applications/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const application = await storage.reviewJobApplication(
      parseInt(id), 
      status, 
      notes,
      1 // reviewedBy userId - should come from auth
    );
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to review application" });
  }
});

// Admin - Jobs Management
app.get("/api/admin/jobs", async (req, res) => {
  try {
    const jobs = await storage.getJobsWithStats();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin jobs" });
  }
});

app.post("/api/admin/jobs/:id/toggle-status", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await storage.toggleJobStatus(parseInt(id));
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle job status" });
  }
});

app.delete("/api/admin/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteJob(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// Admin - User Profiles
app.get("/api/admin/user-profiles", async (req, res) => {
  try {
    const profiles = await storage.getUserProfilesWithStats();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profiles" });
  }
});

// Admin - Job Statistics
app.get("/api/admin/job-stats", async (req, res) => {
  try {
    const stats = await storage.getJobSystemStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job stats" });
  }
});

// ============= FORUM ROUTES =============

// Categories
app.get("/api/forum/categories", async (req, res) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/forum/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await storage.getCategory(parseInt(id));
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

app.post("/api/forum/categories", async (req, res) => {
  try {
    const category = await storage.createCategory(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.put("/api/forum/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await storage.updateCategory(parseInt(id), req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Subforums
app.get("/api/forum/subforums", async (req, res) => {
  try {
    const { categoryId } = req.query;
    const subforums = await storage.getSubforums(
      categoryId ? parseInt(categoryId as string) : undefined
    );
    res.json(subforums);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subforums" });
  }
});

app.post("/api/forum/subforums", async (req, res) => {
  try {
    const subforum = await storage.createSubforum(req.body);
    res.json(subforum);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subforum" });
  }
});

// Threads
app.get("/api/forum/threads", async (req, res) => {
  try {
    const { categoryId, subforumId, authorId } = req.query;
    const threads = await storage.getThreads({
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      subforumId: subforumId ? parseInt(subforumId as string) : undefined,
      authorId: authorId as string | undefined
    });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

app.get("/api/forum/threads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await storage.getThread(parseInt(id));
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    
    // Increment view count
    await storage.incrementThreadViews(parseInt(id));
    
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

app.post("/api/forum/threads", async (req, res) => {
  try {
    // TODO: Get authorId from authenticated session
    const threadData = {
      ...req.body,
      authorId: req.body.authorId || "1" // Default for now
    };
    const thread = await storage.createThread(threadData);
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: "Failed to create thread" });
  }
});

app.put("/api/forum/threads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await storage.updateThread(parseInt(id), req.body);
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: "Failed to update thread" });
  }
});

app.delete("/api/forum/threads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteThread(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// Posts
app.get("/api/forum/threads/:threadId/posts", async (req, res) => {
  try {
    const { threadId } = req.params;
    const posts = await storage.getPosts(parseInt(threadId));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/forum/posts", async (req, res) => {
  try {
    // TODO: Get authorId from authenticated session
    const postData = {
      ...req.body,
      authorId: req.body.authorId || "1" // Default for now
    };
    const post = await storage.createPost(postData);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.put("/api/forum/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await storage.updatePost(parseInt(id), req.body);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

app.delete("/api/forum/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deletePost(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Reactions
app.get("/api/forum/reactions", async (req, res) => {
  try {
    const { postId, threadId } = req.query;
    const reactions = await storage.getReactions({
      postId: postId ? parseInt(postId as string) : undefined,
      threadId: threadId ? parseInt(threadId as string) : undefined
    });
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reactions" });
  }
});

app.post("/api/forum/reactions", async (req, res) => {
  try {
    // TODO: Get userId from authenticated session
    const reactionData = {
      ...req.body,
      userId: req.body.userId || "1" // Default for now
    };
    const reaction = await storage.createReaction(reactionData);
    res.json(reaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create reaction" });
  }
});

app.delete("/api/forum/reactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteReaction(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reaction" });
  }
});

// Bookmarks
app.get("/api/forum/bookmarks", async (req, res) => {
  try {
    // TODO: Get userId from authenticated session
    const userId = (req.query.userId as string) || "1";
    const bookmarks = await storage.getUserBookmarks(userId);
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

app.post("/api/forum/bookmarks", async (req, res) => {
  try {
    // TODO: Get userId from authenticated session
    const bookmarkData = {
      ...req.body,
      userId: req.body.userId || "1" // Default for now
    };
    const bookmark = await storage.createBookmark(bookmarkData);
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: "Failed to create bookmark" });
  }
});

app.delete("/api/forum/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteBookmark(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
});

// Subscriptions
app.get("/api/forum/subscriptions", async (req, res) => {
  try {
    // TODO: Get userId from authenticated session
    const userId = (req.query.userId as string) || "1";
    const subscriptions = await storage.getUserSubscriptions(userId);
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

app.post("/api/forum/subscriptions", async (req, res) => {
  try {
    // TODO: Get userId from authenticated session
    const subscriptionData = {
      ...req.body,
      userId: req.body.userId || "1" // Default for now
    };
    const subscription = await storage.createSubscription(subscriptionData);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

app.delete("/api/forum/subscriptions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteSubscription(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subscription" });
  }
});

// Private Messages
app.get("/api/forum/messages", async (req, res) => {
  try {
    // TODO: Get userId from authenticated session
    const userId = (req.query.userId as string) || "1";
    const messages = await storage.getUserMessages(userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/forum/messages", async (req, res) => {
  try {
    // TODO: Get fromUserId from authenticated session
    const messageData = {
      ...req.body,
      fromUserId: req.body.fromUserId || "1" // Default for now
    };
    const message = await storage.createPrivateMessage(messageData);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
});

app.put("/api/forum/messages/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await storage.markMessageAsRead(parseInt(id));
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

// Notifications
app.get("/api/forum/notifications", async (req, res) => {
  try {
    // TODO: Get userId from authenticated session
    const userId = (req.query.userId as string) || "1";
    const notifications = await storage.getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.post("/api/forum/notifications", async (req, res) => {
  try {
    const notification = await storage.createNotification(req.body);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

app.put("/api/forum/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await storage.markNotificationAsRead(parseInt(id));
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

app.put("/api/forum/notifications/read-all", async (req, res) => {
  try {
    const userId = (req.body.userId as string) || "1";
    await storage.markAllNotificationsAsRead(userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
});

// ── Programas (Cursos app móvil) ──────────────────────────────────────────────

app.get("/api/programas", async (req, res) => {
  try {
    const allProgramas = await storage.getProgramas();
    // Debug: log cantidad de programas
    //console.log(`[API /programas] Total en BD: ${allProgramas.length}, publicados: ${allProgramas.filter(p => p.publicado).length}`);
    
    // Solo devolver programas publicados a la app móvil (a menos que se pida todos)
    const includeAll = req.query.all === 'true';
    const programas = includeAll ? allProgramas : allProgramas.filter(p => p.publicado);
    
    if (programas.length === 0 && allProgramas.length > 0) {
      console.log('[API /programas] AVISO: Hay programas pero ninguno está publicado. IDs no publicados:', 
        allProgramas.filter(p => !p.publicado).map(p => ({ id: p.id, nombre: p.nombre })));
    }
    
    res.json(programas);
  } catch (error) {
    console.error('[API /programas] Error:', error);
    res.status(500).json({ error: "Error al obtener programas" });
  }
});

app.get("/api/programas/:id", async (req, res) => {
  try {
    const programa = await storage.getPrograma(parseInt(req.params.id));
    if (!programa) return res.status(404).json({ error: "Programa no encontrado" });
    res.json(programa);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener programa" });
  }
});

app.post("/api/programas", async (req, res) => {
  try {
    const programa = await storage.createPrograma(req.body);
    res.status(201).json(programa);
  } catch (error) {
    res.status(500).json({ error: "Error al crear programa" });
  }
});

app.put("/api/programas/:id", async (req, res) => {
  try {
    const programa = await storage.updatePrograma(parseInt(req.params.id), req.body);
    res.json(programa);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar programa" });
  }
});

app.delete("/api/programas/:id", async (req, res) => {
  try {
    await storage.deletePrograma(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar programa" });
  }
});

app.patch("/api/programas/:id/toggle-publicado", async (req, res) => {
  try {
    const programa = await storage.toggleProgramaPublicado(parseInt(req.params.id));
    res.json(programa);
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar estado del programa" });
  }
});

// ── Días de programa ──────────────────────────────────────────────────────────

app.get("/api/programas/:programaId/dias", async (req, res) => {
  try {
    const dias = await storage.getDiasPrograma(parseInt(req.params.programaId));
    
    // DEBUG: Ver formato de campos
   /*  if (dias.length > 0) {
      const primerDia = dias[0];
      console.log('╔═══════════════════════════════════════════════════════════');
      console.log('║ DEBUG Server: Días obtenidos de la BD');
      console.log('╠═══════════════════════════════════════════════════════════');
      console.log('║ Total días:', dias.length);
      console.log('║ Objeto completo primer día:');
      console.log(JSON.stringify(primerDia, null, 2));
      console.log('║');
      console.log('║ Campos del versículo:');
      console.log('║   - versiculoRef:', primerDia.versiculoRef);
      console.log('║   - versiculoTexto:', primerDia.versiculoTexto);
      console.log('║   - versiculo_ref:', (primerDia as any).versiculo_ref);
      console.log('║   - versiculo_texto:', (primerDia as any).versiculo_texto);
      console.log('╚═══════════════════════════════════════════════════════════');
    } */
    
    res.json(dias);
  } catch (error) {
    console.error('Error en /api/programas/:programaId/dias:', error);
    res.status(500).json({ error: "Error al obtener días" });
  }
});

app.post("/api/programas/:programaId/dias", async (req, res) => {
  try {
    const dia = await storage.createDiaPrograma({
      ...req.body,
      programaId: parseInt(req.params.programaId),
    });
    res.status(201).json(dia);
  } catch (error) {
    res.status(500).json({ error: "Error al crear día" });
  }
});

app.put("/api/dias/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    
    // Validate request body
    const validation = (await import("@shared/schema")).updateDiaProgramaSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Datos inválidos", 
        details: validation.error.issues 
      });
    }
    
    const dia = await storage.updateDiaPrograma(id, validation.data);
    res.json(dia);
  } catch (error: any) {
    console.error("Error actualizando día:", error);
    res.status(500).json({ error: error.message || "Error al actualizar día" });
  }
});

app.delete("/api/dias/:id", async (req, res) => {
  try {
    await storage.deleteDiaPrograma(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar día" });
  }
});

// ── Peticiones de Oración ──────────────────────────────────────────────────────

app.get("/api/oraciones", async (req, res) => {
  try {
    const { estado } = req.query;
    const peticiones = await storage.getPeticionesOracion(estado as string | undefined);
    res.json(peticiones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener peticiones de oración" });
  }
});

app.get("/api/oraciones/:id", async (req, res) => {
  try {
    const peticion = await storage.getPeticionOracion(parseInt(req.params.id));
    if (!peticion) return res.status(404).json({ error: "Petición no encontrada" });
    res.json(peticion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener petición" });
  }
});

app.post("/api/oraciones", async (req, res) => {
  try {
    const peticion = await storage.createPeticionOracion(req.body);
    res.status(201).json(peticion);
  } catch (error) {
    res.status(500).json({ error: "Error al crear petición de oración" });
  }
});

app.put("/api/oraciones/:id", async (req, res) => {
  try {
    const peticion = await storage.updatePeticionOracion(parseInt(req.params.id), req.body);
    res.json(peticion);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar petición" });
  }
});

app.delete("/api/oraciones/:id", async (req, res) => {
  try {
    await storage.deletePeticionOracion(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar petición" });
  }
});

app.post("/api/oraciones/:id/orar", async (req, res) => {
  try {
    const peticion = await storage.incrementarContadorOraciones(parseInt(req.params.id));
    res.json(peticion);
  } catch (error) {
    res.status(500).json({ error: "Error al incrementar contador" });
  }
});

  const httpServer = createServer(app);

  return httpServer;
}
