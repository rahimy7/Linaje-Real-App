import { 
  users, 
  type User, 
  type InsertUser, 
  Product, 
  Order, 
  Activity,
  DashboardStats,
  JobApplication,
  InsertJob,
  InsertJobApplication,
  InsertProfessionalArea,
  InsertUserProfile,
  Job,
  ProfessionalArea,
  UserProfile,
  Category,
  InsertCategory,
  Subforum,
  InsertSubforum,
  Thread,
  InsertThread,
  Post,
  InsertPost,
  Reaction,
  InsertReaction,
  Bookmark,
  InsertBookmark,
  Subscription,
  InsertSubscription,
  PrivateMessage,
  InsertPrivateMessage,
  Notification,
  InsertNotification,
  programas,
  diasPrograma,
  type Programa,
  type InsertPrograma,
  type DiaPrograma,
  type InsertDiaPrograma,
  type UpdateDiaPrograma,
  peticionesOracion,
  type PeticionOracion,
  type InsertPeticionOracion,
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, sql } from "drizzle-orm";

// ============= INTERFACES AND TYPES =============

export interface JobFilters {
  professionalAreaId?: number;
  isActive?: boolean;
  jobType?: string;
  experienceLevel?: string;
}

export interface UserProfileFilters {
  professionalAreaId?: number;
  availableForWork?: boolean;
}

export interface JobSystemStats {
  totalJobs: number;
  jobsThisMonth: number;
  totalApplications: number;
  applicationsThisWeek: number;
  activeProfiles: number;
  profilesAvailable: number;
  successRate: string;
}

// Interface for all storage operations needed in the app
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Product operations
  getTopSellingProducts(): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  
  // Order operations
  getRecentOrders(): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  
  // Activity operations
  getRecentActivities(): Promise<Activity[]>;
  
  // Dashboard stats
  getDashboardStats(): Promise<DashboardStats>;

  // Professional Areas
  getProfessionalAreas(): Promise<ProfessionalArea[]>;
  createProfessionalArea(area: InsertProfessionalArea): Promise<ProfessionalArea>;

  // Jobs
  getJobs(filters?: JobFilters): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  getJobsWithStats(): Promise<Job[]>;
  toggleJobStatus(jobId: number): Promise<Job>;
  deleteJob(jobId: number): Promise<void>;

  // User Profiles
  getUserProfiles(filters?: UserProfileFilters): Promise<UserProfile[]>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfilesWithStats(): Promise<UserProfile[]>;

  // Job Applications
  getJobApplications(): Promise<JobApplication[]>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getJobApplicationsWithDetails(): Promise<any[]>;
  reviewJobApplication(id: number, status: string, notes?: string, reviewedBy?: number): Promise<JobApplication>;

  // System Stats
  getJobSystemStats(): Promise<JobSystemStats>;

  // Forum Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;

  // Forum Subforums
  getSubforums(categoryId?: number): Promise<Subforum[]>;
  createSubforum(subforum: InsertSubforum): Promise<Subforum>;

  // Forum Threads
  getThreads(filters?: { categoryId?: number; subforumId?: number; authorId?: string }): Promise<Thread[]>;
  getThread(id: number): Promise<Thread | undefined>;
  createThread(thread: InsertThread): Promise<Thread>;
  updateThread(id: number, thread: Partial<InsertThread>): Promise<Thread>;
  deleteThread(id: number): Promise<void>;
  incrementThreadViews(id: number): Promise<Thread>;

  // Forum Posts
  getPosts(threadId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;

  // Reactions
  getReactions(filters: { postId?: number; threadId?: number }): Promise<Reaction[]>;
  createReaction(reaction: InsertReaction): Promise<Reaction>;
  deleteReaction(id: number): Promise<void>;

  // Bookmarks
  getUserBookmarks(userId: string): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<void>;

  // Subscriptions
  getUserSubscriptions(userId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  deleteSubscription(id: number): Promise<void>;

  // Private Messages
  getUserMessages(userId: string): Promise<PrivateMessage[]>;
  createPrivateMessage(message: InsertPrivateMessage): Promise<PrivateMessage>;
  markMessageAsRead(id: number): Promise<PrivateMessage>;

  // Notifications
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: string): Promise<void>;

  // Programas (Cursos app móvil)
  getProgramas(): Promise<import("@shared/schema").Programa[]>;
  getPrograma(id: number): Promise<import("@shared/schema").Programa | undefined>;
  createPrograma(programa: import("@shared/schema").InsertPrograma): Promise<import("@shared/schema").Programa>;
  updatePrograma(id: number, programa: Partial<import("@shared/schema").InsertPrograma>): Promise<import("@shared/schema").Programa>;
  deletePrograma(id: number): Promise<void>;
  toggleProgramaPublicado(id: number): Promise<import("@shared/schema").Programa>;

  // Días de programa
  getDiasPrograma(programaId: number): Promise<import("@shared/schema").DiaPrograma[]>;
  getDiaPrograma(id: number): Promise<import("@shared/schema").DiaPrograma | undefined>;
  createDiaPrograma(dia: import("@shared/schema").InsertDiaPrograma): Promise<import("@shared/schema").DiaPrograma>;
  updateDiaPrograma(id: number, dia: UpdateDiaPrograma): Promise<import("@shared/schema").DiaPrograma>;
  deleteDiaPrograma(id: number): Promise<void>;

  // Peticiones de Oración
  getPeticionesOracion(estado?: string): Promise<PeticionOracion[]>;
  getPeticionOracion(id: number): Promise<PeticionOracion | undefined>;
  createPeticionOracion(peticion: InsertPeticionOracion): Promise<PeticionOracion>;
  updatePeticionOracion(id: number, peticion: Partial<InsertPeticionOracion>): Promise<PeticionOracion>;
  deletePeticionOracion(id: number): Promise<void>;
  incrementarContadorOraciones(id: number): Promise<PeticionOracion>;
}

// ============= MEMORY STORAGE IMPLEMENTATION =============

export class MemStorage implements IStorage {
  // Core system maps
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private activities: Map<number, Activity>;
  
  // Jobs system maps
  private professionalAreas: Map<number, ProfessionalArea>;
  private jobs: Map<number, Job>;
  private userProfiles: Map<number, UserProfile>;
  private jobApplications: Map<number, JobApplication>;
  
  // Forum system maps
  private categories: Map<number, Category>;
  private subforums: Map<number, Subforum>;
  private threads: Map<number, Thread>;
  private posts: Map<number, Post>;
  private reactions: Map<number, Reaction>;
  private bookmarks: Map<number, Bookmark>;
  private subscriptions: Map<number, Subscription>;
  private privateMessages: Map<number, PrivateMessage>;
  private notifications: Map<number, Notification>;

