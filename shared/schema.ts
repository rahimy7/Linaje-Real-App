import { relations } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Products schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productId: varchar("product_id", { length: 10 }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  sales: integer("sales").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  productId: true,
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  sales: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Orders schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 10 }).notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(),
  total: text("total").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  orderNumber: true,
  userId: true,
  status: true,
  total: true,
  date: true,
});



export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect & {
  customer: {
    name: string;
    avatarUrl: string;
  };
};

// ── Programas (Cursos descargables, coherente con app móvil) ───────────────────
export const programas = pgTable("programas", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  icono: varchar("icono", { length: 10 }).default("📖"),
  imagenUrl: text("imagen_url"),
  color: varchar("color", { length: 20 }).default("#3478F6"),
  categoria: varchar("categoria", { length: 80 }).default("formacion-cristiana"),
  version: varchar("version", { length: 20 }).default("1.0.0"),
  totalDias: integer("total_dias").default(21),
  duracion: varchar("duracion", { length: 50 }),
  nivel: varchar("nivel", { length: 30 }).default("Básico"),
  publicado: boolean("publicado").default(false),
  creadoEn: timestamp("creado_en").defaultNow(),
  actualizadoEn: timestamp("actualizado_en").defaultNow(),
});

export const insertProgramaSchema = createInsertSchema(programas).pick({
  slug: true,
  nombre: true,
  descripcion: true,
  icono: true,
  imagenUrl: true,
  color: true,
  categoria: true,
  version: true,
  totalDias: true,
  duracion: true,
  nivel: true,
  publicado: true,
});

export type InsertPrograma = z.infer<typeof insertProgramaSchema>;
export type Programa = typeof programas.$inferSelect;

// ── Días de un programa ────────────────────────────────────────────────────────
export const diasPrograma = pgTable("dias_programa", {
  id: serial("id").primaryKey(),
  programaId: integer("programa_id").notNull().references(() => programas.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  versiculoRef: varchar("versiculo_ref", { length: 100 }),
  versiculoTexto: text("versiculo_texto"),
  reflexion: text("reflexion"),
  actividadTitulo: varchar("actividad_titulo", { length: 200 }),
  actividadDescripcion: text("actividad_descripcion"),
  audioUrl: text("audio_url"),
  videoUrl: text("video_url"),
  ayunoDescripcion: text("ayuno_descripcion"),
  lecturas: text("lecturas").array(),
  creadoEn: timestamp("creado_en").defaultNow(),
});

export const insertDiaProgramaSchema = createInsertSchema(diasPrograma).pick({
  programaId: true,
  numero: true,
  titulo: true,
  descripcion: true,
  versiculoRef: true,
  versiculoTexto: true,
  reflexion: true,
  actividadTitulo: true,
  actividadDescripcion: true,
  audioUrl: true,
  videoUrl: true,
  ayunoDescripcion: true,
  lecturas: true,
});

export type InsertDiaPrograma = z.infer<typeof insertDiaProgramaSchema>;
export type DiaPrograma = typeof diasPrograma.$inferSelect;

// ── Activities schema ─────────────────────────────────────────────────────────
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  timeAgo: text("time_ago").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  message: true,
  timeAgo: true,
});

// Agregue estas tablas al archivo shared/schema.ts existente

