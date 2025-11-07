// L&D Nexus Marketplace - Complete Database Schema
// Reference: javascript_log_in_with_replit and javascript_database blueprints

import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export const userTypeEnum = pgEnum('user_type', ['professional', 'company', 'admin']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'recruiter', 'viewer']);
export const serviceFormatEnum = pgEnum('service_format', ['in-person', 'virtual', 'hybrid']);
export const pricingModelEnum = pgEnum('pricing_model', ['hourly', 'fixed', 'custom']);
export const jobTypeEnum = pgEnum('job_type', ['training', 'coaching', 'elearning', 'facilitation', 'consulting']);
export const deliveryFormatEnum = pgEnum('delivery_format', ['onsite', 'remote', 'hybrid']);
export const projectStatusEnum = pgEnum('project_status', ['pending', 'active', 'in_review', 'completed', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'held', 'released', 'refunded']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'verified', 'rejected']);
export const languageEnum = pgEnum('language', ['en', 'ar']);

// ============================================================================
// SESSION & AUTH TABLES (Required for Replit Auth)
// ============================================================================

// Session storage table (MANDATORY for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (MANDATORY for Replit Auth, extended for marketplace)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: userTypeEnum("user_type").notNull().default('professional'),
  preferredLanguage: languageEnum("preferred_language").default('en'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// PROFESSIONAL PROFILES
// ============================================================================

export const professionalProfiles = pgTable("professional_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  bio: text("bio"),
  bioAr: text("bio_ar"),
  location: varchar("location"),
  timezone: varchar("timezone"),
  languages: text("languages").array().notNull().default(sql`ARRAY[]::text[]`),
  introVideoUrl: varchar("intro_video_url"),
  linkedinUrl: varchar("linkedin_url"),
  portfolioUrl: varchar("portfolio_url"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('USD'),
  verificationStatus: verificationStatusEnum("verification_status").default('pending'),
  isTopRated: boolean("is_top_rated").default(false),
  isTrending: boolean("is_trending").default(false),
  totalProjects: integer("total_projects").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
  responseTime: integer("response_time_hours").default(24),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  name: varchar("name").notNull(),
  nameAr: varchar("name_ar"),
  issuer: varchar("issuer"),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  credentialUrl: varchar("credential_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  titleAr: varchar("title_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  fileUrl: varchar("file_url").notNull(),
  fileType: varchar("file_type"),
  thumbnailUrl: varchar("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// SERVICES
// ============================================================================

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  titleAr: varchar("title_ar"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  category: varchar("category").notNull(),
  duration: integer("duration_hours"),
  format: serviceFormatEnum("format").notNull().default('virtual'),
  pricingModel: pricingModelEnum("pricing_model").notNull().default('fixed'),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('USD'),
  deliveryTimeline: varchar("delivery_timeline"),
  deliverables: text("deliverables").array().default(sql`ARRAY[]::text[]`),
  outcomes: text("outcomes").array().default(sql`ARRAY[]::text[]`),
  mediaUrls: text("media_urls").array().default(sql`ARRAY[]::text[]`),
  isPublic: boolean("is_public").default(true),
  viewCount: integer("view_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// COMPANY PROFILES
// ============================================================================

export const companyProfiles = pgTable("company_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: varchar("company_name").notNull(),
  companyNameAr: varchar("company_name_ar"),
  logoUrl: varchar("logo_url"),
  industry: varchar("industry"),
  companySize: varchar("company_size"),
  country: varchar("country"),
  website: varchar("website"),
  billingEmail: varchar("billing_email"),
  vatNumber: varchar("vat_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companyTeamMembers = pgTable("company_team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companyProfiles.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: userRoleEnum("role").notNull().default('viewer'),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// JOBS / PROJECT POSTINGS
// ============================================================================

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companyProfiles.id, { onDelete: 'cascade' }),
  postedBy: varchar("posted_by").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  titleAr: varchar("title_ar"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  jobType: jobTypeEnum("job_type").notNull(),
  skillsRequired: text("skills_required").array().notNull().default(sql`ARRAY[]::text[]`),
  duration: varchar("duration"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default('USD'),
  deliveryFormat: deliveryFormatEnum("delivery_format").notNull().default('remote'),
  location: varchar("location"),
  startDate: timestamp("start_date"),
  deadline: timestamp("deadline"),
  languageRequirements: text("language_requirements").array().default(sql`ARRAY[]::text[]`),
  isPublic: boolean("is_public").default(true),
  isFeatured: boolean("is_featured").default(false),
  isUrgent: boolean("is_urgent").default(false),
  viewCount: integer("view_count").default(0),
  applicationCount: integer("application_count").default(0),
  embeddingVector: text("embedding_vector"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobInvitations = pgTable("job_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  profileId: varchar("profile_id").notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  message: text("message"),
  status: varchar("status").default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// PROJECTS (Hired Jobs)
// ============================================================================

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id),
  companyId: varchar("company_id").notNull().references(() => companyProfiles.id),
  professionalId: varchar("professional_id").notNull().references(() => professionalProfiles.id),
  title: varchar("title").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default('pending'),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('USD'),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectMilestones = pgTable("project_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date"),
  status: varchar("status").default('pending'),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// PAYMENTS
// ============================================================================

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  milestoneId: varchar("milestone_id").references(() => projectMilestones.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default('USD'),
  status: paymentStatusEnum("status").default('pending'),
  paidBy: varchar("paid_by").notNull().references(() => users.id),
  paidTo: varchar("paid_to").notNull().references(() => users.id),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }),
  invoiceUrl: varchar("invoice_url"),
  releasedAt: timestamp("released_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// MESSAGING
// ============================================================================

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  participant1: varchar("participant_1").notNull().references(() => users.id),
  participant2: varchar("participant_2").notNull().references(() => users.id),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  contentAr: text("content_ar"),
  fileUrls: text("file_urls").array().default(sql`ARRAY[]::text[]`),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// REVIEWS & RATINGS
// ============================================================================

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  revieweeId: varchar("reviewee_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  publicFeedback: text("public_feedback"),
  privateFeedback: text("private_feedback"),
  isVerified: boolean("is_verified").default(false),
  isModerated: boolean("is_moderated").default(false),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  titleAr: varchar("title_ar"),
  message: text("message").notNull(),
  messageAr: text("message_ar"),
  link: varchar("link"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [users.id],
    references: [professionalProfiles.userId],
  }),
  companyProfile: one(companyProfiles, {
    fields: [users.id],
    references: [companyProfiles.userId],
  }),
  notifications: many(notifications),
  sentMessages: many(messages),
}));

export const professionalProfilesRelations = relations(professionalProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [professionalProfiles.userId],
    references: [users.id],
  }),
  certifications: many(certifications),
  portfolioItems: many(portfolioItems),
  services: many(services),
  projects: many(projects),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  profile: one(professionalProfiles, {
    fields: [services.profileId],
    references: [professionalProfiles.id],
  }),
}));

export const companyProfilesRelations = relations(companyProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [companyProfiles.userId],
    references: [users.id],
  }),
  teamMembers: many(companyTeamMembers),
  jobs: many(jobs),
  projects: many(projects),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companyProfiles, {
    fields: [jobs.companyId],
    references: [companyProfiles.id],
  }),
  invitations: many(jobInvitations),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  job: one(jobs, {
    fields: [projects.jobId],
    references: [jobs.id],
  }),
  company: one(companyProfiles, {
    fields: [projects.companyId],
    references: [companyProfiles.id],
  }),
  professional: one(professionalProfiles, {
    fields: [projects.professionalId],
    references: [professionalProfiles.id],
  }),
  milestones: many(projectMilestones),
  payments: many(payments),
  reviews: many(reviews),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertProfessionalProfileSchema = createInsertSchema(professionalProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProfessionalProfile = z.infer<typeof insertProfessionalProfileSchema>;
export type ProfessionalProfile = typeof professionalProfiles.$inferSelect;

export const insertCertificationSchema = createInsertSchema(certifications).omit({ id: true, createdAt: true });
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({ id: true, createdAt: true });
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, conversionCount: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const insertCompanyProfileSchema = createInsertSchema(companyProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompanyProfile = z.infer<typeof insertCompanyProfileSchema>;
export type CompanyProfile = typeof companyProfiles.$inferSelect;

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, applicationCount: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const insertMilestoneSchema = createInsertSchema(projectMilestones).omit({ id: true, createdAt: true });
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof projectMilestones.$inferSelect;

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, isRead: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, helpfulCount: true, isModerated: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true, isRead: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