  // Programas (Cursos app móvil)
  private programas: Map<number, import("@shared/schema").Programa>;
  private diasPrograma: Map<number, import("@shared/schema").DiaPrograma>;

  // Peticiones de Oración
  private peticionesOracionMap: Map<number, PeticionOracion>;

  currentId: number;

  constructor() {
    // Initialize all maps
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.activities = new Map();
    this.professionalAreas = new Map();
    this.jobs = new Map();
    this.userProfiles = new Map();
    this.jobApplications = new Map();
    this.categories = new Map();
    this.subforums = new Map();
    this.threads = new Map();
    this.posts = new Map();
    this.reactions = new Map();
    this.bookmarks = new Map();
    this.subscriptions = new Map();
    this.privateMessages = new Map();
    this.notifications = new Map();
    this.programas = new Map();
    this.diasPrograma = new Map();
    this.peticionesOracionMap = new Map();
    
    this.currentId = 1;
    
    // Initialize sample data
    this.initializeSampleData();
    this.initializeJobsSampleData();
    this.initializeForumSampleData();
    this.initializeProgramasSampleData();
  }

  // ============= USER OPERATIONS =============

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
  const id = this.currentId++;
  const user: User = { 
    ...insertUser, 
    id, 
    email: insertUser.email ?? null, // Convierte undefined a null
    role: insertUser.role ?? null,   // Convierte undefined a null
    createdAt: new Date() 
  };
  this.users.set(id, user);
  return user;
}
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // ============= PRODUCT OPERATIONS =============
  
  async getTopSellingProducts(): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 3);
  }
  
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  // ============= ORDER OPERATIONS =============
  
async getRecentOrders(): Promise<Order[]> {
  const orders = Array.from(this.orders.values());
  return orders.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 4);
}
  
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  // ============= ACTIVITY OPERATIONS =============
  
  async getRecentActivities(): Promise<Activity[]> {
  const activities = Array.from(this.activities.values());
  return activities.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 4);
}

  // ============= DASHBOARD STATS =============
  
  async getDashboardStats(): Promise<DashboardStats> {
    return {
      usersTotal: "5,248",
      usersChange: 12.3,
      ordersTotal: "1,473",
      ordersChange: 8.2,
      revenue: "$48,592",
      revenueChange: -3.1,
      productsTotal: "892",
      productsChange: 4.7
    };
  }

  // ============= PROFESSIONAL AREAS =============

  async getProfessionalAreas(): Promise<ProfessionalArea[]> {
    return Array.from(this.professionalAreas.values());
  }

  async createProfessionalArea(insertArea: InsertProfessionalArea): Promise<ProfessionalArea> {
  const id = this.currentId++;
  const area: ProfessionalArea = { 
    ...insertArea,
    id,
    description: insertArea.description ?? null,
    createdAt: new Date() 
  };
  this.professionalAreas.set(id, area);
  return area;
}
  // ============= JOBS =============

  async getJobs(filters?: JobFilters): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());

    if (filters) {
      if (filters.professionalAreaId) {
        jobs = jobs.filter(job => job.professionalAreaId === filters.professionalAreaId);
      }
      if (filters.isActive !== undefined) {
        jobs = jobs.filter(job => job.isActive === filters.isActive);
      }
      if (filters.jobType) {
        jobs = jobs.filter(job => job.jobType === filters.jobType);
      }
      if (filters.experienceLevel) {
        jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel);
      }
    }

   return jobs.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  }