// Professional Areas schema
export const professionalAreas = pgTable("professional_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});



export const insertProfessionalAreaSchema = createInsertSchema(professionalAreas).pick({
  name: true,
  description: true,
});

export type InsertProfessionalArea = z.infer<typeof insertProfessionalAreaSchema>;
export type ProfessionalArea = typeof professionalAreas.$inferSelect;

// User Profiles schema
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  professionalAreaId: integer("professional_area_id").references(() => professionalAreas.id),
  experience: text("experience"),
  skills: text("skills").array(),
  education: text("education"),
  summary: text("summary"),
  expectedSalary: text("expected_salary"),
  availableForWork: boolean("available_for_work").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  fullName: true,
  email: true,
  phone: true,
  professionalAreaId: true,
  experience: true,
  skills: true,
  education: true,
  summary: true,
  expectedSalary: true,
  availableForWork: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Jobs schema
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  benefits: text("benefits").array(),
  professionalAreaId: integer("professional_area_id").references(() => professionalAreas.id),
  location: text("location"),
  jobType: text("job_type").notNull(), // full-time, part-time, contract, internship
  experienceLevel: text("experience_level").notNull(), // entry, mid, senior
  salaryRange: text("salary_range"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  applicationDeadline: timestamp("application_deadline"),
  isActive: boolean("is_active").default(true),
  publishedBy: integer("published_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  company: true,
  description: true,
  requirements: true,
  benefits: true,
  professionalAreaId: true,
  location: true,
  jobType: true,
  experienceLevel: true,
  salaryRange: true,
  contactEmail: true,
  contactPhone: true,
  applicationDeadline: true,
  isActive: true,
  publishedBy: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Job Applications schema
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  userProfileId: integer("user_profile_id").notNull().references(() => userProfiles.id),
  coverLetter: text("cover_letter").notNull(),
  status: text("status").notNull().default("pending"), // pending, reviewed, accepted, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"), // Admin notes
  appliedAt: timestamp("applied_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon").notNull(),
  color: varchar("color").notNull(),
  slug: varchar("slug").notNull().unique(),
  position: integer("position").notNull().default(0),
  schedule: varchar("schedule"),
  maxParticipants: integer("max_participants"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subforums within categories
export const subforums = pgTable("subforums", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  name: varchar("name").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum threads/topics
export const threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  subforumId: integer("subforum_id").references(() => subforums.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  isSticky: boolean("is_sticky").notNull().default(false),
  isLocked: boolean("is_locked").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  replyCount: integer("reply_count").notNull().default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyBy: varchar("last_reply_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts/replies within threads
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull().references(() => threads.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  parentId: integer("parent_id").references(() => posts.id), // for nested replies
  isModerated: boolean("is_moderated").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
});
// User bookmarks/saved threads
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  threadId: integer("thread_id").notNull().references(() => threads.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User subscriptions to categories/forums
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),
  subforumId: integer("subforum_id").references(() => subforums.id),
  threadId: integer("thread_id").references(() => threads.id),
  notificationLevel: varchar("notification_level").notNull().default("all"), // all, mentions, none
  createdAt: timestamp("created_at").defaultNow(),
});

// Private messages between users
export const privateMessages = pgTable("private_messages", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User reactions/likes to posts
export const reactions = pgTable("reactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: integer("post_id").references(() => posts.id),
  threadId: integer("thread_id").references(() => threads.id),
  type: varchar("type").notNull().default("like"), // like, heart, support, thanks
  createdAt: timestamp("created_at").defaultNow(),
});

// User notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // reply, mention, message, subscription
  title: varchar("title").notNull(),
  content: text("content"),
  relatedId: integer("related_id"), // thread_id, post_id, message_id
  relatedType: varchar("related_type"), // thread, post, message
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).pick({
  jobId: true,
  userProfileId: true,
  coverLetter: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  notes: true,
});

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// ── Peticiones de Oración ──────────────────────────────────────────────────────
export const peticionesOracion = pgTable("peticiones_oracion", {
  id: serial("id").primaryKey(),
  peticion: text("peticion").notNull(),
  autor: text("autor").notNull(),
  estado: varchar("estado", { length: 30 }).notNull().default("pendiente"), // pendiente | en-oracion | respondida
  contadorOraciones: integer("contador_oraciones").notNull().default(0),
  privada: boolean("privada").notNull().default(false),
  categoria: varchar("categoria", { length: 80 }).notNull().default("general"),
  creadoEn: timestamp("creado_en").defaultNow(),
  actualizadoEn: timestamp("actualizado_en").defaultNow(),
});

export const insertPeticionOracionSchema = createInsertSchema(peticionesOracion).pick({
  peticion: true,
  autor: true,
  estado: true,
  contadorOraciones: true,
  privada: true,
  categoria: true,
});

export type InsertPeticionOracion = z.infer<typeof insertPeticionOracionSchema>;
export type PeticionOracion = typeof peticionesOracion.$inferSelect;


// Relations
export const userRelations = relations(users, ({ many }) => ({
  threads: many(threads),
  posts: many(posts),
  bookmarks: many(bookmarks),
  subscriptions: many(subscriptions),
  sentMessages: many(privateMessages, { relationName: "sentMessages" }),
  receivedMessages: many(privateMessages, { relationName: "receivedMessages" }),
  reactions: many(reactions),
  notifications: many(notifications),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  subforums: many(subforums),
  threads: many(threads),
}));

export const subforumRelations = relations(subforums, ({ one, many }) => ({
  category: one(categories, {
    fields: [subforums.categoryId],
    references: [categories.id],
  }),
  threads: many(threads),
}));

export const threadRelations = relations(threads, ({ one, many }) => ({
  category: one(categories, {
    fields: [threads.categoryId],
    references: [categories.id],
  }),
  subforum: one(subforums, {
    fields: [threads.subforumId],
    references: [subforums.id],
  }),
  author: one(users, {
    fields: [threads.authorId],
    references: [users.id],
  }),
  lastReplyUser: one(users, {
    fields: [threads.lastReplyBy],
    references: [users.id],
  }),
  posts: many(posts),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
  thread: one(threads, {
    fields: [posts.threadId],
    references: [threads.id],
  }),
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  parent: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "postParent"
  }),
  replies: many(posts, { relationName: "postParent" }),
  reactions: many(reactions),
}));

// Bookmark relations
export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  thread: one(threads, {
    fields: [bookmarks.threadId],
    references: [threads.id],
  }),
}));

