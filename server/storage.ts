// Database Storage Implementation
// Reference: javascript_database blueprint
import { eq, and, desc, like, or, sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  ProfessionalProfile,
  InsertProfessionalProfile,
  CompanyProfile,
  InsertCompanyProfile,
  Service,
  InsertService,
  Job,
  InsertJob,
  Project,
  InsertProject,
  Message,
  InsertMessage,
  Conversation,
  Review,
  InsertReview,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
  
  // Professional Profile operations
  getProfessionalProfile(userId: string): Promise<ProfessionalProfile | undefined>;
  getProfessionalProfileById(id: string): Promise<ProfessionalProfile | undefined>;
  createProfessionalProfile(profile: InsertProfessionalProfile): Promise<ProfessionalProfile>;
  updateProfessionalProfile(id: string, updates: Partial<ProfessionalProfile>): Promise<ProfessionalProfile | undefined>;
  getAllProfessionals(): Promise<ProfessionalProfile[]>;
  
  // Company Profile operations
  getCompanyProfile(userId: string): Promise<CompanyProfile | undefined>;
  getCompanyProfileById(id: string): Promise<CompanyProfile | undefined>;
  createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile>;
  updateCompanyProfile(id: string, updates: Partial<CompanyProfile>): Promise<CompanyProfile | undefined>;
  
  // Service operations
  getServicesByProfile(profileId: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  getAllServices(): Promise<Service[]>;
  
  // Job operations
  getJobsByCompany(companyId: string): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  getAllPublicJobs(): Promise<Job[]>;
  
  // Project operations
  getProjectsByProfessional(professionalId: string): Promise<Project[]>;
  getProjectsByCompany(companyId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Messaging operations
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationByParticipants(participant1: string, participant2: string): Promise<Conversation | undefined>;
  createConversation(conversation: any): Promise<Conversation>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
  
  // Review operations
  getReviewsByProject(projectId: string): Promise<Review[]>;
  getReviewsForUser(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // ============================================================================
  // USER OPERATIONS
  // ============================================================================
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(schema.users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(userData)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // ============================================================================
  // PROFESSIONAL PROFILE OPERATIONS
  // ============================================================================

  async getProfessionalProfile(userId: string): Promise<ProfessionalProfile | undefined> {
    const [profile] = await db
      .select()
      .from(schema.professionalProfiles)
      .where(eq(schema.professionalProfiles.userId, userId))
      .limit(1);
    return profile;
  }

  async getProfessionalProfileById(id: string): Promise<ProfessionalProfile | undefined> {
    const [profile] = await db
      .select()
      .from(schema.professionalProfiles)
      .where(eq(schema.professionalProfiles.id, id))
      .limit(1);
    return profile;
  }

  async createProfessionalProfile(insertProfile: InsertProfessionalProfile): Promise<ProfessionalProfile> {
    const [profile] = await db
      .insert(schema.professionalProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateProfessionalProfile(id: string, updates: Partial<ProfessionalProfile>): Promise<ProfessionalProfile | undefined> {
    const [profile] = await db
      .update(schema.professionalProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.professionalProfiles.id, id))
      .returning();
    return profile;
  }

  async getAllProfessionals(): Promise<ProfessionalProfile[]> {
    return await db
      .select()
      .from(schema.professionalProfiles)
      .orderBy(desc(schema.professionalProfiles.averageRating));
  }

  // ============================================================================
  // COMPANY PROFILE OPERATIONS
  // ============================================================================

  async getCompanyProfile(userId: string): Promise<CompanyProfile | undefined> {
    const [profile] = await db
      .select()
      .from(schema.companyProfiles)
      .where(eq(schema.companyProfiles.userId, userId))
      .limit(1);
    return profile;
  }

  async getCompanyProfileById(id: string): Promise<CompanyProfile | undefined> {
    const [profile] = await db
      .select()
      .from(schema.companyProfiles)
      .where(eq(schema.companyProfiles.id, id))
      .limit(1);
    return profile;
  }

  async createCompanyProfile(insertProfile: InsertCompanyProfile): Promise<CompanyProfile> {
    const [profile] = await db
      .insert(schema.companyProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateCompanyProfile(id: string, updates: Partial<CompanyProfile>): Promise<CompanyProfile | undefined> {
    const [profile] = await db
      .update(schema.companyProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.companyProfiles.id, id))
      .returning();
    return profile;
  }

  // ============================================================================
  // SERVICE OPERATIONS
  // ============================================================================

  async getServicesByProfile(profileId: string): Promise<Service[]> {
    return await db
      .select()
      .from(schema.services)
      .where(eq(schema.services.profileId, profileId))
      .orderBy(desc(schema.services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(schema.services)
      .where(eq(schema.services.id, id))
      .limit(1);
    return service;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(schema.services)
      .values(insertService)
      .returning();
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const [service] = await db
      .update(schema.services)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.services)
      .where(eq(schema.services.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllServices(): Promise<Service[]> {
    return await db
      .select()
      .from(schema.services)
      .where(eq(schema.services.isPublic, true))
      .orderBy(desc(schema.services.createdAt));
  }

  // ============================================================================
  // JOB OPERATIONS
  // ============================================================================

  async getJobsByCompany(companyId: string): Promise<Job[]> {
    return await db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.companyId, companyId))
      .orderBy(desc(schema.jobs.createdAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.id, id))
      .limit(1);
    return job;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(schema.jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const [job] = await db
      .update(schema.jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.jobs)
      .where(eq(schema.jobs.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllPublicJobs(): Promise<Job[]> {
    return await db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.isPublic, true))
      .orderBy(desc(schema.jobs.createdAt));
  }

  // ============================================================================
  // PROJECT OPERATIONS
  // ============================================================================

  async getProjectsByProfessional(professionalId: string): Promise<Project[]> {
    return await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.professionalId, professionalId))
      .orderBy(desc(schema.projects.createdAt));
  }

  async getProjectsByCompany(companyId: string): Promise<Project[]> {
    return await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.companyId, companyId))
      .orderBy(desc(schema.projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.id, id))
      .limit(1);
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(schema.projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db
      .update(schema.projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.projects.id, id))
      .returning();
    return project;
  }

  // ============================================================================
  // MESSAGING OPERATIONS
  // ============================================================================

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(schema.conversations)
      .where(eq(schema.conversations.id, id))
      .limit(1);
    return conversation;
  }

  async getConversationByParticipants(participant1: string, participant2: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(schema.conversations)
      .where(
        or(
          and(
            eq(schema.conversations.participant1, participant1),
            eq(schema.conversations.participant2, participant2)
          ),
          and(
            eq(schema.conversations.participant1, participant2),
            eq(schema.conversations.participant2, participant1)
          )
        )
      )
      .limit(1);
    return conversation;
  }

  async createConversation(conversation: any): Promise<Conversation> {
    const [newConversation] = await db
      .insert(schema.conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(schema.conversations)
      .where(
        or(
          eq(schema.conversations.participant1, userId),
          eq(schema.conversations.participant2, userId)
        )
      )
      .orderBy(desc(schema.conversations.lastMessageAt));
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.conversationId, conversationId))
      .orderBy(schema.messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(schema.messages)
      .values(insertMessage)
      .returning();
    
    // Update conversation's lastMessageAt
    await db
      .update(schema.conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(schema.conversations.id, insertMessage.conversationId));
    
    return message;
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await db
      .update(schema.messages)
      .set({ isRead: true })
      .where(
        and(
          eq(schema.messages.conversationId, conversationId),
          sql`${schema.messages.senderId} != ${userId}`
        )
      );
  }

  // ============================================================================
  // REVIEW OPERATIONS
  // ============================================================================

  async getReviewsByProject(projectId: string): Promise<Review[]> {
    return await db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.projectId, projectId))
      .orderBy(desc(schema.reviews.createdAt));
  }

  async getReviewsForUser(userId: string): Promise<Review[]> {
    return await db
      .select()
      .from(schema.reviews)
      .where(eq(schema.reviews.revieweeId, userId))
      .orderBy(desc(schema.reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(schema.reviews)
      .values(insertReview)
      .returning();
    return review;
  }
}

export const storage = new DatabaseStorage();