async createJob(insertJob: InsertJob): Promise<Job> {
  const id = this.currentId++;
  const job: Job = { 
    ...insertJob,
    id,
    requirements: insertJob.requirements ?? null,
    benefits: insertJob.benefits ?? null,
    professionalAreaId: insertJob.professionalAreaId ?? null,
    location: insertJob.location ?? null,
    salaryRange: insertJob.salaryRange ?? null,
    contactPhone: insertJob.contactPhone ?? null,
    applicationDeadline: insertJob.applicationDeadline ?? null,
    isActive: insertJob.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  this.jobs.set(id, job);
  return job;
}

async getJobsWithStats(): Promise<Job[]> {
  const jobs = Array.from(this.jobs.values());
  return jobs.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

  async toggleJobStatus(jobId: number): Promise<Job> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    
    const updatedJob = { 
      ...job, 
      isActive: !job.isActive, 
      updatedAt: new Date() 
    };
    this.jobs.set(jobId, updatedJob);
    return updatedJob;
  }

  async deleteJob(jobId: number): Promise<void> {
    // Remove related applications first
    const relatedApplications = Array.from(this.jobApplications.entries())
      .filter(([_, app]) => app.jobId === jobId);
    
    relatedApplications.forEach(([appId]) => {
      this.jobApplications.delete(appId);
    });

    this.jobs.delete(jobId);
  }

  // ============= USER PROFILES =============

  async getUserProfiles(filters?: UserProfileFilters): Promise<UserProfile[]> {
    let profiles = Array.from(this.userProfiles.values());

    if (filters) {
      if (filters.professionalAreaId) {
        profiles = profiles.filter(profile => 
          profile.professionalAreaId === filters.professionalAreaId
        );
      }
      if (filters.availableForWork !== undefined) {
        profiles = profiles.filter(profile => 
          profile.availableForWork === filters.availableForWork
        );
      }
    }

   return profiles.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  }
async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
  const id = this.currentId++;
  const profile: UserProfile = { 
    ...insertProfile,
    id,
    phone: insertProfile.phone ?? null,
    professionalAreaId: insertProfile.professionalAreaId ?? null,
    experience: insertProfile.experience ?? null,
    skills: insertProfile.skills ?? null,
    education: insertProfile.education ?? null,
    summary: insertProfile.summary ?? null,
    expectedSalary: insertProfile.expectedSalary ?? null,
    availableForWork: insertProfile.availableForWork ?? true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  this.userProfiles.set(id, profile);
  return profile;
}


 async getUserProfilesWithStats(): Promise<UserProfile[]> {
  return Array.from(this.userProfiles.values()).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

  // ============= JOB APPLICATIONS =============

  async getJobApplications(): Promise<JobApplication[]> {
  return Array.from(this.jobApplications.values()).sort((a, b) => {
    const dateA = (a.appliedAt || a.createdAt) ? new Date(a.appliedAt || a.createdAt!).getTime() : 0;
    const dateB = (b.appliedAt || b.createdAt) ? new Date(b.appliedAt || b.createdAt!).getTime() : 0;
    return dateB - dateA;
  });
}

async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
  const id = this.currentId++;
  const application: JobApplication = { 
    ...insertApplication,
    id,
    jobId: insertApplication.jobId ?? null,
    status: insertApplication.status || "pending",
    reviewedBy: insertApplication.reviewedBy ?? null,
    reviewedAt: insertApplication.reviewedAt ?? null,
    notes: insertApplication.notes ?? null,
    appliedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  this.jobApplications.set(id, application);
  return application;
}

 async getJobApplicationsWithDetails(): Promise<any[]> {
  const applications = Array.from(this.jobApplications.values());
  const jobs = Array.from(this.jobs.values());
  const profiles = Array.from(this.userProfiles.values());

  return applications.map(app => ({
    ...app,
    job: app.jobId ? jobs.find(j => j.id === app.jobId) : null,
    profile: profiles.find(p => p.id === app.userProfileId),
  })).sort((a, b) => {
    const dateA = (a.appliedAt || a.createdAt) ? new Date(a.appliedAt || a.createdAt!).getTime() : 0;
    const dateB = (b.appliedAt || b.createdAt) ? new Date(b.appliedAt || b.createdAt!).getTime() : 0;
    return dateB - dateA;
  });
}

async reviewJobApplication(
  id: number, 
  status: string, 
  notes?: string, 
  reviewedBy?: number
): Promise<JobApplication> {
  const application = this.jobApplications.get(id);
  if (!application) {
    throw new Error("Application not found");
  }

  const updatedApplication = {
    ...application,
    status,
    notes: notes ?? null,
    reviewedBy: reviewedBy ?? null,
    reviewedAt: new Date(),
    updatedAt: new Date()
  };

  this.jobApplications.set(id, updatedApplication);
  return updatedApplication;
}

  // ============= SYSTEM STATS =============

async getJobSystemStats(): Promise<JobSystemStats> {
  const jobs = Array.from(this.jobs.values());
  const applications = Array.from(this.jobApplications.values());
  const profiles = Array.from(this.userProfiles.values());

  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const jobsThisMonth = jobs.filter(job => 
    job.createdAt && new Date(job.createdAt) >= monthAgo
  ).length;

  const applicationsThisWeek = applications.filter(app => {
    const date = app.appliedAt || app.createdAt;
    return date && new Date(date) >= weekAgo;
  }).length;

  const activeProfiles = profiles.length;
  const profilesAvailable = profiles.filter(p => p.availableForWork).length;

  const acceptedApplications = applications.filter(app => app.status === "accepted").length;
  const successRate = applications.length > 0 
    ? ((acceptedApplications / applications.length) * 100).toFixed(1)
    : "0";

  return {
    totalJobs: jobs.length,
    jobsThisMonth,
    totalApplications: applications.length,
    applicationsThisWeek,
    activeProfiles,
    profilesAvailable,
    successRate
  };
}

  // ============= SAMPLE DATA INITIALIZATION =============

  private initializeSampleData() {
    // Sample users
    this.users.set(1, {
      id: 1,
      username: "juan.perez",
      password: "password123",
      email: "juan.perez@ejemplo.com",
      role: "admin",
      createdAt: new Date()
    });
    
    this.users.set(2, {
      id: 2,
      username: "maria.gonzalez",
      password: "password123",
      email: "maria.gonzalez@ejemplo.com",
      role: "user",
      createdAt: new Date()
    });
    
    // Sample products
    this.products.set(1, {
      id: 1,
      productId: "PRD-001",
      name: "Auriculares Inalámbricos Pro",
      description: "Auriculares inalámbricos de alta calidad con cancelación de ruido",
      price: "$159.99",
      category: "Electrónica",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
      sales: 324,
      createdAt: new Date()
    });
    
    this.products.set(2, {
      id: 2,
      productId: "PRD-002",
      name: "Altavoz Bluetooth Portátil",
      description: "Altavoz portátil con 20 horas de batería y resistente al agua",
      price: "$89.99",
      category: "Electrónica",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
      sales: 256,
      createdAt: new Date()
    });
    
    this.products.set(3, {
      id: 3,
      productId: "PRD-003",
      name: "Zapatillas Deportivas Run+",
      description: "Zapatillas para correr de alto rendimiento con amortiguación extra",
      price: "$129.99",
      category: "Ropa",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
      sales: 198,
      createdAt: new Date()
    });
    
    // Sample orders
    this.orders.set(1, {
      id: 1,
      orderNumber: "ORD-0102",
      userId: 2,
      status: "Entregado",
      total: "$124.00",
      date: "24 May, 2023",
      createdAt: new Date(),
      customer: {
        name: "María González",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
      }
    });
    
    this.orders.set(2, {
      id: 2,
      orderNumber: "ORD-0101",
      userId: 3,
      status: "En proceso",
      total: "$89.50",
      date: "24 May, 2023",
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      customer: {
        name: "Carlos Rodríguez",
        avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
      }
    });
    
    this.orders.set(3, {
      id: 3,
      orderNumber: "ORD-0100",
      userId: 4,
      status: "Cancelado",
      total: "$215.75",
      date: "23 May, 2023",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      customer: {
        name: "Ana Martínez",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
      }
    });
    
    this.orders.set(4, {
      id: 4,
      orderNumber: "ORD-0099",
      userId: 5,
      status: "Entregado",
      total: "$67.25",
      date: "23 May, 2023",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      customer: {
        name: "Luis Hernández",
        avatarUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
      }
    });
    
    // Sample activities
    this.activities.set(1, {
      id: 1,
      type: "user",
      message: "Nuevo usuario registrado <span class=\"font-medium\">Laura Sánchez</span>",
      timeAgo: "Hace 5 minutos",
      createdAt: new Date()
    });
    
    this.activities.set(2, {
      id: 2,
      type: "order",
      message: "Nuevo pedido <span class=\"font-medium\">#ORD-0102</span> completado",
      timeAgo: "Hace 27 minutos",
      createdAt: new Date(Date.now() - 1000 * 60 * 27)
    });
    
    this.activities.set(3, {
      id: 3,
      type: "refund",
      message: "Solicitud de reembolso para el pedido <span class=\"font-medium\">#ORD-0097</span>",
      timeAgo: "Hace 1 hora",
      createdAt: new Date(Date.now() - 1000 * 60 * 60)
    });
    
    this.activities.set(4, {
      id: 4,
      type: "message",
      message: "Nuevo mensaje de <span class=\"font-medium\">Carlos Rodríguez</span>",
      timeAgo: "Hace 3 horas",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
    });
  }

  private initializeJobsSampleData() {
    // Professional Areas
    const areas = [
      { id: 1, name: "Tecnología", description: "Desarrollo de software, IT, sistemas" },
      { id: 2, name: "Marketing", description: "Marketing digital, publicidad, ventas" },
      { id: 3, name: "Finanzas", description: "Contabilidad, análisis financiero, banca" },
      { id: 4, name: "Recursos Humanos", description: "Gestión de talento, reclutamiento" },
      { id: 5, name: "Diseño", description: "Diseño gráfico, UX/UI, creatividad" },
    ];

    areas.forEach(area => {
      this.professionalAreas.set(area.id, {
        ...area,
        createdAt: new Date()
      });
    });

    // Sample Jobs
    const sampleJobs = [
      {
        id: 1,
        title: "Desarrollador Frontend React",
        company: "TechCorp",
        description: "Buscamos un desarrollador frontend con experiencia en React y TypeScript para unirse a nuestro equipo de desarrollo de productos.",
        requirements: ["React", "TypeScript", "CSS", "Git"],
        benefits: ["Trabajo remoto", "Seguro médico", "Capacitaciones"],
        professionalAreaId: 1,
        location: "Santo Domingo, RD",
        jobType: "full-time",
        experienceLevel: "mid",
        salaryRange: "$35,000 - $45,000",
        contactEmail: "reclutamiento@techcorp.com",
        contactPhone: "809-555-0123",
        applicationDeadline: null,
        isActive: true,
        publishedBy: 1,
        createdAt: new Date(2024, 7, 15),
        updatedAt: new Date(2024, 7, 15)
      },
      {
        id: 2,
        title: "Especialista en Marketing Digital",
        company: "MarketPro",
        description: "Buscamos un especialista en marketing digital para gestionar nuestras campañas en redes sociales y SEO.",
        requirements: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
        benefits: ["Horario flexible", "Bonos por rendimiento"],
        professionalAreaId: 2,
        location: "Santiago, RD",
        jobType: "full-time",
        experienceLevel: "entry",
        salaryRange: "$25,000 - $32,000",
        contactEmail: "jobs@marketpro.com",
        contactPhone: null,
        applicationDeadline: null,
        isActive: true,
        publishedBy: 1,
        createdAt: new Date(2024, 7, 20),
        updatedAt: new Date(2024, 7, 20)
      },
      {
        id: 3,
        title: "Diseñador UX/UI",
        company: "DesignStudio",
        description: "Únete a nuestro equipo creativo como diseñador UX/UI para crear experiencias digitales excepcionales.",
        requirements: ["Figma", "Adobe XD", "Prototipado", "User Research"],
        benefits: ["Ambiente creativo", "Proyectos internacionales", "Crecimiento profesional"],
        professionalAreaId: 5,
        location: "Santo Domingo, RD",
        jobType: "full-time",
        experienceLevel: "senior",
        salaryRange: "$40,000 - $55,000",
        contactEmail: "careers@designstudio.com",
        contactPhone: "809-555-0456",
        applicationDeadline: null,
        isActive: true,
        publishedBy: 1,
        createdAt: new Date(2024, 7, 25),
        updatedAt: new Date(2024, 7, 25)
      }
    ];

    sampleJobs.forEach(job => {
      this.jobs.set(job.id, job);
    });

    // Sample User Profiles
    const sampleProfiles = [
      {
        id: 1,
        userId: 2,
        fullName: "María González",
        email: "maria.gonzalez@ejemplo.com",
        phone: "809-555-1234",
        professionalAreaId: 1,
        experience: "3 años de experiencia en desarrollo frontend con React y Vue.js. He trabajado en proyectos de e-commerce y aplicaciones web corporativas.",
        skills: ["React", "Vue.js", "JavaScript", "TypeScript", "HTML", "CSS", "Git"],
        education: "Ingeniería en Sistemas, PUCMM",
        summary: "Desarrolladora frontend apasionada por crear interfaces de usuario intuitivas y responsivas. Me especializo en React y tengo experiencia trabajando en equipos ágiles.",
        expectedSalary: "$30,000 - $40,000",
        availableForWork: true,
        createdAt: new Date(2024, 7, 10),
        updatedAt: new Date(2024, 7, 10)
      },
      {
        id: 2,
        userId: 1,
        fullName: "Juan Pérez",
        email: "juan.perez@ejemplo.com",
        phone: "809-555-5678",
        professionalAreaId: 2,
        experience: "5 años en marketing digital, especializado en Google Ads y Facebook Ads. He gestionado presupuestos de hasta $50,000 mensuales.",
        skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics", "Marketing Automation"],
        education: "Licenciatura en Marketing, UASD",
        summary: "Especialista en marketing digital con track record comprobado en generación de leads y optimización de ROI en campañas publicitarias digitales.",
        expectedSalary: "$35,000 - $45,000",
        availableForWork: true,
        createdAt: new Date(2024, 7, 12),
        updatedAt: new Date(2024, 7, 12)
      }
    ];

    sampleProfiles.forEach(profile => {
      this.userProfiles.set(profile.id, profile);
    });

    // Sample Job Applications
    const sampleApplications = [
      {
        id: 1,
        jobId: 1,
        userProfileId: 1,
        coverLetter: "Estimado equipo de reclutamiento, estoy muy interesada en la posición de Desarrollador Frontend React. Mi experiencia de 3 años con React y TypeScript me ha permitido desarrollar aplicaciones web robustas y escalables. He trabajado en proyectos similares y estoy emocionada por la oportunidad de contribuir a TechCorp.",
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        notes: null,
        appliedAt: new Date(2024, 7, 28),
        createdAt: new Date(2024, 7, 28),
        updatedAt: new Date(2024, 7, 28)
      },
      {
        id: 2,
        jobId: 2,
        userProfileId: 2,
        coverLetter: "Hola equipo de MarketPro, soy Juan Pérez y me postulo para la posición de Especialista en Marketing Digital. Con 5 años de experiencia gestionando campañas de Google Ads y Facebook Ads, he logrado optimizar ROI en más del 150% en mis proyectos anteriores. Me encantaría aportar mi experiencia a su equipo.",
        status: "reviewed",
        reviewedBy: 1,
        reviewedAt: new Date(2024, 7, 29),
        notes: "Candidato prometedor con buena experiencia. Programar entrevista.",
        appliedAt: new Date(2024, 7, 26),
        createdAt: new Date(2024, 7, 26),
        updatedAt: new Date(2024, 7, 29)
      },
      {
        id: 3,
        jobId: 3,
        userProfileId: 1,
        coverLetter: "Aunque mi experiencia principal es en desarrollo frontend, tengo un gran interés en UX/UI y he completado varios cursos en Figma y diseño centrado en el usuario. Me gustaría hacer la transición al área de diseño y creo que mi background técnico sería un valor agregado.",
        status: "rejected",
        reviewedBy: 1,
        reviewedAt: new Date(2024, 7, 30),
        notes: "Perfil interesante pero buscamos alguien con más experiencia específica en UX/UI.",
        appliedAt: new Date(2024, 7, 27),
        createdAt: new Date(2024, 7, 27),
        updatedAt: new Date(2024, 7, 30)
      },
      {
        id: 4,
        jobId: null, // Postulación general
        userProfileId: 2,
        coverLetter: "Hola, soy Juan Pérez, especialista en marketing digital con 5 años de experiencia. Estoy abierto a nuevas oportunidades en el área de marketing y publicidad digital. Mi experiencia incluye gestión de campañas, SEO y analytics. Estaría encantado de discutir cómo puedo aportar valor a su organización.",
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        notes: null,
        appliedAt: new Date(2024, 7, 30),
        createdAt: new Date(2024, 7, 30),
        updatedAt: new Date(2024, 7, 30)
      }
    ];

    sampleApplications.forEach(application => {
      this.jobApplications.set(application.id, application);
    });

    // Increment currentId to avoid conflicts
    this.currentId = Math.max(
      Math.max(...Array.from(this.users.keys()), 0),
      Math.max(...Array.from(this.products.keys()), 0),
      Math.max(...Array.from(this.orders.keys()), 0),
      Math.max(...Array.from(this.activities.keys()), 0),
      Math.max(...Array.from(this.professionalAreas.keys()), 0),
      Math.max(...Array.from(this.jobs.keys()), 0),
      Math.max(...Array.from(this.userProfiles.keys()), 0),
      Math.max(...Array.from(this.jobApplications.keys()), 0),
      this.currentId
    ) + 1;
  }

  // ============= FORUM CATEGORIES =============

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.position - b.position);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const category: Category = {
      ...insertCategory,
      id,
      description: insertCategory.description ?? null,
      schedule: insertCategory.schedule ?? null,
      maxParticipants: insertCategory.maxParticipants ?? null,
      isActive: insertCategory.isActive ?? true,
      position: insertCategory.position ?? 0,
      createdAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category> {
    const category = this.categories.get(id);
    if (!category) {
      throw new Error("Category not found");
    }
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  // ============= FORUM SUBFORUMS =============

  async getSubforums(categoryId?: number): Promise<Subforum[]> {
    let subforums = Array.from(this.subforums.values());
    if (categoryId) {
      subforums = subforums.filter(s => s.categoryId === categoryId);
    }
    return subforums.sort((a, b) => a.position - b.position);
  }

  async createSubforum(insertSubforum: InsertSubforum): Promise<Subforum> {
    const id = this.currentId++;
    const subforum: Subforum = {
      ...insertSubforum,
      id,
      description: insertSubforum.description ?? null,
      isActive: insertSubforum.isActive ?? true,
      position: insertSubforum.position ?? 0,
      createdAt: new Date()
    };
    this.subforums.set(id, subforum);
    return subforum;
  }

  // ============= FORUM THREADS =============

  async getThreads(filters?: { categoryId?: number; subforumId?: number; authorId?: string }): Promise<Thread[]> {
    let threads = Array.from(this.threads.values());
    
    if (filters) {
      if (filters.categoryId) {
        threads = threads.filter(t => t.categoryId === filters.categoryId);
      }
      if (filters.subforumId) {
        threads = threads.filter(t => t.subforumId === filters.subforumId);
      }
      if (filters.authorId) {
        threads = threads.filter(t => t.authorId === filters.authorId);
      }
    }

    return threads.sort((a, b) => {
      // Sticky threads first
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      
      // Then by last reply or creation date
      const dateA = a.lastReplyAt || a.createdAt;
      const dateB = b.lastReplyAt || b.createdAt;
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    });
  }

  async getThread(id: number): Promise<Thread | undefined> {
    return this.threads.get(id);
  }

  async createThread(insertThread: InsertThread): Promise<Thread> {
    const id = this.currentId++;
    const thread: Thread = {
      ...insertThread,
      id,
      subforumId: insertThread.subforumId ?? null,
      lastReplyAt: insertThread.lastReplyAt ?? null,
      lastReplyBy: insertThread.lastReplyBy ?? null,
      isSticky: insertThread.isSticky ?? false,
      isLocked: insertThread.isLocked ?? false,
      viewCount: insertThread.viewCount ?? 0,
      replyCount: insertThread.replyCount ?? 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.threads.set(id, thread);
    return thread;
  }

  async updateThread(id: number, updates: Partial<InsertThread>): Promise<Thread> {
    const thread = this.threads.get(id);
    if (!thread) {
      throw new Error("Thread not found");
    }
    const updatedThread = { ...thread, ...updates, updatedAt: new Date() };
    this.threads.set(id, updatedThread);
    return updatedThread;
  }

  async deleteThread(id: number): Promise<void> {
    // Delete all posts in this thread
    Array.from(this.posts.entries())
      .filter(([_, post]) => post.threadId === id)
      .forEach(([postId]) => this.posts.delete(postId));
    
    // Delete all reactions for this thread
    Array.from(this.reactions.entries())
      .filter(([_, reaction]) => reaction.threadId === id)
      .forEach(([reactionId]) => this.reactions.delete(reactionId));
    
    // Delete all bookmarks for this thread
    Array.from(this.bookmarks.entries())
      .filter(([_, bookmark]) => bookmark.threadId === id)
      .forEach(([bookmarkId]) => this.bookmarks.delete(bookmarkId));
    
    this.threads.delete(id);
  }

  async incrementThreadViews(id: number): Promise<Thread> {
    const thread = this.threads.get(id);
    if (!thread) {
      throw new Error("Thread not found");
    }
    const updatedThread = { ...thread, viewCount: thread.viewCount + 1 };
    this.threads.set(id, updatedThread);
    return updatedThread;
  }

  // ============= FORUM POSTS =============

  async getPosts(threadId: number): Promise<Post[]> {
    const posts = Array.from(this.posts.values())
      .filter(p => p.threadId === threadId);
    return posts.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateA - dateB;
    });
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentId++;
    const post: Post = {
      ...insertPost,
      id,
      parentId: insertPost.parentId ?? null,
      isModerated: insertPost.isModerated ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.set(id, post);

    // Update thread reply count and last reply info
    const thread = this.threads.get(insertPost.threadId);
    if (thread) {
      const updatedThread = {
        ...thread,
        replyCount: thread.replyCount + 1,
        lastReplyAt: new Date(),
        lastReplyBy: insertPost.authorId,
        updatedAt: new Date()
      };
      this.threads.set(insertPost.threadId, updatedThread);
    }

    return post;
  }

  async updatePost(id: number, updates: Partial<InsertPost>): Promise<Post> {
    const post = this.posts.get(id);
    if (!post) {
      throw new Error("Post not found");
    }
    const updatedPost = { ...post, ...updates, updatedAt: new Date() };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    const post = this.posts.get(id);
    if (!post) {
      throw new Error("Post not found");
    }

    // Delete child posts
    Array.from(this.posts.entries())
      .filter(([_, p]) => p.parentId === id)
      .forEach(([postId]) => this.posts.delete(postId));
    
    // Delete reactions for this post
    Array.from(this.reactions.entries())
      .filter(([_, reaction]) => reaction.postId === id)
      .forEach(([reactionId]) => this.reactions.delete(reactionId));
    
    this.posts.delete(id);

    // Update thread reply count
    const thread = this.threads.get(post.threadId);
    if (thread) {
      const updatedThread = {
        ...thread,
        replyCount: Math.max(0, thread.replyCount - 1)
      };
      this.threads.set(post.threadId, updatedThread);
    }
  }

  // ============= REACTIONS =============

  async getReactions(filters: { postId?: number; threadId?: number }): Promise<Reaction[]> {
    let reactions = Array.from(this.reactions.values());
    
    if (filters.postId) {
      reactions = reactions.filter(r => r.postId === filters.postId);
    }
    if (filters.threadId) {
      reactions = reactions.filter(r => r.threadId === filters.threadId);
    }
    
    return reactions;
  }

  async createReaction(insertReaction: InsertReaction): Promise<Reaction> {
    const id = this.currentId++;
    const reaction: Reaction = {
      ...insertReaction,
      id,
      type: insertReaction.type ?? 'like',
      postId: insertReaction.postId ?? null,
      threadId: insertReaction.threadId ?? null,
      createdAt: new Date()
    };
    this.reactions.set(id, reaction);
    return reaction;
  }

  async deleteReaction(id: number): Promise<void> {
    this.reactions.delete(id);
  }

  // ============= BOOKMARKS =============

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.getTime() || 0;
        return dateB - dateA;
      });
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentId++;
    const bookmark: Bookmark = {
      ...insertBookmark,
      id,
      createdAt: new Date()
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<void> {
    this.bookmarks.delete(id);
  }

  // ============= SUBSCRIPTIONS =============

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values())
      .filter(s => s.userId === userId);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentId++;
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      notificationLevel: insertSubscription.notificationLevel ?? 'all',
      categoryId: insertSubscription.categoryId ?? null,
      subforumId: insertSubscription.subforumId ?? null,
      threadId: insertSubscription.threadId ?? null,
      createdAt: new Date()
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async deleteSubscription(id: number): Promise<void> {
    this.subscriptions.delete(id);
  }

  // ============= PRIVATE MESSAGES =============

  async getUserMessages(userId: string): Promise<PrivateMessage[]> {
    return Array.from(this.privateMessages.values())
      .filter(m => m.fromUserId === userId || m.toUserId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.getTime() || 0;
        return dateB - dateA;
      });
  }

  async createPrivateMessage(insertMessage: InsertPrivateMessage): Promise<PrivateMessage> {
    const id = this.currentId++;
    const message: PrivateMessage = {
      ...insertMessage,
      id,
      isRead: insertMessage.isRead ?? false,
      createdAt: new Date()
    };
    this.privateMessages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<PrivateMessage> {
    const message = this.privateMessages.get(id);
    if (!message) {
      throw new Error("Message not found");
    }
    const updatedMessage = { ...message, isRead: true };
    this.privateMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  // ============= NOTIFICATIONS =============

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.getTime() || 0;
        return dateB - dateA;
      });
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      isRead: insertNotification.isRead ?? false,
      content: insertNotification.content ?? null,
      relatedId: insertNotification.relatedId ?? null,
      relatedType: insertNotification.relatedType ?? null,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    Array.from(this.notifications.entries())
      .filter(([_, notification]) => notification.userId === userId && !notification.isRead)
      .forEach(([id, notification]) => {
        this.notifications.set(id, { ...notification, isRead: true });
      });
  }

  // ============= PROGRAMAS OPERATIONS =============

  async getProgramas(): Promise<import("@shared/schema").Programa[]> {
    return Array.from(this.programas.values()).sort((a, b) => a.id - b.id);
  }

  async getPrograma(id: number): Promise<import("@shared/schema").Programa | undefined> {
    return this.programas.get(id);
  }

  async createPrograma(programa: import("@shared/schema").InsertPrograma): Promise<import("@shared/schema").Programa> {
    const id = this.currentId++;
    const nuevo: import("@shared/schema").Programa = {
      id,
      slug: programa.slug,
      nombre: programa.nombre,
      descripcion: programa.descripcion ?? null,
      icono: programa.icono ?? "📖",
      imagenUrl: programa.imagenUrl ?? null,
      color: programa.color ?? "#3478F6",
      categoria: programa.categoria ?? "formacion-cristiana",
      version: programa.version ?? "1.0.0",
      totalDias: programa.totalDias ?? 21,
      duracion: programa.duracion ?? null,
      nivel: programa.nivel ?? "Básico",
      publicado: programa.publicado ?? false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };
    this.programas.set(id, nuevo);
    return nuevo;
  }

  async updatePrograma(id: number, cambios: Partial<import("@shared/schema").InsertPrograma>): Promise<import("@shared/schema").Programa> {
    const existing = this.programas.get(id);
    if (!existing) throw new Error(`Programa ${id} no encontrado`);
    const updated: import("@shared/schema").Programa = {
      ...existing,
      ...cambios,
      actualizadoEn: new Date(),
    } as import("@shared/schema").Programa;
    this.programas.set(id, updated);
    return updated;
  }

  async deletePrograma(id: number): Promise<void> {
    this.programas.delete(id);
    // Cascade: remove dias
    Array.from(this.diasPrograma.entries())
      .filter(([_, d]) => d.programaId === id)
      .forEach(([did]) => this.diasPrograma.delete(did));
  }

  async toggleProgramaPublicado(id: number): Promise<import("@shared/schema").Programa> {
    const p = this.programas.get(id);
    if (!p) throw new Error(`Programa ${id} no encontrado`);
    return this.updatePrograma(id, { publicado: !p.publicado });
  }

  // ── Días de programa ──────────────────────────────────────────────────────
  async getDiasPrograma(programaId: number): Promise<import("@shared/schema").DiaPrograma[]> {
    return Array.from(this.diasPrograma.values())
      .filter(d => d.programaId === programaId)
      .sort((a, b) => a.numero - b.numero);
  }

  async getDiaPrograma(id: number): Promise<import("@shared/schema").DiaPrograma | undefined> {
    return this.diasPrograma.get(id);
  }

  async createDiaPrograma(dia: import("@shared/schema").InsertDiaPrograma): Promise<import("@shared/schema").DiaPrograma> {
    const id = this.currentId++;
    const nuevo: import("@shared/schema").DiaPrograma = {
      id,
      programaId: dia.programaId,
      numero: dia.numero,
      titulo: dia.titulo,
      descripcion: dia.descripcion ?? null,
      versiculoRef: dia.versiculoRef ?? null,
      versiculoTexto: dia.versiculoTexto ?? null,
      reflexion: dia.reflexion ?? null,
      actividadTitulo: dia.actividadTitulo ?? null,
      actividadDescripcion: dia.actividadDescripcion ?? null,
      audioUrl: dia.audioUrl ?? null,
      videoUrl: dia.videoUrl ?? null,
      ayunoDescripcion: dia.ayunoDescripcion ?? null,
      lecturas: dia.lecturas ?? null,
      creadoEn: new Date(),
    };
    this.diasPrograma.set(id, nuevo);
    // Actualizar totalDias del programa
    const prog = this.programas.get(dia.programaId);
    if (prog) {
      const count = Array.from(this.diasPrograma.values()).filter(d => d.programaId === dia.programaId).length;
      this.programas.set(dia.programaId, { ...prog, totalDias: count, actualizadoEn: new Date() });
    }
    return nuevo;
  }

  async updateDiaPrograma(id: number, cambios: UpdateDiaPrograma): Promise<import("@shared/schema").DiaPrograma> {
    const existing = this.diasPrograma.get(id);
    if (!existing) throw new Error(`Día ${id} no encontrado`);
    const updated = { ...existing, ...cambios };
    this.diasPrograma.set(id, updated);
    return updated;
  }

  async deleteDiaPrograma(id: number): Promise<void> {
    const dia = this.diasPrograma.get(id);
    this.diasPrograma.delete(id);
    if (dia) {
      const prog = this.programas.get(dia.programaId);
      if (prog) {
        const count = Array.from(this.diasPrograma.values()).filter(d => d.programaId === dia.programaId).length;
        this.programas.set(dia.programaId, { ...prog, totalDias: count, actualizadoEn: new Date() });
      }
    }
  }

  // ============= PROGRAMAS SAMPLE DATA =============
  // DatabaseStorage usa datos reales de la BD. Este método no inserta datos de muestra.

  protected initializeProgramasSampleData() {
    // No se cargan datos de muestra - DatabaseStorage usa PostgreSQL
  }

  // ============= FORUM SAMPLE DATA =============

  private initializeForumSampleData() {
    // Sample categories (using data from mock-forum.ts structure)
    const sampleCategories = [
      {
        id: 1,
        name: "Comunión Diaria",
        description: "Reflexiones y comunión diaria con Dios",
        icon: "BookOpen",
        color: "blue",
        slug: "comunion-diaria",
        position: 1,
        schedule: "Lunes a Viernes, 7:00 AM",
        maxParticipants: 100,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Cursos Bíblicos",
        description: "Aprende más sobre la Palabra de Dios",
        icon: "GraduationCap",
        color: "green",
        slug: "cursos-biblicos",
        position: 2,
        schedule: null,
        maxParticipants: null,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Eventos",
        description: "Próximos eventos y actividades de la iglesia",
        icon: "Calendar",
        color: "purple",
        slug: "eventos",
        position: 3,
        schedule: null,
        maxParticipants: null,
        isActive: true,
        createdAt: new Date()
      }
    ];

    sampleCategories.forEach(cat => {
      this.categories.set(cat.id, cat);
    });

    // Sample threads
    const sampleThreads = [
      {
        id: 1,
        categoryId: 1,
        subforumId: null,
        authorId: "1",
        title: "Reflexión del día - La fe que mueve montañas",
        content: "Hoy quiero compartir una reflexión sobre Mateo 17:20...",
        isSticky: true,
        isLocked: false,
        viewCount: 145,
        replyCount: 23,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 30),
        lastReplyBy: "2",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 2,
        categoryId: 2,
        subforumId: null,
        authorId: "1",
        title: "Nuevo curso: Introducción al Antiguo Testamento",
        content: "Estamos iniciando un nuevo curso sobre el Antiguo Testamento...",
        isSticky: false,
        isLocked: false,
        viewCount: 89,
        replyCount: 12,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 120),
        lastReplyBy: "2",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        updatedAt: new Date(Date.now() - 1000 * 60 * 120)
      },
      {
        id: 3,
        categoryId: 3,
        subforumId: null,
        authorId: "2",
        title: "Retiro Espiritual - Próximo fin de semana",
        content: "¡Únete a nuestro retiro espiritual! Será un tiempo de renovación...",
        isSticky: true,
        isLocked: false,
        viewCount: 234,
        replyCount: 45,
        lastReplyAt: new Date(Date.now() - 1000 * 60 * 15),
        lastReplyBy: "1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15)
      }
    ];

    sampleThreads.forEach(thread => {
      this.threads.set(thread.id, thread);
    });

    // Sample posts
    const samplePosts = [
      {
        id: 1,
        threadId: 1,
        authorId: "2",
        content: "¡Excelente reflexión! Me encanta cómo explicas el poder de la fe.",
        parentId: null,
        isModerated: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        updatedAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 2,
        threadId: 1,
        authorId: "1",
        content: "Gracias por tus palabras. La fe es fundamental en nuestra vida cristiana.",
        parentId: 1,
        isModerated: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        updatedAt: new Date(Date.now() - 1000 * 60 * 25)
      },
      {
        id: 3,
        threadId: 2,
        authorId: "2",
        content: "¿Cuándo inicia el curso y cuál es el horario?",
        parentId: null,
        isModerated: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
        updatedAt: new Date(Date.now() - 1000 * 60 * 120)
      }
    ];

    samplePosts.forEach(post => {
      this.posts.set(post.id, post);
    });
  }

  // ---- Peticiones de Oración (MemStorage) ----

  async getPeticionesOracion(estado?: string): Promise<PeticionOracion[]> {
    const all = Array.from(this.peticionesOracionMap.values());
    if (estado) return all.filter(p => p.estado === estado);
    return all.sort((a, b) => (b.creadoEn?.getTime() ?? 0) - (a.creadoEn?.getTime() ?? 0));
  }

  async getPeticionOracion(id: number): Promise<PeticionOracion | undefined> {
    return this.peticionesOracionMap.get(id);
  }

  async createPeticionOracion(data: InsertPeticionOracion): Promise<PeticionOracion> {
    const id = this.currentId++;
    const now = new Date();
    const peticion: PeticionOracion = {
      id,
      peticion: data.peticion,
      autor: data.autor,
      estado: data.estado ?? "pendiente",
      contadorOraciones: data.contadorOraciones ?? 0,
      privada: data.privada ?? false,
      categoria: data.categoria ?? "general",
      creadoEn: now,
      actualizadoEn: now,
    };
    this.peticionesOracionMap.set(id, peticion);
    return peticion;
  }

  async updatePeticionOracion(id: number, data: Partial<InsertPeticionOracion>): Promise<PeticionOracion> {
    const existing = this.peticionesOracionMap.get(id);
    if (!existing) throw new Error(`Petición ${id} no encontrada`);
    const updated: PeticionOracion = { ...existing, ...data, actualizadoEn: new Date() };
    this.peticionesOracionMap.set(id, updated);
    return updated;
  }

  async deletePeticionOracion(id: number): Promise<void> {
    this.peticionesOracionMap.delete(id);
  }

  async incrementarContadorOraciones(id: number): Promise<PeticionOracion> {
    const existing = this.peticionesOracionMap.get(id);
    if (!existing) throw new Error(`Petición ${id} no encontrada`);
    const updated: PeticionOracion = {
      ...existing,
      contadorOraciones: existing.contadorOraciones + 1,
      actualizadoEn: new Date(),
    };
    this.peticionesOracionMap.set(id, updated);
    return updated;
  }
}