// Subscription relations
export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [subscriptions.categoryId],
    references: [categories.id],
  }),
  subforum: one(subforums, {
    fields: [subscriptions.subforumId],
    references: [subforums.id],
  }),
  thread: one(threads, {
    fields: [subscriptions.threadId],
    references: [threads.id],
  }),
}));

// Private message relations
export const privateMessageRelations = relations(privateMessages, ({ one }) => ({
  fromUser: one(users, {
    fields: [privateMessages.fromUserId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [privateMessages.toUserId],
    references: [users.id],
  }),
}));

// Reaction relations
export const reactionRelations = relations(reactions, ({ one }) => ({
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [reactions.postId],
    references: [posts.id],
  }),
  thread: one(threads, {
    fields: [reactions.threadId],
    references: [threads.id],
  }),
}));

// Notification relations
export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export type InsertCategory = typeof categories.$inferInsert;
export type Category = typeof categories.$inferSelect;

export type InsertSubforum = typeof subforums.$inferInsert;
export type Subforum = typeof subforums.$inferSelect;

export type InsertThread = typeof threads.$inferInsert;
export type Thread = typeof threads.$inferSelect;

export type InsertPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;



export type InsertBookmark = typeof bookmarks.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;

export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertPrivateMessage = typeof privateMessages.$inferInsert;
export type PrivateMessage = typeof privateMessages.$inferSelect;

export type InsertReaction = typeof reactions.$inferInsert;
export type Reaction = typeof reactions.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;



// Dashboard stats type (not stored in database, just for API response)
export type DashboardStats = {
  usersTotal: string;
  usersChange: number;
  ordersTotal: string;
  ordersChange: number;
  revenue: string;
  revenueChange: number;
  productsTotal: string;
  productsChange: number;
};

// Programa relations
export const programaRelations = relations(programas, ({ many }) => ({
  dias: many(diasPrograma),
}));

export const diaProgramaRelations = relations(diasPrograma, ({ one }) => ({
  programa: one(programas, {
    fields: [diasPrograma.programaId],
    references: [programas.id],
  }),
}));
