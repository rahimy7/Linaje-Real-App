CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"time_ago" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"thread_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"icon" varchar NOT NULL,
	"color" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"schedule" varchar,
	"max_participants" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "dias_programa" (
	"id" serial PRIMARY KEY NOT NULL,
	"programa_id" integer NOT NULL,
	"numero" integer NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"versiculo_ref" varchar(100),
	"versiculo_texto" text,
	"reflexion" text,
	"actividad_titulo" varchar(200),
	"actividad_descripcion" text,
	"audio_url" text,
	"video_url" text,
	"ayuno_descripcion" text,
	"lecturas" text[],
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"fecha" timestamp NOT NULL,
	"hora" varchar(30) NOT NULL,
	"lugar" text,
	"tipo" varchar(30) DEFAULT 'culto' NOT NULL,
	"image_url" text,
	"publicado" boolean DEFAULT true,
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer,
	"user_profile_id" integer NOT NULL,
	"cover_letter" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"notes" text,
	"applied_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text[],
	"benefits" text[],
	"professional_area_id" integer,
	"location" text,
	"job_type" text NOT NULL,
	"experience_level" text NOT NULL,
	"salary_range" text,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"application_deadline" timestamp,
	"is_active" boolean DEFAULT true,
	"published_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "miembros" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"iglesia" text DEFAULT 'Linaje Real' NOT NULL,
	"estado" varchar(30) DEFAULT 'activo' NOT NULL,
	"fecha_registro" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text,
	"related_id" integer,
	"related_type" varchar,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(10) NOT NULL,
	"user_id" integer NOT NULL,
	"status" text NOT NULL,
	"total" text NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "peticiones_oracion" (
	"id" serial PRIMARY KEY NOT NULL,
	"peticion" text NOT NULL,
	"autor" text NOT NULL,
	"estado" varchar(30) DEFAULT 'pendiente' NOT NULL,
	"contador_oraciones" integer DEFAULT 0 NOT NULL,
	"privada" boolean DEFAULT false NOT NULL,
	"categoria" varchar(80) DEFAULT 'general' NOT NULL,
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"thread_id" integer NOT NULL,
	"author_id" varchar NOT NULL,
	"content" text NOT NULL,
	"parent_id" integer,
	"is_moderated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "private_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_user_id" varchar NOT NULL,
	"to_user_id" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" varchar(10) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" text NOT NULL,
	"category" text NOT NULL,
	"image_url" text,
	"sales" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "professional_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "programas" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text,
	"icono" varchar(10) DEFAULT '📖',
	"imagen_url" text,
	"color" varchar(20) DEFAULT '#3478F6',
	"categoria" varchar(80) DEFAULT 'formacion-cristiana',
	"version" varchar(20) DEFAULT '1.0.0',
	"total_dias" integer DEFAULT 21,
	"duracion" varchar(50),
	"nivel" varchar(30) DEFAULT 'Básico',
	"publicado" boolean DEFAULT false,
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now(),
	CONSTRAINT "programas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"post_id" integer,
	"thread_id" integer,
	"type" varchar DEFAULT 'like' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subforums" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"category_id" integer,
	"subforum_id" integer,
	"thread_id" integer,
	"notification_level" varchar DEFAULT 'all' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"subforum_id" integer,
	"author_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"is_sticky" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"last_reply_at" timestamp,
	"last_reply_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"professional_area_id" integer,
	"experience" text,
	"skills" text[],
	"education" text,
	"summary" text,
	"expected_salary" text,
	"available_for_work" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dias_programa" ADD CONSTRAINT "dias_programa_programa_id_programas_id_fk" FOREIGN KEY ("programa_id") REFERENCES "public"."programas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_professional_area_id_professional_areas_id_fk" FOREIGN KEY ("professional_area_id") REFERENCES "public"."professional_areas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_published_by_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subforums" ADD CONSTRAINT "subforums_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subforum_id_subforums_id_fk" FOREIGN KEY ("subforum_id") REFERENCES "public"."subforums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_subforum_id_subforums_id_fk" FOREIGN KEY ("subforum_id") REFERENCES "public"."subforums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_last_reply_by_users_id_fk" FOREIGN KEY ("last_reply_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_professional_area_id_professional_areas_id_fk" FOREIGN KEY ("professional_area_id") REFERENCES "public"."professional_areas"("id") ON DELETE no action ON UPDATE no action;