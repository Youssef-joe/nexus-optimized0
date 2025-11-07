// API Routes Implementation
// Reference: javascript_log_in_with_replit, javascript_stripe, javascript_openai blueprints
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import { insertProfessionalProfileSchema, insertCompanyProfileSchema, insertServiceSchema, insertJobSchema, insertProjectSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";
import Stripe from "stripe";
import OpenAI from "openai";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: Ensure user is authenticated
function ensureAuthenticated(req: Request, res: Response): boolean {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // ============================================================================
  // AUTH ROUTES
  // ============================================================================

  app.get("/api/auth/user", async (req: any, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/user/type", async (req: any, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const { userType } = req.body;
      if (!userType || !['professional', 'company'].includes(userType)) {
        return res.status(400).json({ error: "Invalid user type" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.updateUser(userId, { userType });
      res.json(user);
    } catch (error) {
      console.error("Error updating user type:", error);
      res.status(500).json({ error: "Failed to update user type" });
    }
  });

  // ============================================================================
  // PROFESSIONAL PROFILE ROUTES
  // ============================================================================

  app.get("/api/professional/profile", async (req: any, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfessionalProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching professional profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/professional/profile", async (req: any, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const userId = req.user.claims.sub;
      const validated = insertProfessionalProfileSchema.parse({
        ...req.body,
        userId,
      });

      const profile = await storage.createProfessionalProfile(validated);
      res.json(profile);
    } catch (error) {
      console.error("Error creating professional profile:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  app.patch("/api/professional/profile/:id", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { id } = req.params;
      const profile = await storage.updateProfessionalProfile(id, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Error updating professional profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.get("/api/professionals", async (req, res) => {
    try {
      const professionals = await db.query.professionalProfiles.findMany({
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: (professionals, { desc }) => [desc(professionals.averageRating)],
      });
      res.json(professionals);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      res.status(500).json({ error: "Failed to fetch professionals" });
    }
  });

  app.get("/api/professional/projects", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const profile = await storage.getProfessionalProfile(req.user!.id);
      if (!profile) {
        return res.json([]);
      }

      const projects = await db.query.projects.findMany({
        where: eq(schema.projects.professionalId, profile.id),
        with: {
          company: true,
        },
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
      });

      res.json(projects);
    } catch (error) {
      console.error("Error fetching professional projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/professional/stats", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      // Return mock stats for MVP
      res.json({
        totalEarnings: 0,
        pendingEarnings: 0,
        monthlyEarnings: 0,
      });
    } catch (error) {
      console.error("Error fetching professional stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // ============================================================================
  // COMPANY PROFILE ROUTES
  // ============================================================================

  app.get("/api/company/profile", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const profile = await storage.getCompanyProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching company profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/company/profile", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const validated = insertCompanyProfileSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });

      const profile = await storage.createCompanyProfile(validated);
      res.json(profile);
    } catch (error) {
      console.error("Error creating company profile:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  app.patch("/api/company/profile/:id", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { id } = req.params;
      const profile = await storage.updateCompanyProfile(id, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Error updating company profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.get("/api/company/jobs", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const profile = await storage.getCompanyProfile(req.user!.id);
      if (!profile) {
        return res.json([]);
      }

      const jobs = await storage.getJobsByCompany(profile.id);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching company jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/company/projects", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const profile = await storage.getCompanyProfile(req.user!.id);
      if (!profile) {
        return res.json([]);
      }

      const projects = await storage.getProjectsByCompany(profile.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching company projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // ============================================================================
  // SERVICE ROUTES
  // ============================================================================

  app.get("/api/services", async (req, res) => {
    try {
      const services = await db.query.services.findMany({
        where: eq(schema.services.isPublic, true),
        with: {
          profile: {
            with: {
              user: {
                columns: {
                  firstName: true,
                  lastName: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
        orderBy: (services, { desc }) => [desc(services.createdAt)],
      });
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/professional/services", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const profile = await storage.getProfessionalProfile(req.user!.id);
      if (!profile) {
        return res.json([]);
      }

      const services = await storage.getServicesByProfile(profile.id);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const profile = await storage.getProfessionalProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ error: "Professional profile not found" });
      }

      const validated = insertServiceSchema.parse({
        ...req.body,
        profileId: profile.id,
      });

      const service = await storage.createService(validated);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  // ============================================================================
  // JOB ROUTES
  // ============================================================================

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await db.query.jobs.findMany({
        where: eq(schema.jobs.isPublic, true),
        with: {
          company: {
            columns: {
              companyName: true,
              logoUrl: true,
            },
          },
        },
        orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
      });
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const job = await db.query.jobs.findFirst({
        where: eq(schema.jobs.id, id),
        with: {
          company: true,
        },
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const profile = await storage.getCompanyProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ error: "Company profile not found" });
      }

      const validated = insertJobSchema.parse({
        ...req.body,
        companyId: profile.id,
        postedBy: req.user!.id,
      });

      const job = await storage.createJob(validated);
      res.json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  // ============================================================================
  // PROJECT ROUTES
  // ============================================================================

  app.get("/api/projects/:id", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { id } = req.params;
      const project = await db.query.projects.findFirst({
        where: eq(schema.projects.id, id),
        with: {
          company: true,
          professional: {
            with: {
              user: true,
            },
          },
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { id } = req.params;
      const project = await storage.updateProject(id, req.body);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // ============================================================================
  // MESSAGING ROUTES
  // ============================================================================

  app.get("/api/conversations", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const conversations = await storage.getConversationsByUser(req.user!.id);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { id } = req.params;
      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { participantId } = req.body;
      
      // Check if conversation exists
      let conversation = await storage.getConversationByParticipants(req.user!.id, participantId);
      
      if (!conversation) {
        conversation = await storage.createConversation({
          participant1: req.user!.id,
          participant2: participantId,
        });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const validated = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user!.id,
      });

      const message = await storage.createMessage(validated);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // ============================================================================
  // REVIEW ROUTES
  // ============================================================================

  app.get("/api/reviews/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const reviews = await storage.getReviewsForUser(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const validated = insertReviewSchema.parse({
        ...req.body,
        reviewerId: req.user!.id,
      });

      const review = await storage.createReview(validated);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // ============================================================================
  // PAYMENT ROUTES (Stripe Integration)
  // ============================================================================

  app.post("/api/payments/create-intent", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { amount, currency, projectId } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          projectId,
          userId: req.user!.id,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // ============================================================================
  // AI MATCHING ROUTE (OpenAI Integration)
  // ============================================================================

  app.post("/api/ai/match", async (req, res) => {
    if (!ensureAuthenticated(req, res)) return;

    try {
      const { query, type } = req.body; // type: 'professional' | 'job'

      // Generate embedding for the query
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
      });

      // For MVP, return all items (would use vector similarity in production)
      if (type === 'professional') {
        const professionals = await storage.getAllProfessionals();
        res.json(professionals.slice(0, 10));
      } else {
        const jobs = await storage.getAllPublicJobs();
        res.json(jobs.slice(0, 10));
      }
    } catch (error) {
      console.error("Error in AI matching:", error);
      res.status(500).json({ error: "Failed to generate matches" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