// ============= DATABASE STORAGE (overrides Programas / Días with real DB) =============

export class DatabaseStorage extends MemStorage {

  // Prevent in-memory sample programas from being loaded – DB is the source of truth
  protected override initializeProgramasSampleData(): void {
    // no-op: data is persisted in PostgreSQL
  }

  // ── Programas ─────────────────────────────────────────────────────────────

  override async getProgramas(): Promise<Programa[]> {
    // Usar query relacional para incluir los días de cada programa
    const programasConDias = await db.query.programas.findMany({
      orderBy: [asc(programas.creadoEn)],
      with: {
        dias: {
          orderBy: [asc(diasPrograma.numero)],
        },
      },
    });
    
    return programasConDias as any;
  }

  override async getPrograma(id: number): Promise<Programa | undefined> {
    const rows = await db.select().from(programas).where(eq(programas.id, id));
    return rows[0];
  }

  override async createPrograma(data: InsertPrograma): Promise<Programa> {
    const rows = await db.insert(programas).values(data).returning();
    return rows[0];
  }

  override async updatePrograma(id: number, data: Partial<InsertPrograma>): Promise<Programa> {
    const rows = await db
      .update(programas)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(programas.id, id))
      .returning();
    if (!rows[0]) throw new Error(`Programa ${id} no encontrado`);
    return rows[0];
  }

  override async deletePrograma(id: number): Promise<void> {
    // diasPrograma cascade is handled by the FK onDelete: "cascade"
    await db.delete(programas).where(eq(programas.id, id));
  }

  override async toggleProgramaPublicado(id: number): Promise<Programa> {
    const current = await this.getPrograma(id);
    if (!current) throw new Error(`Programa ${id} no encontrado`);
    return this.updatePrograma(id, { publicado: !current.publicado });
  }

  // ── Días de programa ──────────────────────────────────────────────────────

  override async getDiasPrograma(programaId: number): Promise<DiaPrograma[]> {
    return db
      .select()
      .from(diasPrograma)
      .where(eq(diasPrograma.programaId, programaId))
      .orderBy(asc(diasPrograma.numero));
  }

  override async getDiaPrograma(id: number): Promise<DiaPrograma | undefined> {
    const rows = await db.select().from(diasPrograma).where(eq(diasPrograma.id, id));
    return rows[0];
  }

  override async createDiaPrograma(data: InsertDiaPrograma): Promise<DiaPrograma> {
    const rows = await db.insert(diasPrograma).values(data).returning();
    // Update totalDias on the parent programa
    await db
      .update(programas)
      .set({
        totalDias: sql`(SELECT COUNT(*) FROM dias_programa WHERE programa_id = ${data.programaId})`,
        actualizadoEn: new Date(),
      })
      .where(eq(programas.id, data.programaId));
    return rows[0];
  }

  override async updateDiaPrograma(id: number, data: UpdateDiaPrograma): Promise<DiaPrograma> {
    const rows = await db
      .update(diasPrograma)
      .set(data)
      .where(eq(diasPrograma.id, id))
      .returning();
    if (!rows[0]) throw new Error(`Día ${id} no encontrado`);
    return rows[0];
  }

  override async deleteDiaPrograma(id: number): Promise<void> {
    const dia = await this.getDiaPrograma(id);
    await db.delete(diasPrograma).where(eq(diasPrograma.id, id));
    if (dia) {
      await db
        .update(programas)
        .set({
          totalDias: sql`(SELECT COUNT(*) FROM dias_programa WHERE programa_id = ${dia.programaId})`,
          actualizadoEn: new Date(),
        })
        .where(eq(programas.id, dia.programaId));
    }
  }

  // ── Peticiones de Oración ─────────────────────────────────────────────────

  override async getPeticionesOracion(estado?: string): Promise<PeticionOracion[]> {
    if (estado) {
      return db
        .select()
        .from(peticionesOracion)
        .where(eq(peticionesOracion.estado, estado))
        .orderBy(sql`${peticionesOracion.creadoEn} DESC`);
    }
    return db.select().from(peticionesOracion).orderBy(sql`${peticionesOracion.creadoEn} DESC`);
  }

  override async getPeticionOracion(id: number): Promise<PeticionOracion | undefined> {
    const rows = await db.select().from(peticionesOracion).where(eq(peticionesOracion.id, id));
    return rows[0];
  }

  override async createPeticionOracion(data: InsertPeticionOracion): Promise<PeticionOracion> {
    const rows = await db.insert(peticionesOracion).values(data).returning();
    return rows[0];
  }

  override async updatePeticionOracion(id: number, data: Partial<InsertPeticionOracion>): Promise<PeticionOracion> {
    const rows = await db
      .update(peticionesOracion)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(peticionesOracion.id, id))
      .returning();
    if (!rows[0]) throw new Error(`Petición ${id} no encontrada`);
    return rows[0];
  }

  override async deletePeticionOracion(id: number): Promise<void> {
    await db.delete(peticionesOracion).where(eq(peticionesOracion.id, id));
  }

  override async incrementarContadorOraciones(id: number): Promise<PeticionOracion> {
    const rows = await db
      .update(peticionesOracion)
      .set({
        contadorOraciones: sql`${peticionesOracion.contadorOraciones} + 1`,
        actualizadoEn: new Date(),
      })
      .where(eq(peticionesOracion.id, id))
      .returning();
    if (!rows[0]) throw new Error(`Petición ${id} no encontrada`);
    return rows[0];
  }
}

// Export the storage instance – uses real DB for programas/días, MemStorage for the rest
export const storage = new DatabaseStorage();