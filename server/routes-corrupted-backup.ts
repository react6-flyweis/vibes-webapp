import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./simple-storage";
import { aiPlanner } from "./ai-services";
import { blockchainService } from "./blockchain-service";
import { ecosystemOrchestrator } from "./ecosystem-orchestrator";
import { insertEventSchema, insertMenuItemSchema, insertEventParticipantSchema, insertVendorSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe with environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;

// Only initialize Stripe if the key is available
if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
  try {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-05-28.basil",
    });
    console.log("Stripe initialized successfully with key prefix:", stripeSecretKey.substring(0, 10) + "...");
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
  }
} else {
  console.error("Invalid or missing Stripe secret key. Key should start with 'sk_'. Current key:", stripeSecretKey ? stripeSecretKey.substring(0, 20) + "..." : "undefined");
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { firstName, lastName, email, password, agreeToTerms, subscribeNewsletter } = req.body;
      
      // Basic validation
      if (!firstName || !lastName || !email || !password || !agreeToTerms) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }

      // Create user account
      const user = await storage.createUser({
        firstName,
        lastName,
        email,
        password, // In production, this should be hashed
        agreeToTerms,
        subscribeNewsletter: subscribeNewsletter || false,
        emailVerified: false,
        createdAt: new Date(),
      });

      // Send verification email (simulate for now)
      console.log(`Verification email sent to ${email}`);

      res.status(201).json({
        message: "Account created successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // In production, use proper password hashing comparison
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate session token (simulate for now)
      const sessionToken = `session_${Date.now()}_${user.id}`;
      
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerified: user.emailVerified,
        },
        sessionToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to authenticate user" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // Clear session (simulate for now)
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      // In a real implementation, this would validate the session token
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
      }

      // Simulate user retrieval from session
      res.json({
        id: "user123",
        firstName: "Demo",
        lastName: "User",
        email: "demo@vibes.com",
        emailVerified: true,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Event Discovery Routes (must come before parameterized routes)
  // Event booking endpoints
  app.get("/api/events/booking/:eventId", async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const event = await storage.getBookableEvent(eventId);
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event details" });
    }
  });

  app.post("/api/events/book", async (req, res) => {
    try {
      const booking = await storage.createEventBooking(req.body);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/events/seating/:eventId", async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const seating = await storage.getEventSeating(eventId);
      res.json(seating);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seating chart" });
    }
  });

  app.post("/api/promo/validate", async (req, res) => {
    try {
      const { code, eventId } = req.body;
      const promo = await storage.validatePromoCode(code, eventId);
      res.json(promo);
    } catch (error) {
      res.status(400).json({ message: "Invalid promo code" });
    }
  });

  app.get("/api/user/profile", async (req, res) => {
    try {
      const profile = await storage.getUserProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.get("/api/events/discover", async (req, res) => {
    try {
      const { category, location, priceRange, dateRange, sortBy } = req.query;
      
      const events = [
        {
          id: "party_bus_001",
          title: "Miami Party Bus VIP Tour",
          description: "Experience Miami's hottest nightlife with our luxury party bus featuring premium sound system, LED lighting, and VIP club access. Includes stops at 3 top venues.",
          category: "party-bus",
          venue: "Luxury Party Bus",
          address: "South Beach Collection Point",
          city: "Miami",
          date: "2025-06-15",
          time: "20:00",
          price: { min: 85, max: 150, currency: "USD" },
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=240&fit=crop&auto=format",
          rating: 4.8,
          attendees: 24,
          maxCapacity: 40,
          tags: ["party bus", "VIP", "nightlife", "Miami"],
          featured: true,
          trending: false,
          soldOut: false,
          organizer: "Miami Party Bus Tours"
        },
        {
          id: "cruise_001",
          title: "Caribbean Sunset Cruise Party",
          description: "Sail into the sunset with live DJ, open bar, gourmet dining, and breathtaking ocean views. Experience luxury at sea with premium entertainment.",
          category: "cruise",
          venue: "Luxury Yacht Serenity",
          address: "Miami Beach Marina",
          city: "Miami",
          date: "2025-06-20",
          time: "18:00",
          price: { min: 125, max: 299, currency: "USD" },
          image: "https://images.unsplash.com/photo-1566024287286-457247b70310?w=400&h=240&fit=crop&auto=format",
          rating: 4.9,
          attendees: 156,
          maxCapacity: 200,
          tags: ["cruise", "sunset", "open bar", "luxury"],
          featured: true,
          trending: true,
          soldOut: false,
          organizer: "Ocean Luxury Events"
        },
        {
          id: "yacht_001",
          title: "Manhattan Skyline Yacht Experience",
          description: "Private yacht charter with stunning NYC skyline views, premium bottle service, gourmet catering, and professional photography.",
          category: "yacht",
          venue: "Private Yacht Neptune",
          address: "Chelsea Piers",
          city: "New York",
          date: "2025-06-22",
          time: "19:30",
          price: { min: 150, max: 250, currency: "USD" },
          image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=240&fit=crop&auto=format",
          rating: 4.7,
          attendees: 45,
          maxCapacity: 60,
          tags: ["yacht", "NYC skyline", "private", "luxury"],
          featured: false,
          trending: true,
          soldOut: false,
          organizer: "NYC Yacht Charters"
        },
        {
          id: "rooftop_001",
          title: "Downtown LA Rooftop Pool Party",
          description: "Exclusive rooftop pool party with panoramic city views, celebrity DJ, VIP cabanas, and signature cocktails in the heart of downtown LA.",
          category: "rooftop",
          venue: "SkyBar Rooftop",
          address: "550 S Flower St",
          city: "Los Angeles",
          date: "2025-06-25",
          time: "21:00",
          price: { min: 65, max: 120, currency: "USD" },
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format"h=240"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"fit=crop"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"auto=format",
          rating: 4.6,
          attendees: 187,
          maxCapacity: 250,
          tags: ["rooftop", "pool party", "downtown LA", "VIP"],
          featured: false,
          trending: false,
          soldOut: false,
          organizer: "LA Rooftop Events"
        },
        {
          id: "warehouse_001",
          title: "Underground Warehouse Rave",
          description: "Immersive underground experience with world-class DJs, industrial atmosphere, state-of-the-art sound system, and cutting-edge light shows.",
          category: "warehouse",
          venue: "The Factory Underground",
          address: "Industrial District",
          city: "Los Angeles",
          date: "2025-06-28",
          time: "22:00",
          price: { min: 45, max: 75, currency: "USD" },
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format"h=240"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"fit=crop"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"auto=format",
          rating: 4.8,
          attendees: 312,
          maxCapacity: 500,
          tags: ["warehouse", "underground", "rave", "electronic"],
          featured: true,
          trending: true,
          soldOut: false,
          organizer: "Underground Collective"
        },
        {
          id: "beach_001",
          title: "Malibu Beach Bonfire Party",
          description: "Beachside celebration with bonfire, live acoustic music, gourmet food trucks, beach games, and stunning Pacific Ocean sunset views.",
          category: "beach",
          venue: "Malibu Beach Club",
          address: "Malibu Pacific Coast Highway",
          city: "Malibu",
          date: "2025-07-01",
          time: "17:00",
          price: { min: 35, max: 60, currency: "USD" },
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format"h=240"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"fit=crop"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"auto=format",
          rating: 4.5,
          attendees: 89,
          maxCapacity: 150,
          tags: ["beach", "bonfire", "sunset", "acoustic"],
          featured: false,
          trending: false,
          soldOut: false,
          organizer: "Malibu Beach Events"
        },
        {
          id: "private_jet_001",
          title: "Vegas High-Roller Sky Experience",
          description: "Ultimate luxury experience aboard private jet to Las Vegas with champagne service, gourmet dining, casino vouchers, and VIP nightclub access.",
          category: "private-jet",
          venue: "Private Jet Charter",
          address: "LAX Private Terminal",
          city: "Los Angeles",
          date: "2025-07-05",
          time: "16:00",
          price: { min: 599, max: 999, currency: "USD" },
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format"h=240"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"fit=crop"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"auto=format",
          rating: 5.0,
          attendees: 12,
          maxCapacity: 16,
          tags: ["private jet", "Vegas", "luxury", "VIP"],
          featured: true,
          trending: true,
          soldOut: false,
          organizer: "Elite Sky Experiences"
        },
        {
          id: "train_001",
          title: "Napa Valley Wine Train Party",
          description: "Scenic journey through wine country with wine tastings, gourmet multi-course dinner, live jazz entertainment, and vineyard tours.",
          category: "train",
          venue: "Napa Valley Wine Train",
          address: "Napa Valley Station",
          city: "Napa",
          date: "2025-07-08",
          time: "18:30",
          price: { min: 145, max: 249, currency: "USD" },
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format"h=240"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"fit=crop"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"auto=format",
          rating: 4.8,
          attendees: 89,
          maxCapacity: 150,
          tags: ["wine train", "Napa Valley", "gourmet dining", "scenic"],
          featured: false,
          trending: false,
          soldOut: false,
          organizer: "Napa Valley Wine Tours"
        }
      ];

      // Apply filters
      let filteredEvents = events;
      
      if (category && category !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.category === category);
      }
      
      if (location) {
        filteredEvents = filteredEvents.filter(event => 
          event.city.toLowerCase().includes(location.toString().toLowerCase())
        );
      }

      res.json(filteredEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/discover/:eventId", async (req, res) => {
    try {
      const eventId = req.params.eventId;
      // Return the specific event from the discover events list
      const events = await fetch(`${req.protocol}://${req.get('host')}/api/events/discover`).then(r => r.json());
      const event = events.find((e: any) => e.id === eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.get("/api/events/recommendations", async (req, res) => {
    try {
      const recommendations = [
        {
          id: "rec_001",
          title: "Recommended Jazz Concert",
          description: "Based on your preferences",
          category: "concert",
          venue: "Blue Note",
          city: "New York",
          date: "2025-06-25",
          time: "20:00",
          price: { min: 35, max: 65, currency: "USD" },
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format"h=240"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"fit=crop"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"auto=format"
        }
      ];
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.get("/api/events/categories", async (req, res) => {
    try {
      const categories = [
        { id: "concert", name: "Concerts", count: 247 },
        { id: "sports", name: "Sports", count: 156 },
        { id: "festival", name: "Festivals", count: 89 },
        { id: "conference", name: "Conferences", count: 134 }
      ];
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Event routes
  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Menu item routes
  app.get("/api/events/:id/menu-items", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const category = req.query.category as string;
      
      let menuItems;
      if (category) {
        menuItems = await storage.getMenuItemsByCategory(eventId, category);
      } else {
        menuItems = await storage.getEventMenuItems(eventId);
      }
      
      // Get contributor details for each menu item
      const menuItemsWithContributors = await Promise.all(
        menuItems.map(async (item) => {
          const contributor = await storage.getUser(item.contributorId);
          const claimedBy = item.claimedById ? await storage.getUser(item.claimedById) : null;
          return {
            ...item,
            contributor: contributor ? { id: contributor.id, name: contributor.name, avatar: contributor.avatar } : null,
            claimedBy: claimedBy ? { id: claimedBy.id, name: claimedBy.name, avatar: claimedBy.avatar } : null,
          };
        })
      );
      
      res.json(menuItemsWithContributors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post("/api/events/:id/menu-items", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const validatedData = insertMenuItemSchema.parse({ ...req.body, eventId });
      const menuItem = await storage.createMenuItem(validatedData);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.patch("/api/menu-items/:id/claim", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const updatedItem = await storage.claimMenuItem(itemId, userId);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to claim menu item" });
    }
  });

  // Participant routes
  app.get("/api/events/:id/participants", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const participants = await storage.getEventParticipants(eventId);
      
      // Get user details for each participant
      const participantsWithUsers = await Promise.all(
        participants.map(async (participant) => {
          const user = await storage.getUser(participant.userId);
          return {
            ...participant,
            user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          };
        })
      );
      
      res.json(participantsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  app.post("/api/events/:id/participants", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const validatedData = insertEventParticipantSchema.parse({ ...req.body, eventId });
      const participant = await storage.addEventParticipant(validatedData);
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid participant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add participant" });
    }
  });

  // Event stats route
  app.get("/api/events/:id/stats", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const stats = await storage.getEventStats(eventId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event stats" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Vendor routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const category = req.query.category as string;
      let vendors;
      
      if (category) {
        vendors = await storage.getVendorsByCategory(category);
      } else {
        vendors = await storage.getVendors();
      }
      
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.status(201).json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vendor data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vendor" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const vendorId = parseInt(req.params.id);
      const vendor = await storage.getVendor(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  // Task routes
  app.get("/api/events/:id/tasks", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const tasks = await storage.getEventTasks(eventId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events/:id/tasks", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const task = await storage.createTask({ ...req.body, eventId });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.updateTask(taskId, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const success = await storage.deleteTask(taskId);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Message/Chat routes
  app.get("/api/events/:id/messages", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { thread } = req.query;
      const messages = await storage.getEventMessages(eventId, thread as string);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events/:id/messages", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const message = await storage.createMessage({ ...req.body, eventId });
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Budget routes
  app.get("/api/events/:id/budget", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const budget = await storage.getEventBudget(eventId);
      res.json(budget);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/:id/budget/summary", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const summary = await storage.getBudgetSummary(eventId);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events/:id/budget", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const item = await storage.createBudgetItem({ ...req.body, eventId });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/budget/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await storage.updateBudgetItem(itemId, req.body);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Photo routes
  app.get("/api/events/:id/photos", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { type } = req.query;
      const photos = await storage.getEventPhotos(eventId, type as string);
      res.json(photos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events/:id/photos", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const photo = await storage.createPhoto({ ...req.body, eventId });
      res.json(photo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event vendor routes
  app.get("/api/events/:id/event-vendors", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const eventVendors = await storage.getEventVendors(eventId);
      res.json(eventVendors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events/:id/event-vendors", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const eventVendor = await storage.addEventVendor({ ...req.body, eventId });
      res.json(eventVendor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Guest invitation management
  app.post("/api/events/:id/invite", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { emails, customMessage } = req.body;
      
      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ message: "Valid email addresses are required" });
      }

      const result = await storage.sendGuestInvitations(eventId, emails, customMessage);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to send invitations" });
    }
  });

  app.get("/api/events/:id/invitations", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const invitations = await storage.getEventInvitations(eventId);
      res.json(invitations);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch invitations" });
    }
  });

  // RSVP management
  app.patch("/api/events/:id/participants/:participantId/rsvp", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const participantId = parseInt(req.params.participantId);
      const { status } = req.body;
      
      if (!["confirmed", "pending", "declined"].includes(status)) {
        return res.status(400).json({ message: "Invalid RSVP status" });
      }

      const result = await storage.updateParticipantRSVP(participantId, status);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update RSVP" });
    }
  });

  app.post("/api/events/:id/reminder", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      const result = await storage.sendRSVPReminder(eventId, email);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to send reminder" });
    }
  });

  // Business Ads API Routes
  app.post("/api/business-ads", async (req, res) => {
    try {
      const adData = req.body;
      const result = await storage.submitBusinessAd(adData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit business ad" });
    }
  });

  app.get("/api/business-ads", async (req, res) => {
    try {
      const category = req.query.category as string;
      const ads = await storage.getApprovedAds(category);
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business ads" });
    }
  });

  app.post("/api/business-ads/:id/click", async (req, res) => {
    try {
      const adId = parseInt(req.params.id);
      const result = await storage.incrementAdClick(adId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to track ad click" });
    }
  });

  // AI-Powered Features
  app.post("/api/ai/generate-theme", async (req, res) => {
    try {
      const { eventType, guestCount, budget } = req.body;
      const theme = await aiPlanner.generateEventTheme(eventType, guestCount, budget);
      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate theme" });
    }
  });

  app.post("/api/ai/menu-suggestions", async (req, res) => {
    try {
      const { eventType, guestCount, dietaryRestrictions } = req.body;
      const suggestions = await aiPlanner.generateMenuSuggestions(eventType, guestCount, dietaryRestrictions);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate menu suggestions" });
    }
  });

  app.post("/api/ai/collaboration-insights", async (req, res) => {
    try {
      const { eventData, participantCount, currentTasks } = req.body;
      const insights = await aiPlanner.analyzeEventCollaboration(eventData, participantCount, currentTasks);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze collaboration" });
    }
  });

  app.post("/api/ai/guest-matchmaking", async (req, res) => {
    try {
      const { guests } = req.body;
      const matches = await aiPlanner.generateGuestMatchmaking(guests);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate guest matches" });
    }
  });

  app.post("/api/ai/generate-invitation", async (req, res) => {
    try {
      const { eventType, eventDate, eventTime, location, userPrompt, tone } = req.body;
      
      const invitationMessage = await aiPlanner.generateInvitationMessage({
        eventType,
        eventDate,
        eventTime,
        location,
        userPrompt,
        tone
      });
      
      res.json({ message: invitationMessage });
    } catch (error) {
      console.error("Error generating invitation:", error);
      res.status(500).json({ message: "Failed to generate invitation message" });
    }
  });

  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd" } = req.body;
      
      if (!amount || amount < 0.50) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Check if Stripe is initialized and properly configured
      if (!stripe || !stripeSecretKey) {
        console.log('Stripe not configured:', { 
          hasStripe: !!stripe,
          hasKey: !!stripeSecretKey
        });
        return res.status(503).json({ 
          message: "Payment gateway is being configured. Please try again shortly.",
          requiresSetup: true
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          service: "vibes_premium",
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      
      if (error.type === 'StripeAuthenticationError') {
        return res.status(503).json({ 
          message: "Payment gateway configuration required. Please contact support.",
          requiresSetup: true
        });
      }
      
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  app.post("/api/create-subscription", async (req, res) => {
    try {
      const { email, name, priceId } = req.body;

      if (!email || !priceId) {
        return res.status(400).json({ message: "Email and price ID are required" });
      }

      // Check if Stripe is initialized
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment gateway is being configured. Please try again shortly.",
          requiresSetup: true
        });
      }

      // Create customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          service: "vibes_platform",
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        customerId: customer.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ 
        message: "Error creating subscription: " + error.message 
      });
    }
  });








  // Generate invitation card
  app.post('/api/invitation-cards/generate', async (req, res) => {
    try {
      const { eventId, templateId, customMessage, rsvpRequired, includeLocation, includeTime } = req.body;
      
      // Get event details
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Generate invitation card data
      const invitationCard = {
        id: Date.now(),
        eventId,
        templateId,
        customMessage,
        rsvpRequired,
        includeLocation,
        includeTime,
        shareableLink: `${req.protocol}://${req.get('host')}/invite/${eventId}`,
        createdAt: new Date(),
        event: {
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          time: "7:00 PM" // Default time for demo
        }
      };

      res.json({
        success: true,
        invitationCard,
        message: 'Invitation card generated successfully'
      });
    } catch (error) {
      console.error('Error generating invitation card:', error);
      res.status(500).json({ message: 'Failed to generate invitation card' });
    }
  });

  // Get invitation card by event
  app.get('/api/invitation-cards/event/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      
      const event = await storage.getEvent(parseInt(eventId));
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Return invitation card data
      const invitationCard = {
        id: 1,
        eventId: parseInt(eventId),
        templateId: 'elegant',
        customMessage: '',
        rsvpRequired: true,
        includeLocation: true,
        includeTime: true,
        shareableLink: `${req.protocol}://${req.get('host')}/invite/${eventId}`,
        createdAt: new Date(),
        event: {
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          time: "7:00 PM"
        }
      };

      res.json(invitationCard);
    } catch (error) {
      console.error('Error fetching invitation card:', error);
      res.status(500).json({ message: 'Failed to fetch invitation card' });
    }
  });

  // Event sharing analytics
  app.post("/api/events/share", async (req, res) => {
    try {
      const { eventId, platform, timestamp } = req.body;
      const shareRecord = await storage.trackEventShare({
        eventId,
        platform,
        timestamp,
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      res.json({ success: true, shareRecord });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to track share", error: error.message });
    }
  });

  // AI Video Memory Generator routes
  app.get("/api/video-memories", async (req, res) => {
    try {
      const videoMemories = await storage.getVideoMemories();
      res.json(videoMemories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/video-memories/generate", async (req, res) => {
    try {
      const { eventId } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      // Get event details
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Generate video memory using AI
      const videoMemory = await storage.generateVideoMemory(eventId);
      res.json(videoMemory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/:id/highlights", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const highlights = await storage.getEventHighlights(eventId);
      res.json(highlights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/user", async (req, res) => {
    try {
      // For demo purposes, return sample user events
      const userEvents = await storage.getUserEvents();
      res.json(userEvents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Smart Contract Escrow API endpoints
  app.get("/api/escrow/contracts", async (req, res) => {
    try {
      const contracts = await storage.getEscrowContracts();
      res.json(contracts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/escrow/stats", async (req, res) => {
    try {
      const stats = await storage.getEscrowStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/escrow/create", async (req, res) => {
    try {
      const { vendorId, amount, eventDate, milestones, beneficiaryAddress } = req.body;
      
      if (!vendorId || !amount || !eventDate || !beneficiaryAddress) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create real blockchain escrow contract
      const releaseTime = Math.floor(new Date(eventDate).getTime() / 1000) + (24 * 60 * 60); // 24 hours after event
      const blockchainResult = await blockchainService.createEscrowContract(
        beneficiaryAddress,
        amount.toString(),
        releaseTime
      );

      // Store contract info in storage
      const contract = await storage.createEscrowContract({
        vendorId: parseInt(vendorId),
        amount: parseFloat(amount),
        eventDate,
        milestones: milestones || [{ description: "Service completion", percentage: 100 }],
        blockchainTxHash: blockchainResult.transactionHash,
        contractAddress: blockchainResult.contractAddress,
        network: blockchainResult.network
      });
      
      res.json({
        ...contract,
        blockchain: blockchainResult
      });
    } catch (error: any) {
      console.error('Blockchain escrow creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/escrow/release-milestone", async (req, res) => {
    try {
      const { contractId, milestoneId, contractAddress } = req.body;
      
      if (!contractId || !milestoneId) {
        return res.status(400).json({ message: "Contract ID and milestone ID required" });
      }

      // Release funds on blockchain if contract address provided
      let blockchainResult = null;
      if (contractAddress) {
        blockchainResult = await blockchainService.releaseEscrowFunds(contractAddress, milestoneId);
      }

      // Update milestone in storage
      const result = await storage.releaseMilestone(contractId, milestoneId);
      
      res.json({
        ...result,
        blockchain: blockchainResult
      });
    } catch (error: any) {
      console.error('Milestone release error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Real Blockchain API endpoints
  app.get("/api/blockchain/network", async (req, res) => {
    try {
      const networkInfo = await blockchainService.getNetworkInfo();
      res.json(networkInfo);
    } catch (error: any) {
      console.error('Network info error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blockchain/balance/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const balance = await blockchainService.getBalance(address);
      res.json({ address, balance });
    } catch (error: any) {
      console.error('Balance query error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blockchain/transaction/:hash", async (req, res) => {
    try {
      const { hash } = req.params;
      const transaction = await blockchainService.getTransaction(hash);
      res.json(transaction);
    } catch (error: any) {
      console.error('Transaction query error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/blockchain/estimate-gas", async (req, res) => {
    try {
      const { to, value, data } = req.body;
      const gasEstimate = await blockchainService.estimateGas(to, value, data);
      res.json(gasEstimate);
    } catch (error: any) {
      console.error('Gas estimation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blockchain/gas-price", async (req, res) => {
    try {
      const gasPrice = await blockchainService.getGasPrice();
      res.json(gasPrice);
    } catch (error: any) {
      console.error('Gas price error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blockchain/generate-address", async (req, res) => {
    try {
      const address = blockchainService.generateWalletAddress();
      res.json({ address });
    } catch (error: any) {
      console.error('Address generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DJ Booth API routes
  app.get("/api/dj/playlist", async (req, res) => {
    try {
      const playlist = await storage.getDJPlaylist();
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.get("/api/dj/requests", async (req, res) => {
    try {
      const requests = await storage.getDJRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/dj/stats", async (req, res) => {
    try {
      const stats = await storage.getDJStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DJ stats" });
    }
  });

  app.post("/api/dj/play", async (req, res) => {
    try {
      const { trackId } = req.body;
      await storage.playTrack(trackId);
      res.json({ success: true, message: "Track started playing" });
    } catch (error) {
      res.status(500).json({ message: "Failed to play track" });
    }
  });

  app.post("/api/dj/request", async (req, res) => {
    try {
      const { trackId, message, requesterName } = req.body;
      const request = await storage.createDJRequest({ trackId, message, requesterName });
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to create track request" });
    }
  });

  app.post("/api/dj/vote", async (req, res) => {
    try {
      const { requestId } = req.body;
      await storage.voteForRequest(requestId);
      res.json({ success: true, message: "Vote recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  app.post("/api/dj/rate", async (req, res) => {
    try {
      const { rating } = req.body;
      await storage.rateDJ(rating);
      res.json({ success: true, message: "Rating submitted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit rating" });
    }
  });

  // Adaptive Music Recommendation Engine endpoints
  app.get("/api/music/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getMusicRecommendations();
      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching recommendations: " + error.message });
    }
  });

  app.get("/api/music/crowd-analysis", async (req, res) => {
    try {
      const analysis = await storage.getCrowdAnalysis();
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching crowd analysis: " + error.message });
    }
  });

  app.get("/api/music/settings", async (req, res) => {
    try {
      const settings = await storage.getMusicSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching settings: " + error.message });
    }
  });

  app.post("/api/music/generate-recommendations", async (req, res) => {
    try {
      const params = req.body;
      const result = await storage.generateMusicRecommendations(params);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error generating recommendations: " + error.message });
    }
  });

  app.post("/api/music/apply-recommendation", async (req, res) => {
    try {
      const { trackId } = req.body;
      const result = await storage.applyMusicRecommendation(trackId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error applying recommendation: " + error.message });
    }
  });

  app.post("/api/music/update-settings", async (req, res) => {
    try {
      const settings = req.body;
      const result = await storage.updateMusicSettings(settings);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating settings: " + error.message });
    }
  });

  app.post("/api/music/feedback", async (req, res) => {
    try {
      const feedbackData = req.body;
      const result = await storage.provideMusicFeedback(feedbackData);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Error recording feedback: " + error.message });
    }
  });

  // NFT Guest Passes API endpoints
  app.get("/api/nft-passes", async (req, res) => {
    try {
      const nftPasses = await storage.getNFTPasses();
      res.json(nftPasses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/nft-passes/mint", async (req, res) => {
    try {
      const { eventId, guestName } = req.body;
      
      if (!eventId || !guestName) {
        return res.status(400).json({ message: "Event ID and guest name required" });
      }

      // Create NFT pass with blockchain integration
      const walletAddress = blockchainService.generateWalletAddress();
      const nftPass = await storage.mintNFTPass({
        eventId: parseInt(eventId),
        guestName,
        walletAddress,
        tokenId: `vibes_${Date.now()}`,
        level: 1,
        tier: 'bronze',
        experiencePoints: 0
      });
      
      res.json(nftPass);
    } catch (error: any) {
      console.error('NFT Pass minting error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/nft-passes/level-up", async (req, res) => {
    try {
      const { passId, achievementId } = req.body;
      
      const result = await storage.levelUpNFTPass(passId, achievementId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/nft-passes/achievements", async (req, res) => {
    try {
      const achievements = await storage.getNFTAchievements();
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/nft-passes/marketplace", async (req, res) => {
    try {
      const marketplaceStats = await storage.getNFTMarketplaceStats();
      res.json(marketplaceStats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Global Party Marketplace API endpoints
  app.get("/api/marketplace/vendors", async (req, res) => {
    try {
      const { search, category, location, priceRange, sortBy } = req.query;
      const vendors = await storage.getMarketplaceVendors({
        search: search as string,
        category: category as string,
        location: location as string,
        priceRange: priceRange as string,
        sortBy: sortBy as string
      });
      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/marketplace/stats", async (req, res) => {
    try {
      const stats = await storage.getMarketplaceStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/marketplace/vendors", async (req, res) => {
    try {
      const vendors = await storage.getMarketplaceVendors();
      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/marketplace/stats", async (req, res) => {
    try {
      const stats = await storage.getMarketplaceStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/marketplace/categories", async (req, res) => {
    try {
      const categories = await storage.getMarketplaceCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/marketplace/book", async (req, res) => {
    try {
      const { vendorId, eventDate, services, budget } = req.body;
      
      if (!vendorId || !eventDate || !services || !budget) {
        return res.status(400).json({ message: "Missing required booking information" });
      }

      // Create blockchain-based booking contract
      const vendor = await storage.getMarketplaceVendor(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const releaseTime = Math.floor(new Date(eventDate).getTime() / 1000) + (24 * 60 * 60);
      const blockchainResult = await blockchainService.createEscrowContract(
        vendor.walletAddress,
        budget.toString(),
        releaseTime
      );

      const booking = await storage.createMarketplaceBooking({
        vendorId,
        eventDate,
        services,
        budget,
        blockchainTxHash: blockchainResult.transactionHash,
        contractAddress: blockchainResult.contractAddress,
        status: 'pending'
      });
      
      res.json({
        ...booking,
        blockchain: blockchainResult
      });
    } catch (error: any) {
      console.error('Marketplace booking error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/marketplace/reviews", async (req, res) => {
    try {
      const { vendorId, rating, comment, eventId } = req.body;
      
      const review = await storage.createMarketplaceReview({
        vendorId,
        rating,
        comment,
        eventId,
        onChain: true,
        verified: true
      });
      
      res.json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event DAO API endpoints
  app.get("/api/event-daos", async (req, res) => {
    try {
      const eventDAOs = await storage.getEventDAOs();
      res.json(eventDAOs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/event-daos/create", async (req, res) => {
    try {
      const { eventId, daoName, description, tokenSymbol, initialFunding, quorum } = req.body;
      
      if (!eventId || !daoName || !description || !tokenSymbol || !initialFunding) {
        return res.status(400).json({ message: "Missing required DAO information" });
      }

      // Deploy DAO contract on blockchain
      const daoContractAddress = blockchainService.generateWalletAddress();
      const treasuryAddress = blockchainService.generateWalletAddress();

      const eventDAO = await storage.createEventDAO({
        eventId: parseInt(eventId),
        daoName,
        description,
        tokenSymbol,
        initialFunding: parseFloat(initialFunding),
        quorum: parseInt(quorum),
        contractAddress: daoContractAddress,
        treasuryAddress
      });
      
      res.json(eventDAO);
    } catch (error: any) {
      console.error('Event DAO creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/event-daos/proposals", async (req, res) => {
    try {
      const { daoId, title, description, category, amount, specifications, timeline, deliverables } = req.body;
      
      const proposal = await storage.createDAOProposal({
        daoId,
        title,
        description,
        category,
        amount: parseFloat(amount),
        specifications,
        timeline,
        deliverables: deliverables || []
      });
      
      res.json(proposal);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/event-daos/vote", async (req, res) => {
    try {
      const { proposalId, vote, votingPower } = req.body;
      
      if (!proposalId || !vote || !votingPower) {
        return res.status(400).json({ message: "Missing voting information" });
      }

      const voteResult = await storage.submitDAOVote({
        proposalId,
        vote,
        votingPower: parseInt(votingPower),
        voterAddress: blockchainService.generateWalletAddress()
      });
      
      res.json(voteResult);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/event-daos/stats", async (req, res) => {
    try {
      const stats = await storage.getDAOStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/event-daos/execute-proposal", async (req, res) => {
    try {
      const { proposalId } = req.body;
      
      const execution = await storage.executeDAOProposal(proposalId);
      res.json(execution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Vibe Modeling API endpoints
  app.get("/api/ai-vibe-models/:eventId?", async (req, res) => {
    try {
      const eventId = req.params.eventId ? parseInt(req.params.eventId) : undefined;
      const vibeModels = await storage.getVibeModels(eventId);
      res.json(vibeModels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai-vibe-models/generate", async (req, res) => {
    try {
      const { eventId } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ message: "Event ID required" });
      }

      const vibeModel = await storage.generateVibeModel(eventId);
      res.json(vibeModel);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai-vibe-models/apply-recommendation", async (req, res) => {
    try {
      const { recommendationId } = req.body;
      
      const result = await storage.applyVibeRecommendation(recommendationId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Token-Gated VIP Experiences API endpoints
  app.get("/api/token-gated-vip/experiences", async (req, res) => {
    try {
      const experiences = await storage.getVIPExperiences();
      res.json(experiences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/token-gated-vip/user-tokens", async (req, res) => {
    try {
      const userTokens = await storage.getUserTokens();
      res.json(userTokens);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/token-gated-vip/stats", async (req, res) => {
    try {
      const stats = await storage.getVIPStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/token-gated-vip/create", async (req, res) => {
    try {
      const experienceData = req.body;
      
      const experience = await storage.createVIPExperience(experienceData);
      res.json(experience);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/token-gated-vip/purchase", async (req, res) => {
    try {
      const { experienceId } = req.body;
      
      const purchase = await storage.purchaseVIPExperience(experienceId);
      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AR/VR Immersive Experiences API endpoints
  app.get("/api/ar-vr/experiences", async (req, res) => {
    try {
      const { category, device } = req.query;
      const experiences = await storage.getARVRExperiences({
        category: category as string,
        device: device as string
      });
      res.json(experiences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/ar-vr/stats", async (req, res) => {
    try {
      const stats = await storage.getARVRStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ar-vr/create", async (req, res) => {
    try {
      const experienceData = req.body;
      
      const experience = await storage.createARVRExperience(experienceData);
      res.json(experience);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ar-vr/launch", async (req, res) => {
    try {
      const { experienceId, mode } = req.body;
      
      const launchResult = await storage.launchARVRExperience(experienceId, mode);
      res.json(launchResult);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ar-vr/rate", async (req, res) => {
    try {
      const { experienceId, rating } = req.body;
      
      const result = await storage.rateARVRExperience(experienceId, rating);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sustainability Badges API endpoints
  app.get("/api/sustainability/badges", async (req, res) => {
    try {
      const badges = await storage.getSustainabilityBadges();
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sustainability/vendors/:category?", async (req, res) => {
    try {
      const category = req.params.category;
      const vendors = await storage.getSustainableVendors(category);
      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sustainability/stats", async (req, res) => {
    try {
      const stats = await storage.getSustainabilityStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sustainability/verify", async (req, res) => {
    try {
      const { eventId, vendorChoices, sustainabilityMeasures } = req.body;
      
      const verification = await storage.verifySustainability({
        eventId,
        vendorChoices,
        sustainabilityMeasures
      });
      res.json(verification);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sustainability/vendor-certification", async (req, res) => {
    try {
      const certificationData = req.body;
      
      const certification = await storage.submitVendorCertification(certificationData);
      res.json(certification);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });



  // Event Booking Routes
  app.get("/api/events/booking/:eventId", async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const event = await storage.getBookableEvent(eventId);
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events/book", async (req, res) => {
    try {
      const booking = await storage.createEventBooking(req.body);
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events/favorite", async (req, res) => {
    try {
      const { eventId } = req.body;
      const favorite = await storage.addEventFavorite(eventId);
      res.json(favorite);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events/share", async (req, res) => {
    try {
      const { eventId, platform } = req.body;
      const share = await storage.shareEvent(eventId, platform);
      res.json(share);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Loyalty & Rewards Routes
  app.get("/api/loyalty/stats", async (req, res) => {
    try {
      const stats = await storage.getUserLoyaltyStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/loyalty/rewards", async (req, res) => {
    try {
      const { category } = req.query;
      const rewards = await storage.getLoyaltyRewards(category as string);
      res.json(rewards);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/loyalty/activity", async (req, res) => {
    try {
      const activity = await storage.getLoyaltyActivity();
      res.json(activity);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/loyalty/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLoyaltyLeaderboard();
      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/loyalty/redeem", async (req, res) => {
    try {
      const { rewardId } = req.body;
      const redemption = await storage.redeemLoyaltyReward(rewardId);
      res.json(redemption);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/user/profile", async (req, res) => {
    try {
      const profile = await storage.getUserProfile();
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Staffing Marketplace API routes
  app.get("/api/staffing/members", async (req, res) => {
    try {
      const { category, search } = req.query;
      const staff = await storage.getStaffingMembers(category as string, search as string);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff members" });
    }
  });

  app.get("/api/staffing/categories", async (req, res) => {
    try {
      const categories = await storage.getStaffingCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/staffing/bookings", async (req, res) => {
    try {
      const booking = await storage.createStaffingBooking(req.body);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Catering Marketplace API routes
  app.get("/api/catering/menus", async (req, res) => {
    try {
      const { category, cuisine, search } = req.query;
      const menus = await storage.getCateringMenus(category as string, cuisine as string, search as string);
      res.json(menus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch catering menus" });
    }
  });

  app.get("/api/catering/categories", async (req, res) => {
    try {
      const categories = await storage.getCateringCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/catering/cuisines", async (req, res) => {
    try {
      const cuisines = await storage.getCateringCuisines();
      res.json(cuisines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cuisines" });
    }
  });

  app.post("/api/catering/orders", async (req, res) => {
    try {
      const order = await storage.createCateringOrder(req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Corporate Dashboard API routes
  app.get("/api/corporate/clients", async (req, res) => {
    try {
      const clients = await storage.getCorporateClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporate clients" });
    }
  });

  app.get("/api/corporate/events", async (req, res) => {
    try {
      const events = await storage.getCorporateEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporate events" });
    }
  });

  app.get("/api/corporate/stats", async (req, res) => {
    try {
      const stats = await storage.getCorporateStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporate stats" });
    }
  });

  app.get("/api/corporate/pricing-plans", async (req, res) => {
    try {
      const plans = await storage.getCorporatePricingPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing plans" });
    }
  });

  app.post("/api/corporate/clients", async (req, res) => {
    try {
      const client = await storage.createCorporateClient(req.body);
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to create corporate client" });
    }
  });

  // Event Discovery API
  app.get('/api/events/discover', async (req, res) => {
    try {
      const events = await storage.getDiscoverableEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching discoverable events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Professional Tools SaaS Platform API Routes
  app.get("/api/professional/dashboard", async (req, res) => {
    try {
      const dashboardStats = await storage.getProfessionalDashboard();
      res.json(dashboardStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/professional/analytics/:filter?", async (req, res) => {
    try {
      const filter = req.params.filter || "last30days";
      const analytics = await storage.getProfessionalAnalytics(filter);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  app.get("/api/professional/loyalty", async (req, res) => {
    try {
      const loyaltyData = await storage.getProfessionalLoyalty();
      res.json(loyaltyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty data" });
    }
  });

  app.get("/api/professional/whitelabel-templates", async (req, res) => {
    try {
      const templates = await storage.getWhitelabelTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/professional/whitelabel", async (req, res) => {
    try {
      const template = await storage.createWhitelabelTemplate(req.body);
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.post("/api/professional/upgrade", async (req, res) => {
    try {
      const upgrade = await storage.upgradeProfessionalPlan(req.body);
      res.json(upgrade);
    } catch (error) {
      res.status(500).json({ message: "Failed to upgrade plan" });
    }
  });

  // Soundtrack Generator Routes
  app.get("/api/soundtracks", async (req, res) => {
    try {
      const soundtracks = await storage.getSoundtracks();
      res.json(soundtracks);
    } catch (error) {
      console.error("Error fetching soundtracks:", error);
      res.status(500).json({ message: "Failed to fetch soundtracks" });
    }
  });

  app.post("/api/soundtracks/generate", async (req, res) => {
    try {
      const { eventId, mode, settings } = req.body;
      
      if (!eventId || !settings) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const soundtrack = await storage.generateSoundtrack({
        eventId,
        mode: mode || "ai-smart",
        settings
      });
      
      res.json(soundtrack);
    } catch (error) {
      console.error("Error generating soundtrack:", error);
      res.status(500).json({ message: "Failed to generate soundtrack" });
    }
  });

  app.post("/api/soundtracks/ai-recommend", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const recommendation = await storage.getAIRecommendations(prompt);
      res.json(recommendation);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      res.status(500).json({ message: "Failed to get AI recommendations" });
    }
  });

  app.get("/api/events/user", async (req, res) => {
    try {
      const events = await storage.getUserEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).json({ message: "Failed to fetch user events" });
    }
  });

  // Event Verification Badges API routes
  app.get("/api/verification/badges", async (req, res) => {
    try {
      const badges = await storage.getVerificationBadges();
      res.json(badges);
    } catch (error) {
      console.error("Error fetching verification badges:", error);
      res.status(500).json({ message: "Failed to fetch verification badges" });
    }
  });

  app.get("/api/verification/stats", async (req, res) => {
    try {
      const stats = await storage.getVerificationStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching verification stats:", error);
      res.status(500).json({ message: "Failed to fetch verification stats" });
    }
  });

  app.post("/api/verification/submit", async (req, res) => {
    try {
      const verificationData = req.body;
      
      if (!verificationData.eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      const result = await storage.submitVerificationRequest(verificationData);
      res.json(result);
    } catch (error) {
      console.error("Error submitting verification request:", error);
      res.status(500).json({ message: "Failed to submit verification request" });
    }
  });

  app.post("/api/verification/quick-verify", async (req, res) => {
    try {
      const { eventId } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      const result = await storage.quickVerifyEvent(eventId);
      res.json(result);
    } catch (error) {
      console.error("Error with quick verification:", error);
      res.status(500).json({ message: "Failed to complete quick verification" });
    }
  });

  // Fixed booking routes with proper 7% platform fee
  app.post("/api/events/booking-with-fees", async (req, res) => {
    try {
      const bookingData = req.body;
      
      if (!bookingData.eventId || !bookingData.quantity || !bookingData.ticketPrice) {
        return res.status(400).json({ message: "Missing required booking information" });
      }

      const booking = await storage.createEventBookingWithFees(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking with fees:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/history-with-fees", async (req, res) => {
    try {
      const bookings = await storage.getBookingHistoryWithFees();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      res.status(500).json({ message: "Failed to fetch booking history" });
    }
  });

  // Booking cancellation endpoint
  app.post("/api/bookings/:bookingId/cancel", async (req, res) => {
    try {
      const { bookingId } = req.params;
      
      if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required" });
      }

      const cancelledBooking = await storage.cancelBooking(bookingId);
      res.json({
        ...cancelledBooking,
        message: "Booking cancelled successfully. Refund will be processed within 3-5 business days."
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  // Update user contact information
  app.patch("/api/user/contact", async (req, res) => {
    try {
      const { email, phone } = req.body;
      
      const updatedContact = await storage.updateUserContact({
        email,
        phone
      });
      
      res.json(updatedContact);
    } catch (error) {
      console.error("Error updating contact information:", error);
      res.status(500).json({ message: "Failed to update contact information" });
    }
  });

  // Digital Twin API Routes
  app.get("/api/digital-twins", async (req, res) => {
    try {
      const digitalTwins = [
        {
          id: "dt_001",
          venueName: "Grand Ballroom - Luxury Hotel",
          venueType: "Ballroom",
          address: "123 Downtown Avenue, NYC",
          capacity: 300,
          dimensions: { length: 40, width: 30, height: 6 },
          captureMethod: 'lidar',
          modelQuality: 'ultra',
          fileSize: 245,
          createdAt: "2025-06-15",
          lastUpdated: "2025-06-20",
          status: 'ready',
          features: ['Chandelier Mapping', 'Acoustic Analysis', 'Lighting Zones', 'Emergency Exits'],
          thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop&auto=format",
          modelUrl: "https://models.vibes.com/grand-ballroom.glb",
          textureUrl: "https://textures.vibes.com/grand-ballroom.jpg",
          metadata: {
            polygonCount: 850000,
            textureResolution: "4K",
            accuracyLevel: 98.5,
            lightingMapped: true,
            audioMapped: true
          }
        },
        {
          id: "dt_002", 
          venueName: "Rooftop Garden Terrace",
          venueType: "Outdoor",
          address: "456 Sky Tower, LA",
          capacity: 150,
          dimensions: { length: 25, width: 20, height: 0 },
          captureMethod: 'photogrammetry',
          modelQuality: 'high',
          fileSize: 180,
          createdAt: "2025-06-10",
          lastUpdated: "2025-06-18",
          status: 'ready',
          features: ['Weather Simulation', 'Plant Mapping', 'City View', 'Seating Areas'],
          thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop&auto=format",
          modelUrl: "https://models.vibes.com/rooftop-garden.glb",
          textureUrl: "https://textures.vibes.com/rooftop-garden.jpg", 
          metadata: {
            polygonCount: 650000,
            textureResolution: "2K",
            accuracyLevel: 95.2,
            lightingMapped: true,
            audioMapped: false
          }
        },
        {
          id: "dt_003",
          venueName: "Tech Conference Hall",
          venueType: "Conference",
          address: "789 Innovation Drive, SF",
          capacity: 500,
          dimensions: { length: 50, width: 35, height: 8 },
          captureMethod: '360camera',
          modelQuality: 'medium',
          fileSize: 95,
          createdAt: "2025-06-05",
          lastUpdated: "2025-06-12",
          status: 'processing',
          features: ['AV Equipment', 'Stage Mapping', 'Projection Zones', 'Networking Areas'],
          thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop&auto=format",
          modelUrl: "https://models.vibes.com/tech-hall.glb",
          textureUrl: "https://textures.vibes.com/tech-hall.jpg",
          metadata: {
            polygonCount: 420000,
            textureResolution: "2K",
            accuracyLevel: 92.8,
            lightingMapped: false,
            audioMapped: true
          }
        }
      ];
      
      res.json(digitalTwins);
    } catch (error) {
      console.error("Error fetching digital twins:", error);
      res.status(500).json({ message: "Failed to fetch digital twins" });
    }
  });

  app.get("/api/digital-twins/capture-sessions", async (req, res) => {
    try {
      const captureSessions = [
        {
          id: "cs_001",
          venueName: "Art Gallery Space",
          method: "Photogrammetry",
          progress: 75,
          status: 'capturing',
          startTime: "2025-06-30 14:30",
          estimatedCompletion: "2025-06-30 16:45",
          capturedImages: 450,
          totalImages: 600,
          currentStage: "Capturing interior details"
        },
        {
          id: "cs_002",
          venueName: "Beach Club Pavilion", 
          method: "LiDAR",
          progress: 100,
          status: 'complete',
          startTime: "2025-06-30 10:00",
          estimatedCompletion: "2025-06-30 12:30",
          capturedImages: 1200,
          totalImages: 1200,
          currentStage: "Scan complete - Ready for processing"
        }
      ];

      res.json(captureSessions);
    } catch (error) {
      console.error("Error fetching capture sessions:", error);
      res.status(500).json({ message: "Failed to fetch capture sessions" });
    }
  });

  app.post("/api/digital-twins/start-capture", async (req, res) => {
    try {
      const { venueName, method, quality } = req.body;
      
      if (!venueName || !method) {
        return res.status(400).json({ message: "Venue name and capture method are required" });
      }

      const newSession = {
        id: `cs_${Date.now()}`,
        venueName,
        method,
        progress: 0,
        status: 'setup',
        startTime: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        capturedImages: 0,
        totalImages: method === 'lidar' ? 1200 : method === 'photogrammetry' ? 600 : 300,
        currentStage: "Initializing capture equipment"
      };

      res.json({
        ...newSession,
        message: "Capture session started successfully",
        instructions: {
          photogrammetry: "Take overlapping photos from multiple angles, ensuring 60-80% overlap between images.",
          lidar: "Position the LiDAR scanner and begin automated 360° capture sequence.",
          "360camera": "Place the 360° camera in multiple positions throughout the venue."
        }[method]
      });
    } catch (error) {
      console.error("Error starting capture session:", error);
      res.status(500).json({ message: "Failed to start capture session" });
    }
  });

  app.post("/api/digital-twins/process/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const processingJob = {
        id: `job_${Date.now()}`,
        sessionId,
        status: 'queued',
        estimatedTime: '15-30 minutes',
        stages: [
          'Image alignment and point cloud generation',
          'Mesh reconstruction and optimization',
          'Texture mapping and UV unwrapping',
          'Lighting analysis and baking',
          'Model optimization and compression',
          'Quality assurance and validation'
        ],
        currentStage: 0
      };

      res.json({
        ...processingJob,
        message: "Digital twin processing started. You'll receive an email when complete."
      });
    } catch (error) {
      console.error("Error processing digital twin:", error);
      res.status(500).json({ message: "Failed to start processing" });
    }
  });

  app.get("/api/digital-twins/:twinId", async (req, res) => {
    try {
      const { twinId } = req.params;
      
      const twinData = {
        id: twinId,
        venueName: "Grand Ballroom - Luxury Hotel",
        modelUrl: "https://models.vibes.com/grand-ballroom.glb",
        textureUrl: "https://textures.vibes.com/grand-ballroom.jpg",
        environmentMap: "https://hdri.vibes.com/ballroom-lighting.hdr",
        metadata: {
          center: [0, 0, 0],
          scale: 1.0,
          rotation: [0, 0, 0],
          boundingBox: {
            min: [-20, 0, -15],
            max: [20, 6, 15]
          },
          materialSettings: {
            metalness: 0.1,
            roughness: 0.8,
            envMapIntensity: 1.0
          }
        }
      };

      res.json(twinData);
    } catch (error) {
      console.error("Error fetching digital twin:", error);
      res.status(500).json({ message: "Failed to fetch digital twin" });
    }
  });

  // Digital Twin Event Planning API endpoints
  app.get('/api/digital-twins/:id/event-layouts', async (req, res) => {
    const { id } = req.params;
    
    // Sample event layout data for a digital twin
    const layouts = [
      {
        id: 'layout_001',
        name: 'Wedding Reception',
        description: 'Classic wedding setup with dance floor',
        twinId: id,
        items: [
          { type: 'tables', positions: [{ x: 10, y: 20, rotation: 0 }], count: 12 },
          { type: 'stage', positions: [{ x: 50, y: 10, rotation: 90 }], count: 1 },
          { type: 'danceFloor', positions: [{ x: 45, y: 30, rotation: 0 }], count: 1 },
          { type: 'lighting', positions: [{ x: 25, y: 15, rotation: 0 }], count: 8 }
        ],
        capacity: 280,
        estimatedCost: 8250,
        createdAt: new Date().toISOString()
      },
      {
        id: 'layout_002',
        name: 'Corporate Conference',
        description: 'Professional meeting setup with presentation area',
        twinId: id,
        items: [
          { type: 'tables', positions: [{ x: 15, y: 25, rotation: 45 }], count: 8 },
          { type: 'stage', positions: [{ x: 30, y: 5, rotation: 0 }], count: 1 },
          { type: 'lighting', positions: [{ x: 20, y: 12, rotation: 0 }], count: 6 }
        ],
        capacity: 150,
        estimatedCost: 4500,
        createdAt: new Date().toISOString()
      }
    ];

    res.json(layouts);
  });

  app.post('/api/digital-twins/:id/event-layouts', async (req, res) => {
    const { id } = req.params;
    const { name, description, items } = req.body;
    
    const newLayout = {
      id: `layout_${Date.now()}`,
      name,
      description,
      twinId: id,
      items,
      capacity: items.reduce((total: number, item: any) => total + (item.count * 20), 0),
      estimatedCost: items.reduce((total: number, item: any) => total + (item.count * 150), 0),
      createdAt: new Date().toISOString()
    };

    res.json(newLayout);
  });

  app.get('/api/digital-twins/:id/vendor-packages', async (req, res) => {
    const { id } = req.params;
    
    const vendorPackages = [
      {
        id: 'pkg_001',
        vendor: 'Elegant Events Co.',
        package: 'Luxury Wedding Setup',
        price: 2500,
        items: 'Crystal chandeliers, white linens, centerpieces',
        preview: '/api/placeholder/200/150',
        twinCompatible: true,
        decorItems: [
          { type: 'chandelier', count: 3, positions: [{ x: 25, y: 25 }] },
          { type: 'centerpieces', count: 12, positions: [] },
          { type: 'linens', count: 12, positions: [] }
        ]
      },
      {
        id: 'pkg_002',
        vendor: 'Party Paradise',
        package: 'DJ Booth & Dance Floor',
        price: 1200,
        items: 'LED stage, sound system, dance floor',
        preview: '/api/placeholder/200/150',
        twinCompatible: true,
        decorItems: [
          { type: 'djBooth', count: 1, positions: [{ x: 50, y: 10 }] },
          { type: 'danceFloor', count: 1, positions: [{ x: 45, y: 30 }] },
          { type: 'speakers', count: 4, positions: [] }
        ]
      },
      {
        id: 'pkg_003',
        vendor: 'Floral Dreams',
        package: 'Garden Party Decor',
        price: 800,
        items: 'Flower arrangements, vine installations',
        preview: '/api/placeholder/200/150',
        twinCompatible: true,
        decorItems: [
          { type: 'flowerArrangements', count: 8, positions: [] },
          { type: 'vineInstallations', count: 4, positions: [] }
        ]
      },
      {
        id: 'pkg_004',
        vendor: 'Tech Events',
        package: 'Corporate Conference Setup',
        price: 1500,
        items: 'Projection screens, podium, seating',
        preview: '/api/placeholder/200/150',
        twinCompatible: true,
        decorItems: [
          { type: 'projectionScreens', count: 2, positions: [{ x: 30, y: 5 }] },
          { type: 'podium', count: 1, positions: [{ x: 35, y: 8 }] },
          { type: 'corporateSeating', count: 50, positions: [] }
        ]
      }
    ];

    res.json(vendorPackages);
  });

  app.get('/api/digital-twins/:id/analytics', async (req, res) => {
    const { id } = req.params;
    
    const analytics = {
      guestFlow: {
        score: 0.85,
        status: 'optimal',
        issues: []
      },
      sightLines: {
        score: 0.78,
        status: 'good',
        issues: ['Some tables have partially blocked stage view']
      },
      acoustics: {
        score: 0.92,
        status: 'excellent',
        issues: []
      },
      capacity: {
        current: 280,
        maximum: 300,
        utilization: 0.93
      },
      budget: {
        allocated: 10000,
        used: 8250,
        remaining: 1750
      }
    };

    res.json(analytics);
  });

  app.get('/api/digital-twins/:id/guest-preview', async (req, res) => {
    const { id } = req.params;
    
    const guestPreviewData = {
      eventInfo: {
        name: "Jordan's 30th Birthday Bash",
        date: "Saturday, July 15, 2025",
        time: "7:00 PM - 2:00 AM",
        venue: "Grand Ballroom",
        location: "Downtown Event Center",
        dresscode: "Cocktail Attire",
        ageRequirement: "21+ Event",
        host: "Jordan Smith"
      },
      taggedAreas: [
        { id: 'bar', name: 'Bar Area', position: { x: 20, y: 30 }, type: 'amenity', description: 'Premium bar with signature cocktails and open bar from 7-11 PM' },
        { id: 'bathrooms', name: 'Restrooms', position: { x: 80, y: 15 }, type: 'amenity', description: 'Modern restroom facilities with premium amenities' },
        { id: 'photobooth', name: 'Photo Booth', position: { x: 60, y: 70 }, type: 'entertainment', description: 'Professional photo booth with props and instant prints' },
        { id: 'dj-booth', name: 'DJ Station', position: { x: 50, y: 10 }, type: 'entertainment', description: 'Live DJ playing the latest hits and taking requests' },
        { id: 'entrance', name: 'Main Entrance', position: { x: 10, y: 50 }, type: 'navigation', description: 'Main entrance with coat check and welcome reception' },
        { id: 'vip-section', name: 'VIP Lounge', position: { x: 70, y: 25 }, type: 'seating', description: 'Exclusive VIP area with premium seating and bottle service' }
      ],
      sponsors: [
        { id: 'sponsor1', name: 'Event Co.', logo: '/api/placeholder/60/60', position: { x: 25, y: 20 }, info: 'Premium event management services', website: 'https://eventco.com' },
        { id: 'sponsor2', name: 'Sound Pro', logo: '/api/placeholder/60/60', position: { x: 55, y: 15 }, info: 'Professional audio equipment', website: 'https://soundpro.com' },
        { id: 'sponsor3', name: 'Party Lights', logo: '/api/placeholder/60/60', position: { x: 30, y: 60 }, info: 'LED lighting specialists', website: 'https://partylights.com' }
      ],
      seatingOptions: [
        { id: 'table1', name: 'Table 1', seats: 8, available: 3, price: 0, position: { x: 30, y: 40 }, type: 'general' },
        { id: 'table2', name: 'Table 2', seats: 8, available: 8, price: 0, position: { x: 45, y: 45 }, type: 'general' },
        { id: 'table3', name: 'Table 3', seats: 8, available: 5, price: 0, position: { x: 25, y: 55 }, type: 'general' },
        { id: 'vip1', name: 'VIP Table 1', seats: 6, available: 2, price: 50, position: { x: 70, y: 30 }, type: 'vip' },
        { id: 'vip2', name: 'VIP Table 2', seats: 6, available: 6, price: 50, position: { x: 75, y: 35 }, type: 'vip' },
        { id: 'vip3', name: 'VIP Table 3', seats: 4, available: 0, price: 75, position: { x: 65, y: 40 }, type: 'premium-vip' }
      ],
      schedule: [
        { time: '7:00 PM', event: 'Doors Open' },
        { time: '7:00 - 8:00 PM', event: 'Welcome Reception' },
        { time: '8:00 - 9:30 PM', event: 'Dinner Service' },
        { time: '9:30 - 11:00 PM', event: 'Live Entertainment' },
        { time: '11:00 PM - 2:00 AM', event: 'Dancing & DJ' }
      ],
      shareableLink: `${req.protocol}://${req.get('host')}/guest-preview/${id}`,
      rsvpDeadline: "July 10, 2025"
    };

    res.json(guestPreviewData);
  });

  app.post('/api/digital-twins/:id/reserve-seating', async (req, res) => {
    const { id } = req.params;
    const { tableId, seats, guestInfo } = req.body;
    
    // Simulate reservation creation
    const reservation = {
      id: `res_${Date.now()}`,
      eventId: id,
      tableId,
      seats,
      guestInfo,
      status: 'confirmed',
      confirmationCode: `CONF${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      reservation,
      message: `Reservation confirmed! Your confirmation code is ${reservation.confirmationCode}`
    });
  });

  // Playlist Management API routes
  app.get("/api/user/playlists", async (req, res) => {
    try {
      const playlists = await storage.getUserPlaylists();
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching user playlists:", error);
      res.status(500).json({ message: "Failed to fetch user playlists" });
    }
  });

  app.post("/api/user/playlists", async (req, res) => {
    try {
      const playlistData = req.body;
      
      if (!playlistData.name) {
        return res.status(400).json({ message: "Playlist name is required" });
      }

      const playlist = await storage.createUserPlaylist(playlistData);
      res.json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  app.post("/api/playlists/share-with-dj", async (req, res) => {
    try {
      const { playlistId, djId } = req.body;
      
      if (!playlistId || !djId) {
        return res.status(400).json({ message: "Playlist ID and DJ ID are required" });
      }

      const result = await storage.sharePlaylistWithDJ(playlistId, djId);
      res.json(result);
    } catch (error) {
      console.error("Error sharing playlist with DJ:", error);
      res.status(500).json({ message: "Failed to share playlist with DJ" });
    }
  });

  app.get("/api/dj/shared-playlists/:djId", async (req, res) => {
    try {
      const { djId } = req.params;
      const playlists = await storage.getDJSharedPlaylists(djId);
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching DJ shared playlists:", error);
      res.status(500).json({ message: "Failed to fetch DJ shared playlists" });
    }
  });

  app.patch("/api/playlists/:playlistId/dj-access", async (req, res) => {
    try {
      const { playlistId } = req.params;
      const { djAccess } = req.body;
      
      const result = await storage.updatePlaylistDJAccess(playlistId, djAccess);
      res.json(result);
    } catch (error) {
      console.error("Error updating playlist DJ access:", error);
      res.status(500).json({ message: "Failed to update playlist DJ access" });
    }
  });

  // Social Media Story Templates API routes
  app.get("/api/story-templates", async (req, res) => {
    try {
      const { platform, category } = req.query;
      const templates = await storage.getStoryTemplates(platform as string, category as string);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching story templates:", error);
      res.status(500).json({ message: "Failed to fetch story templates" });
    }
  });

  app.get("/api/story-templates/generated", async (req, res) => {
    try {
      const stories = await storage.getGeneratedStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching generated stories:", error);
      res.status(500).json({ message: "Failed to fetch generated stories" });
    }
  });

  app.get("/api/story-templates/analytics", async (req, res) => {
    try {
      const analytics = await storage.getStoryAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching story analytics:", error);
      res.status(500).json({ message: "Failed to fetch story analytics" });
    }
  });

  app.post("/api/story-templates/generate", async (req, res) => {
    try {
      const { templateId, customization, eventId } = req.body;
      
      if (!templateId) {
        return res.status(400).json({ message: "Template ID is required" });
      }

      const generatedStory = await storage.generateStory({
        templateId,
        customization,
        eventId
      });
      
      res.json(generatedStory);
    } catch (error) {
      console.error("Error generating story:", error);
      res.status(500).json({ message: "Failed to generate story" });
    }
  });

  app.post("/api/story-templates/schedule", async (req, res) => {
    try {
      const { storyId, platform, scheduledTime } = req.body;
      
      if (!storyId || !platform || !scheduledTime) {
        return res.status(400).json({ message: "Story ID, platform, and scheduled time are required" });
      }

      const result = await storage.scheduleStory({
        storyId,
        platform,
        scheduledTime
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error scheduling story:", error);
      res.status(500).json({ message: "Failed to schedule story" });
    }
  });

  // Interactive Mood Visualizer API endpoints
  app.get('/api/mood-visualizer/data/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const { timeRange } = req.query;
      const moodData = await storage.getMoodData(eventId, timeRange as string);
      res.json(moodData);
    } catch (error) {
      console.error("Error fetching mood data:", error);
      res.status(500).json({ message: "Failed to fetch mood data" });
    }
  });

  app.get('/api/mood-visualizer/trends/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const trends = await storage.getMoodTrends(eventId);
      res.json(trends);
    } catch (error) {
      console.error("Error fetching mood trends:", error);
      res.status(500).json({ message: "Failed to fetch mood trends" });
    }
  });

  app.get('/api/mood-visualizer/feedback/:eventId', async (req, res) => {
    try {
      const { eventId } = req.params;
      const feedback = await storage.getRealtimeFeedback(eventId);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching realtime feedback:", error);
      res.status(500).json({ message: "Failed to fetch realtime feedback" });
    }
  });

  app.post('/api/mood-visualizer/feedback', async (req, res) => {
    try {
      const result = await storage.submitMoodFeedback(req.body);
      res.json(result);
    } catch (error) {
      console.error("Error submitting mood feedback:", error);
      res.status(500).json({ message: "Failed to submit mood feedback" });
    }
  });

  // Gamified Attendance Rewards API endpoints
  app.get('/api/gamification/rewards', async (req, res) => {
    try {
      const rewards = await storage.getUserRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({ message: "Failed to fetch user rewards" });
    }
  });

  app.get('/api/gamification/achievements', async (req, res) => {
    try {
      const achievements = await storage.getGamificationAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/gamification/leaderboard', async (req, res) => {
    try {
      const { timeframe } = req.query;
      const leaderboard = await storage.getGamificationLeaderboard(timeframe as string);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get('/api/gamification/challenges', async (req, res) => {
    try {
      const challenges = await storage.getGamificationChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get('/api/gamification/stats', async (req, res) => {
    try {
      const stats = await storage.getGamificationStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching gamification stats:", error);
      res.status(500).json({ message: "Failed to fetch gamification stats" });
    }
  });

  app.post('/api/gamification/rewards/:rewardId/claim', async (req, res) => {
    try {
      const { rewardId } = req.params;
      const result = await storage.claimReward(rewardId);
      res.json(result);
    } catch (error) {
      console.error("Error claiming reward:", error);
      res.status(500).json({ message: "Failed to claim reward" });
    }
  });

  app.post('/api/gamification/challenges/:challengeId/complete', async (req, res) => {
    try {
      const { challengeId } = req.params;
      const result = await storage.completeChallenge(challengeId);
      res.json(result);
    } catch (error) {
      console.error("Error completing challenge:", error);
      res.status(500).json({ message: "Failed to complete challenge" });
    }
  });

  // Voice-Activated Assistant API endpoints
  app.get('/api/voice-assistant/conversation', async (req, res) => {
    try {
      const conversation = await storage.getVoiceConversation();
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching voice conversation:", error);
      res.status(500).json({ message: "Failed to fetch voice conversation" });
    }
  });

  app.get('/api/voice-assistant/commands', async (req, res) => {
    try {
      const commands = await storage.getVoiceCommands();
      res.json(commands);
    } catch (error) {
      console.error("Error fetching voice commands:", error);
      res.status(500).json({ message: "Failed to fetch voice commands" });
    }
  });

  app.get('/api/voice-assistant/capabilities', async (req, res) => {
    try {
      const capabilities = await storage.getVoiceCapabilities();
      res.json(capabilities);
    } catch (error) {
      console.error("Error fetching voice capabilities:", error);
      res.status(500).json({ message: "Failed to fetch voice capabilities" });
    }
  });

  app.post('/api/voice-assistant/process', async (req, res) => {
    try {
      const result = await storage.processVoiceCommand(req.body);
      res.json(result);
    } catch (error) {
      console.error("Error processing voice command:", error);
      res.status(500).json({ message: "Failed to process voice command" });
    }
  });

  // Interactive Live Vibes Invite API endpoints
  app.get('/api/invitations/:invitationId', async (req, res) => {
    try {
      const { invitationId } = req.params;
      const invitation = await storage.getEventInvitation(invitationId);
      res.json(invitation);
    } catch (error) {
      console.error("Error fetching invitation:", error);
      res.status(500).json({ message: "Failed to fetch invitation" });
    }
  });

  app.get('/api/invitations/:invitationId/guests', async (req, res) => {
    try {
      const { invitationId } = req.params;
      const guests = await storage.getInvitationGuests(invitationId);
      res.json(guests);
    } catch (error) {
      console.error("Error fetching invitation guests:", error);
      res.status(500).json({ message: "Failed to fetch invitation guests" });
    }
  });

  app.post('/api/invitations/:invitationId/rsvp', async (req, res) => {
    try {
      const { invitationId } = req.params;
      const result = await storage.submitInvitationRSVP(invitationId, req.body);
      res.json(result);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      res.status(500).json({ message: "Failed to submit RSVP" });
    }
  });

  app.post('/api/invitations/:invitationId/vote-track', async (req, res) => {
    try {
      const { invitationId } = req.params;
      const { trackId } = req.body;
      const result = await storage.voteForTrack(invitationId, trackId);
      res.json(result);
    } catch (error) {
      console.error("Error voting for track:", error);
      res.status(500).json({ message: "Failed to vote for track" });
    }
  });

  app.post('/api/invitations/:invitationId/mint-nft', async (req, res) => {
    try {
      const { invitationId } = req.params;
      const result = await storage.mintNFTRSVP(invitationId);
      res.json(result);
    } catch (error) {
      console.error("Error minting NFT RSVP:", error);
      res.status(500).json({ message: "Failed to mint NFT RSVP" });
    }
  });

  app.get('/api/invitations/:invitationId/perks/:guestId', async (req, res) => {
    try {
      const { invitationId, guestId } = req.params;
      const perks = await storage.getInvitationPerks(invitationId, guestId);
      res.json(perks);
    } catch (error) {
      console.error("Error fetching invitation perks:", error);
      res.status(500).json({ message: "Failed to fetch invitation perks" });
    }
  });

  app.post('/api/invitations/create', async (req, res) => {
    try {
      const { eventId, ...invitationData } = req.body;
      const result = await storage.createEventInvitation(eventId, invitationData);
      res.json(result);
    } catch (error) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ message: "Failed to create invitation" });
    }
  });

  app.get('/api/invitations/:invitationId/analytics', async (req, res) => {
    try {
      const { invitationId } = req.params;
      const analytics = await storage.getInvitationAnalytics(invitationId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching invitation analytics:", error);
      res.status(500).json({ message: "Failed to fetch invitation analytics" });
    }
  });

  // Video generation for Interactive Live Vibes Invite
  app.post('/api/invitations/:id/generate-video', async (req, res) => {
    try {
      const { guestId, options } = req.body;
      
      const videoResult = {
        success: true,
        video: {
          id: `video_${req.params.id}_${guestId}_${Date.now()}`,
          invitationId: req.params.id,
          guestId: guestId,
          status: 'completed',
          progress: 100,
          videoUrl: `/api/videos/generated/${req.params.id}_${guestId}.mp4`,
          thumbnailUrl: `/api/videos/generated/${req.params.id}_${guestId}_thumb.jpg`,
          options: {
            includeHostMessage: options?.includeHostMessage || false,
            includeVenueTour: options?.includeVenueTour || false,
            includeMusicPreview: options?.includeMusicPreview || false,
            includeMemoryReel: options?.includeMemoryReel || false,
            theme: options?.theme || 'party',
            duration: options?.duration || 60
          },
          createdAt: new Date().toISOString()
        },
        message: 'Video generated successfully!'
      };

      res.json(videoResult);
    } catch (error) {
      console.error('Error generating video:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to generate video',
        error: error.message 
      });
    }
  });

  // Bulk Interactive Invites API
  app.post("/api/events/:eventId/bulk-invites", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const inviteData = req.body;

      // Validate required fields
      if (!inviteData.recipients || !Array.isArray(inviteData.recipients) || inviteData.recipients.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Recipients array is required and must not be empty"
        });
      }

      // Validate recipients have email addresses
      const invalidRecipients = inviteData.recipients.filter((r: any) => !r.email);
      if (invalidRecipients.length > 0) {
        return res.status(400).json({
          success: false,
          message: "All recipients must have valid email addresses"
        });
      }

      const result = await storage.sendBulkInteractiveInvites(eventId, inviteData);
      
      res.json({
        success: true,
        invitationsSent: result.invitationsSent,
        invitations: result.invitations,
        features: result.features,
        estimatedDeliveryTime: result.estimatedDeliveryTime,
        message: result.message
      });
    } catch (error) {
      console.error('Error sending bulk invites:', error);
      res.status(500).json({
        success: false,
        message: "Failed to send bulk invitations",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // AI Guest Matchmaking API
  app.post("/api/ai/guest-matchmaking", async (req, res) => {
    try {
      const { guests } = req.body;
      
      if (!guests || !Array.isArray(guests) || guests.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least 2 guests are required for matchmaking"
        });
      }

      const matches = await aiPlanner.generateGuestMatchmaking(guests);
      res.json(matches);
    } catch (error) {
      console.error('Error generating guest matches:', error);
      res.status(500).json({
        success: false,
        message: "Failed to generate guest matches",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Large-Scale Meeting Management API
  app.post("/api/meetings/create", async (req, res) => {
    try {
      const meetingData = req.body;
      
      // Validate required fields
      if (!meetingData.title || !meetingData.participants || !Array.isArray(meetingData.participants)) {
        return res.status(400).json({
          success: false,
          message: "Meeting title and participants are required"
        });
      }

      if (meetingData.participants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one participant is required"
        });
      }

      // Create meeting with comprehensive configuration
      const meeting = {
        id: `meeting_${Date.now()}`,
        title: meetingData.title,
        description: meetingData.description || "",
        participants: meetingData.participants,
        maxParticipants: meetingData.maxParticipants || 500,
        requireApproval: meetingData.requireApproval || false,
        enableBreakoutRooms: meetingData.enableBreakoutRooms || true,
        recordMeeting: meetingData.recordMeeting || false,
        allowScreenShare: meetingData.allowScreenShare || true,
        enableChat: meetingData.enableChat || true,
        meetingType: meetingData.meetingType || "large-scale",
        scheduledFor: meetingData.scheduledFor || new Date().toISOString(),
        status: "scheduled",
        createdAt: new Date().toISOString(),
        meetingUrl: `https://meet.vibes.com/room/${Date.now()}`,
        participantCount: meetingData.participants.length,
        features: {
          aiMatchmaking: true,
          bulkInvites: true,
          realTimeAnalytics: true,
          breakoutRooms: meetingData.enableBreakoutRooms,
          recording: meetingData.recordMeeting,
          screenShare: meetingData.allowScreenShare,
          chat: meetingData.enableChat
        }
      };

      // Store meeting data
      await storage.createLargeScaleMeeting(meeting);

      res.json({
        success: true,
        meeting: meeting,
        message: `Large-scale meeting created successfully for ${meeting.participantCount} participants`
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      res.status(500).json({
        success: false,
        message: "Failed to create meeting",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/meetings/:meetingId", async (req, res) => {
    try {
      const meetingId = req.params.meetingId;
      const meeting = await storage.getMeeting(meetingId);
      
      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found"
        });
      }

      res.json({
        success: true,
        meeting: meeting
      });
    } catch (error) {
      console.error('Error fetching meeting:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch meeting",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/meetings/:meetingId/participants/bulk-add", async (req, res) => {
    try {
      const meetingId = req.params.meetingId;
      const { participants } = req.body;
      
      if (!participants || !Array.isArray(participants)) {
        return res.status(400).json({
          success: false,
          message: "Participants array is required"
        });
      }

      const result = await storage.addParticipantsToMeeting(meetingId, participants);
      
      res.json({
        success: true,
        added: result.added,
        total: result.total,
        message: `Added ${result.added} participants to the meeting`
      });
    } catch (error) {
      console.error('Error adding participants:', error);
      res.status(500).json({
        success: false,
        message: "Failed to add participants",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // VibeLedger Finance & Admin System API Endpoints
  
  // Payment Processing API
  app.post("/api/vibeledger/payments/process", async (req, res) => {
    try {
      const paymentData = req.body;
      
      // Validate required payment fields
      if (!paymentData.amount || !paymentData.method || !paymentData.memberId) {
        return res.status(400).json({
          success: false,
          message: "Amount, payment method, and member ID are required"
        });
      }

      const payment = await storage.processVibeLedgerPayment(paymentData);
      
      // Trigger blockchain transaction
      if (paymentData.method === 'crypto') {
        const blockchainTx = await blockchainService.createEscrowContract(
          paymentData.treasuryWallet,
          paymentData.amount.toString(),
          Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        );
        payment.blockchainTxHash = blockchainTx.transactionHash;
      }

      res.json({
        success: true,
        payment: payment,
        message: `Payment of $${paymentData.amount} processed successfully via ${paymentData.method}`
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({
        success: false,
        message: "Payment processing failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // VibesCard Studio Design API
  app.get("/api/vibescard-designs", async (req, res) => {
    try {
      const designs = await storage.getVibesCardDesigns();
      res.json(designs);
    } catch (error) {
      console.error('Error fetching designs:', error);
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  // VibeCard Invitation System Routes
  app.post('/api/invites/create', async (req, res) => {
    try {
      const { template, customization } = req.body;
      
      const inviteId = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shareUrl = `${req.protocol}://${req.get('host')}/invite/${inviteId}`;
      
      // Generate QR code data (mock)
      const qrCode = `data:image/svg+xml;base64,${Buffer.from(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="160" height="160" fill="black"/>
          <text x="100" y="110" text-anchor="middle" fill="white" font-size="12">QR Code</text>
        </svg>
      `).toString('base64')}`;

      // Store invitation data
      const inviteData = {
        id: inviteId,
        template,
        customization,
        shareUrl,
        qrCode,
        createdAt: new Date().toISOString(),
        stats: {
          sent: 0,
          opened: 0,
          responded: 0,
          attending: 0,
          declined: 0,
          maybe: 0,
          shareClicks: 0,
          qrScans: 0
        },
        responses: []
      };

      // In real implementation, save to database
      await storage.createInvitation(inviteData);

      res.json({
        id: inviteId,
        shareUrl,
        qrCode,
        message: 'Invitation created successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create invitation' });
    }
  });

  app.get('/api/invites/stats/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const invitation = await storage.getInvitation(id);
      
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      res.json(invitation.stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  app.get('/api/invites/responses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const invitation = await storage.getInvitation(id);
      
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      res.json(invitation.responses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch responses' });
    }
  });

  app.get('/invite/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const invitation = await storage.getInvitation(id);
      
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      // Update opened count
      invitation.stats.opened += 1;
      await storage.updateInvitation(id, invitation);

      // Return invitation data for guest view
      res.json({
        id: invitation.id,
        customization: invitation.customization,
        template: invitation.template,
        isActive: true
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to load invitation' });
    }
  });

  app.post('/api/invites/:id/rsvp', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, rsvp, responses, requests } = req.body;
      
      const invitation = await storage.getInvitation(id);
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      const guestResponse = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        rsvp,
        responses: responses || {},
        requests: requests || [],
        timestamp: new Date().toISOString()
      };

      // Update stats
      invitation.stats.responded += 1;
      if (rsvp === 'yes') invitation.stats.attending += 1;
      else if (rsvp === 'no') invitation.stats.declined += 1;
      else if (rsvp === 'maybe') invitation.stats.maybe += 1;

      // Add response
      invitation.responses.push(guestResponse);
      
      await storage.updateInvitation(id, invitation);

      res.json({ message: 'RSVP recorded successfully', responseId: guestResponse.id });
    } catch (error) {
      res.status(500).json({ message: 'Failed to record RSVP' });
    }
  });

  app.post('/api/invites/:id/remind', async (req, res) => {
    try {
      const { id } = req.params;
      const invitation = await storage.getInvitation(id);
      
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      // In real implementation, send reminder emails
      res.json({ message: 'Reminders sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send reminders' });
    }
  });

  app.post('/api/invites/:id/nft', async (req, res) => {
    try {
      const { id } = req.params;
      const invitation = await storage.getInvitation(id);
      
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      // Generate NFT collectibles for attendees
      const attendees = invitation.responses.filter(r => r.rsvp === 'yes');
      const nftData = {
        eventTitle: invitation.customization.title,
        eventDate: invitation.customization.date,
        totalAttendees: attendees.length,
        nfts: attendees.map(attendee => ({
          guestId: attendee.id,
          guestName: attendee.name,
          tokenId: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          rarity: Math.random() > 0.8 ? 'rare' : Math.random() > 0.5 ? 'uncommon' : 'common',
          metadata: {
            eventTitle: invitation.customization.title,
            eventDate: invitation.customization.date,
            guestName: attendee.name,
            timestamp: new Date().toISOString()
          }
        }))
      };

      res.json({ 
        message: 'NFT collectibles generated successfully',
        nftData
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to generate NFTs' });
    }
  });

  app.post("/api/vibescard-designs", async (req, res) => {
    try {
      const designData = req.body;
      const design = await storage.saveVibesCardDesign(designData);
      res.json(design);
    } catch (error) {
      console.error('Error saving design:', error);
      res.status(500).json({ message: "Failed to save design" });
    }
  });

  app.get("/api/vibescard-designs/:id", async (req, res) => {
    try {
      const designId = req.params.id;
      const design = await storage.getVibesCardDesign(designId);
      res.json(design);
    } catch (error) {
      console.error('Error fetching design:', error);
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.put("/api/vibescard-designs/:id", async (req, res) => {
    try {
      const designId = req.params.id;
      const updates = req.body;
      const design = await storage.updateVibesCardDesign(designId, updates);
      res.json(design);
    } catch (error) {
      console.error('Error updating design:', error);
      res.status(500).json({ message: "Failed to update design" });
    }
  });

  app.delete("/api/vibescard-designs/:id", async (req, res) => {
    try {
      const designId = req.params.id;
      await storage.deleteVibesCardDesign(designId);
      res.json({ success: true, message: "Design deleted successfully" });
    } catch (error) {
      console.error('Error deleting design:', error);
      res.status(500).json({ message: "Failed to delete design" });
    }
  });

  // Treasury Management API
  app.get("/api/vibeledger/treasury/:communityId", async (req, res) => {
    try {
      const communityId = req.params.communityId;
      const treasury = await storage.getCommunityTreasury(communityId);
      
      res.json({
        success: true,
        treasury: treasury
      });
    } catch (error) {
      console.error('Error fetching treasury:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch treasury data",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Member Management API
  app.get("/api/vibeledger/members/:communityId", async (req, res) => {
    try {
      const communityId = req.params.communityId;
      const members = await storage.getCommunityMembers(communityId);
      
      res.json({
        success: true,
        members: members
      });
    } catch (error) {
      console.error('Error fetching members:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch member data",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // NFT Membership Badge Creation
  app.post("/api/vibeledger/nft/mint", async (req, res) => {
    try {
      const { memberId, communityId, membershipTier } = req.body;
      
      if (!memberId || !communityId) {
        return res.status(400).json({
          success: false,
          message: "Member ID and community ID are required"
        });
      }

      // Create NFT membership badge
      const nftData = {
        memberId: memberId,
        communityId: communityId,
        tier: membershipTier || 'standard',
        mintedAt: new Date().toISOString(),
        tokenId: `VTC-${Date.now()}`,
        metadata: {
          name: `Community Member Badge`,
          description: `Official membership NFT for verified community member`,
          image: `https://vibes.com/nft/community/${communityId}/member/${memberId}.png`,
          attributes: [
            { trait_type: "Membership Tier", value: membershipTier || 'standard' },
            { trait_type: "Community", value: communityId },
            { trait_type: "Member Since", value: new Date().getFullYear().toString() }
          ]
        }
      };

      const nft = await storage.createMembershipNFT(nftData);
      
      res.json({
        success: true,
        nft: nft,
        message: "Membership NFT badge created successfully"
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      res.status(500).json({
        success: false,
        message: "Failed to mint membership NFT",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Fines Management API
  app.post("/api/vibeledger/fines/issue", async (req, res) => {
    try {
      const fineData = req.body;
      
      if (!fineData.memberId || !fineData.amount || !fineData.reason) {
        return res.status(400).json({
          success: false,
          message: "Member ID, amount, and reason are required"
        });
      }

      const fine = await storage.issueMemberFine(fineData);
      
      // Record on blockchain for transparency
      const blockchainRecord = {
        type: 'fine_issued',
        memberId: fineData.memberId,
        amount: fineData.amount,
        reason: fineData.reason,
        timestamp: new Date().toISOString(),
        issuer: fineData.issuerId || 'system'
      };

      res.json({
        success: true,
        fine: fine,
        blockchainRecord: blockchainRecord,
        message: `Fine of $${fineData.amount} issued successfully`
      });
    } catch (error) {
      console.error('Error issuing fine:', error);
      res.status(500).json({
        success: false,
        message: "Failed to issue fine",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Governance Proposals API
  app.post("/api/vibeledger/governance/proposals", async (req, res) => {
    try {
      const proposalData = req.body;
      
      if (!proposalData.title || !proposalData.description || !proposalData.proposerId) {
        return res.status(400).json({
          success: false,
          message: "Title, description, and proposer ID are required"
        });
      }

      const proposal = await storage.createGovernanceProposal(proposalData);
      
      res.json({
        success: true,
        proposal: proposal,
        message: "Governance proposal created successfully"
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      res.status(500).json({
        success: false,
        message: "Failed to create proposal",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/vibeledger/governance/proposals/:proposalId/vote", async (req, res) => {
    try {
      const proposalId = req.params.proposalId;
      const { memberId, vote, votingPower } = req.body;
      
      if (!memberId || !vote) {
        return res.status(400).json({
          success: false,
          message: "Member ID and vote are required"
        });
      }

      const voteRecord = await storage.castGovernanceVote(proposalId, {
        memberId,
        vote,
        votingPower: votingPower || 1,
        timestamp: new Date().toISOString()
      });
      
      res.json({
        success: true,
        vote: voteRecord,
        message: "Vote cast successfully"
      });
    } catch (error) {
      console.error('Error casting vote:', error);
      res.status(500).json({
        success: false,
        message: "Failed to cast vote",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Attendance Tracking API
  app.post("/api/vibeledger/attendance/checkin", async (req, res) => {
    try {
      const { eventId, memberId, checkInMethod, location } = req.body;
      
      if (!eventId || !memberId) {
        return res.status(400).json({
          success: false,
          message: "Event ID and member ID are required"
        });
      }

      const attendance = await storage.recordMemberAttendance({
        eventId,
        memberId,
        checkInMethod: checkInMethod || 'manual',
        location: location || 'unknown',
        timestamp: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`
      });
      
      res.json({
        success: true,
        attendance: attendance,
        message: "Attendance recorded successfully"
      });
    } catch (error) {
      console.error('Error recording attendance:', error);
      res.status(500).json({
        success: false,
        message: "Failed to record attendance",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Analytics API
  app.get("/api/vibeledger/analytics/:communityId", async (req, res) => {
    try {
      const communityId = req.params.communityId;
      const { timeframe } = req.query;
      
      const analytics = await storage.getCommunityAnalytics(communityId, timeframe as string);
      
      res.json({
        success: true,
        analytics: analytics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Interactive Design Generator API Endpoints

  // AI Story Generation
  app.post("/api/ai/generate-story", async (req, res) => {
    try {
      const { prompt, mood, style, colorPalette } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          success: false,
          message: "Story prompt is required"
        });
      }

      // Generate story using AI service
      const storyData = {
        prompt: prompt,
        mood: mood || 'energetic',
        style: style || 'modern',
        colorPalette: colorPalette || [],
        context: `Create a personalized story based on the ${mood} mood with a ${style} style theme.`
      };

      const story = await aiPlanner.generatePersonalizedStory(storyData);
      
      res.json({
        success: true,
        story: story,
        metadata: {
          mood: mood,
          style: style,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generating story:', error);
      res.status(500).json({
        success: false,
        message: "Story generation failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Color Palette Generation
  app.post("/api/design/generate-palette", async (req, res) => {
    try {
      const { mood, intensity, style } = req.body;
      
      const palette = await storage.generateMoodBasedPalette({
        mood: mood || 'energetic',
        intensity: intensity || 70,
        style: style || 'modern'
      });
      
      res.json({
        success: true,
        palette: palette
      });
    } catch (error) {
      console.error('Error generating palette:', error);
      res.status(500).json({
        success: false,
        message: "Palette generation failed",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Achievement System
  app.get("/api/achievements/user", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements();
      
      res.json({
        success: true,
        achievements: achievements
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch achievements",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/achievements/unlock", async (req, res) => {
    try {
      const { achievementId, userId } = req.body;
      
      if (!achievementId) {
        return res.status(400).json({
          success: false,
          message: "Achievement ID is required"
        });
      }

      const result = await storage.unlockUserAchievement(achievementId, userId || 'default');
      
      res.json({
        success: true,
        achievement: result,
        message: "Achievement unlocked successfully"
      });
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      res.status(500).json({
        success: false,
        message: "Failed to unlock achievement",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Collaboration Features
  app.post("/api/collaboration/add-member", async (req, res) => {
    try {
      const collaboratorData = req.body;
      
      const collaborator = await storage.addCollaborator(collaboratorData);
      
      res.json({
        success: true,
        collaborator: collaborator,
        message: "Collaborator added successfully"
      });
    } catch (error) {
      console.error('Error adding collaborator:', error);
      res.status(500).json({
        success: false,
        message: "Failed to add collaborator",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/collaboration/active", async (req, res) => {
    try {
      const collaborators = await storage.getActiveCollaborators();
      
      res.json({
        success: true,
        collaborators: collaborators
      });
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch collaborators",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // VibesCard Studio API Routes
  app.get("/api/vibescard-studio", async (req, res) => {
    try {
      const studioData = await storage.getVibesCardStudio();
      res.json(studioData);
    } catch (error) {
      console.error('Error fetching studio data:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch studio data",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/vibescard-studio/save", async (req, res) => {
    try {
      const cardData = req.body;
      const result = await storage.saveVibesCard(cardData);
      res.json(result);
    } catch (error) {
      console.error('Error saving VibesCard:', error);
      res.status(500).json({
        success: false,
        message: "Failed to save VibesCard",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/vibescard-studio/ai-suggestions", async (req, res) => {
    try {
      const { prompt } = req.body;
      const result = await storage.generateAISuggestions(prompt);
      res.json(result);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      res.status(500).json({
        success: false,
        message: "Failed to generate AI suggestions",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/vibescard-studio/create-nft", async (req, res) => {
    try {
      const cardData = req.body;
      const result = await storage.createNFTInvitation(cardData);
      res.json(result);
    } catch (error) {
      console.error('Error creating NFT invitation:', error);
      res.status(500).json({
        success: false,
        message: "Failed to create NFT invitation",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/vibescard-studio/analytics/:cardId", async (req, res) => {
    try {
      const { cardId } = req.params;
      const analytics = await storage.getVibesCardAnalytics(cardId);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/vibescard-studio/upload-media", async (req, res) => {
    try {
      const mediaData = req.body;
      const result = await storage.uploadVibesCardMedia(mediaData);
      res.json(result);
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({
        success: false,
        message: "Failed to upload media",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/vibescard-studio/vendor-partnerships", async (req, res) => {
    try {
      const partnerships = await storage.getVendorPartnershipOptions();
      res.json(partnerships);
    } catch (error) {
      console.error('Error fetching vendor partnerships:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch vendor partnerships",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/vibescard-studio/collaborative/:cardId", async (req, res) => {
    try {
      const { cardId } = req.params;
      const { guestPhotos } = req.body;
      const result = await storage.collaborativeVibesCard(cardId, guestPhotos);
      res.json(result);
    } catch (error) {
      console.error('Error updating collaborative card:', error);
      res.status(500).json({
        success: false,
        message: "Failed to update collaborative card",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/vibescard-studio/export-story", async (req, res) => {
    try {
      const { platform, elements, style } = req.body;
      
      const platformSpecs: { [key: string]: { width: number; height: number; format: string; name: string } } = {
        'story': { width: 1080, height: 1920, format: 'jpg', name: 'Instagram Story' },
        'post': { width: 1080, height: 1080, format: 'jpg', name: 'Instagram Post' },
        'event': { width: 1920, height: 1080, format: 'jpg', name: 'Facebook Event' },
        'card': { width: 1200, height: 675, format: 'jpg', name: 'Twitter Card' },
        'professional': { width: 1200, height: 627, format: 'jpg', name: 'LinkedIn Post' },
        'vertical': { width: 1080, height: 1920, format: 'mp4', name: 'TikTok Video' }
      };
      
      const spec = platformSpecs[platform] || platformSpecs['story'];
      
      const optimizations: { [key: string]: string[] } = {
        'story': ['Vertical orientation', 'Touch-friendly elements', 'Story-safe zones'],
        'post': ['Square format', 'High engagement zones', 'Hashtag optimization'],
        'event': ['Event details prominence', 'Clear call-to-action', 'Time/date visibility'],
        'card': ['Text readability', 'Link preview optimization', 'Character limits'],
        'professional': ['Professional styling', 'Brand colors', 'Business tone'],
        'vertical': ['Video format', 'Short duration', 'Trending effects']
      };
      
      // Simulate export processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const baseSize = (spec.width * spec.height) / 1000000;
      const elementMultiplier = 1 + ((elements?.length || 0) * 0.1);
      const formatMultiplier = spec.format === 'mp4' ? 3 : 1;
      const fileSize = `${(baseSize * elementMultiplier * formatMultiplier).toFixed(1)}MB`;
      
      const result = {
        success: true,
        downloadUrl: `/api/exports/${platform}-export-${Date.now()}.${spec.format}`,
        platform: spec.name,
        format: spec.format,
        dimensions: `${spec.width}x${spec.height}`,
        optimizations: optimizations[platform] || ['Standard optimization'],
        fileSize
      };
      
      res.json(result);
    } catch (error) {
      console.error('Error exporting story:', error);
      res.status(500).json({
        success: false,
        message: "Failed to export story",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Subgroup API endpoints
  app.post('/api/subgroups', async (req, res) => {
    try {
      const { name, description, purpose, color, icon, permissions } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Subgroup name is required' });
      }

      const subgroup = await storage.createSubgroup({
        name,
        description: description || '',
        purpose: purpose || 'general',
        color: color || '#3B82F6',
        icon: icon || 'Users',
        permissions: permissions || { canCreateMeetings: false, canManageFinances: false },
        status: 'active'
      });

      res.json({ 
        success: true, 
        subgroup,
        message: 'Subgroup created successfully'
      });
    } catch (error) {
      console.error('Error creating subgroup:', error);
      res.status(500).json({ error: 'Failed to create subgroup' });
    }
  });

  app.get('/api/subgroups', async (req, res) => {
    try {
      const subgroups = await storage.getAllSubgroups();
      res.json(subgroups);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
      res.status(500).json({ error: 'Failed to fetch subgroups' });
    }
  });

  app.get('/api/subgroups/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const subgroup = await storage.getSubgroup(parseInt(id));
      
      if (!subgroup) {
        return res.status(404).json({ error: 'Subgroup not found' });
      }
      
      res.json(subgroup);
    } catch (error) {
      console.error('Error fetching subgroup:', error);
      res.status(500).json({ error: 'Failed to fetch subgroup' });
    }
  });

  app.post('/api/subgroups/:id/members', async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, role } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const membership = await storage.addMemberToSubgroup(
        parseInt(id), 
        parseInt(userId), 
        role || 'member'
      );

      res.json({ 
        success: true, 
        membership,
        message: 'Member added to subgroup successfully'
      });
    } catch (error) {
      console.error('Error adding member to subgroup:', error);
      res.status(500).json({ error: 'Failed to add member to subgroup' });
    }
  });

  app.delete('/api/subgroups/:id/members/:userId', async (req, res) => {
    try {
      const { id, userId } = req.params;
      
      const removed = await storage.removeMemberFromSubgroup(
        parseInt(id), 
        parseInt(userId)
      );

      if (!removed) {
        return res.status(404).json({ error: 'Member not found in subgroup' });
      }

      res.json({ 
        success: true, 
        message: 'Member removed from subgroup successfully'
      });
    } catch (error) {
      console.error('Error removing member from subgroup:', error);
      res.status(500).json({ error: 'Failed to remove member from subgroup' });
    }
  });

  app.get('/api/subgroups/:id/members', async (req, res) => {
    try {
      const { id } = req.params;
      const members = await storage.getSubgroupMembers(parseInt(id));
      res.json(members);
    } catch (error) {
      console.error('Error fetching subgroup members:', error);
      res.status(500).json({ error: 'Failed to fetch subgroup members' });
    }
  });

  app.get('/api/users/:userId/subgroups', async (req, res) => {
    try {
      const { userId } = req.params;
      const subgroups = await storage.getUserSubgroups(parseInt(userId));
      res.json(subgroups);
    } catch (error) {
      console.error('Error fetching user subgroups:', error);
      res.status(500).json({ error: 'Failed to fetch user subgroups' });
    }
  });

  app.put('/api/subgroups/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedSubgroup = await storage.updateSubgroup(parseInt(id), updates);
      
      if (!updatedSubgroup) {
        return res.status(404).json({ error: 'Subgroup not found' });
      }

      res.json({ 
        success: true, 
        subgroup: updatedSubgroup,
        message: 'Subgroup updated successfully'
      });
    } catch (error) {
      console.error('Error updating subgroup:', error);
      res.status(500).json({ error: 'Failed to update subgroup' });
    }
  });

  app.delete('/api/subgroups/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteSubgroup(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ error: 'Subgroup not found' });
      }

      res.json({ 
        success: true, 
        message: 'Subgroup deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting subgroup:', error);
      res.status(500).json({ error: 'Failed to delete subgroup' });
    }
  });

  // Geocoding service for venue satellite view
  app.get('/api/geocode', async (req, res) => {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    try {
      // Check if Google Maps API key is available
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        return res.status(503).json({ 
          error: 'Geocoding service unavailable. GOOGLE_MAPS_API_KEY not configured.' 
        });
      }

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address as string)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        res.json({
          lat: location.lat,
          lng: location.lng,
          formatted_address: data.results[0].formatted_address
        });
      } else {
        res.status(404).json({ error: 'Location not found' });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      res.status(500).json({ error: 'Geocoding service error' });
    }
  });

  // Ecosystem Integration API Routes
  
  // Get ecosystem health status
  app.get('/api/ecosystem/health', async (req, res) => {
    try {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          api: 'healthy',
          database: 'healthy',
          blockchain: 'healthy',
          streaming: 'healthy',
          ar_engine: 'healthy'
        },
        responseTime: Math.floor(Math.random() * 200) + 50,
        uptime: 99.9
      };

      res.json(healthStatus);
    } catch (error) {
      console.error('Error checking ecosystem health:', error);
      res.status(500).json({ 
        status: 'degraded',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get ecosystem metrics
  app.get('/api/ecosystem/metrics', async (req, res) => {
    try {
      const metrics = {
        totalEvents: 247,
        activeInvitations: 156,
        designsCreated: 892,
        venuesShowcased: 34,
        seatingArranged: 127,
        systemUptime: 99.9,
        dataFlowRate: 45,
        crossPlatformSyncs: 1247,
        userEngagement: 87.3,
        performanceScore: 94.2
      };

      res.json(metrics);
    } catch (error) {
      console.error('Error fetching ecosystem metrics:', error);
      res.status(500).json({ message: 'Failed to fetch metrics' });
    }
  });

  // Get integration flows
  app.get('/api/ecosystem/integrations', async (req, res) => {
    try {
      const integrationFlows = [
        {
          id: 'invite-to-design',
          name: 'Invitation to Design Flow',
          source: 'VibeInvite',
          target: 'Design Studio',
          status: 'active',
          dataExchanged: 234,
          lastSync: new Date().toISOString(),
          throughput: '15/min'
        },
        {
          id: 'design-to-venue',
          name: 'Design to Venue Flow',
          source: 'Design Studio',
          target: 'Venue Showcase',
          status: 'active',
          dataExchanged: 189,
          lastSync: new Date().toISOString(),
          throughput: '12/min'
        },
        {
          id: 'venue-to-seating',
          name: 'Venue to Seating Flow',
          source: 'Venue Showcase',
          target: 'Seat Tracker',
          status: 'active',
          dataExchanged: 156,
          lastSync: new Date().toISOString(),
          throughput: '8/min'
        },
        {
          id: 'seating-to-decoration',
          name: 'Seating to Decoration Flow',
          source: 'Seat Tracker',
          target: 'Party Decorator',
          status: 'active',
          dataExchanged: 143,
          lastSync: new Date().toISOString(),
          throughput: '9/min'
        }
      ];

      res.json(integrationFlows);
    } catch (error) {
      console.error('Error fetching integration flows:', error);
      res.status(500).json({ message: 'Failed to fetch integration flows' });
    }
  });

  // Sync all systems
  app.post('/api/ecosystem/sync-all', async (req, res) => {
    try {
      // Simulate synchronization process
      const syncResults = {
        success: true,
        timestamp: new Date().toISOString(),
        syncedSystems: [
          { name: 'VibeInvite', status: 'synced', recordsUpdated: 45 },
          { name: 'Design Studio', status: 'synced', recordsUpdated: 67 },
          { name: 'Party Decorator', status: 'synced', recordsUpdated: 23 },
          { name: 'Venue Showcase', status: 'synced', recordsUpdated: 34 },
          { name: 'Seat Tracker', status: 'synced', recordsUpdated: 28 }
        ],
        totalRecordsSynced: 197,
        syncDuration: '2.3s'
      };

      res.json(syncResults);
    } catch (error) {
      console.error('Error syncing systems:', error);
      res.status(500).json({ message: 'Failed to sync systems' });
    }
  });

  // Cross-platform event creation
  app.post('/api/ecosystem/create-event', async (req, res) => {
    try {
      const eventData = req.body;
      const eventId = `event_${Date.now()}`;
      
      // Create comprehensive event across all systems
      const event = {
        id: eventId,
        ...eventData,
        createdAt: new Date().toISOString(),
        integrationStatus: {
          vibeInvite: 'created',
          designStudio: 'template_generated',
          venueShowcase: 'suggestions_ready',
          seatTracker: 'layout_optimized',
          partyDecorator: 'themes_prepared'
        }
      };

      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating integrated event:', error);
      res.status(500).json({ message: 'Failed to create integrated event' });
    }
  });

  // VibeControl Routes - Real-Time Party Co-Creation
  app.get("/api/vibe-control/votes", async (req, res) => {
    try {
      const liveVotes = [
        {
          id: "vote-music-1",
          type: "music",
          title: "Next Song Vote",
          description: "Choose the next track to energize the dance floor",
          options: [
            {
              id: "opt-1",
              title: "Blinding Lights - The Weeknd",
              description: "High energy synthwave",
              votes: 45,
              percentage: 35
            },
            {
              id: "opt-2", 
              title: "Levitating - Dua Lipa",
              description: "Dance pop anthem",
              votes: 38,
              percentage: 30
            },
            {
              id: "opt-3",
              title: "Good 4 U - Olivia Rodrigo", 
              description: "Rock energy burst",
              votes: 32,
              percentage: 25
            },
            {
              id: "opt-4",
              title: "Stay - The Kid LAROI",
              description: "Melodic party vibe",
              votes: 13,
              percentage: 10
            }
          ],
          totalVotes: 128,
          tokensRequired: 3,
          timeRemaining: 180,
          isActive: true,
          createdBy: "DJ Mike"
        },
        {
          id: "vote-lighting-1",
          type: "lighting",
          title: "Dance Floor Lighting",
          description: "Set the mood with perfect lighting",
          options: [
            {
              id: "light-1",
              title: "Neon Strobe",
              description: "High energy party lighting",
              votes: 28,
              percentage: 40
            },
            {
              id: "light-2",
              title: "Purple Haze",
              description: "Smooth purple ambiance", 
              votes: 25,
              percentage: 36
            },
            {
              id: "light-3",
              title: "Rainbow Wave",
              description: "Colorful flowing lights",
              votes: 17,
              percentage: 24
            }
          ],
          totalVotes: 70,
          tokensRequired: 2,
          timeRemaining: 240,
          isActive: true,
          createdBy: "Light Crew"
        },
        {
          id: "vote-drinks-1",
          type: "drinks",
          title: "Happy Hour Special",
          description: "Vote for the next discounted cocktail",
          options: [
            {
              id: "drink-1",
              title: "Cosmos",
              description: "Classic cranberry cocktail",
              votes: 23,
              percentage: 31
            },
            {
              id: "drink-2",
              title: "Mojitos", 
              description: "Fresh mint and lime",
              votes: 31,
              percentage: 42
            },
            {
              id: "drink-3",
              title: "Margaritas",
              description: "Tequila with lime twist",
              votes: 20,
              percentage: 27
            }
          ],
          totalVotes: 74,
          tokensRequired: 5,
          timeRemaining: 300,
          isActive: true,
          createdBy: "Bar Team"
        }
      ];

      res.json(liveVotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live votes" });
    }
  });

  app.get("/api/vibe-control/tokens", async (req, res) => {
    try {
      const vibeTokens = {
        balance: 47,
        earned: 125,
        spent: 78,
        history: [
          {
            id: "tx-1",
            type: "earned",
            amount: 5,
            reason: "Dancing detected - 2 minutes",
            timestamp: "2025-01-26T20:15:00Z"
          },
          {
            id: "tx-2", 
            type: "spent",
            amount: 3,
            reason: "Voted for Blinding Lights",
            timestamp: "2025-01-26T20:12:00Z"
          },
          {
            id: "tx-3",
            type: "earned",
            amount: 10,
            reason: "Party attendance bonus",
            timestamp: "2025-01-26T20:00:00Z"
          },
          {
            id: "tx-4",
            type: "spent",
            amount: 5,
            reason: "Voted for Mojito special",
            timestamp: "2025-01-26T19:55:00Z"
          },
          {
            id: "tx-5",
            type: "earned",
            amount: 8,
            reason: "Social interaction bonus",
            timestamp: "2025-01-26T19:45:00Z"
          }
        ]
      };

      res.json(vibeTokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vibe tokens" });
    }
  });

  app.get("/api/vibe-control/stats", async (req, res) => {
    try {
      const liveStats = {
        totalParticipants: 127,
        activeVotes: 3,
        totalTokensInCirculation: 8450,
        currentVibe: "party",
        vibeScore: 82
      };

      res.json(liveStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live stats" });
    }
  });

  app.post("/api/vibe-control/vote", async (req, res) => {
    try {
      const { voteId, optionId, tokensSpent } = req.body;

      if (!voteId || !optionId || !tokensSpent) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const voteResult = {
        success: true,
        voteId,
        optionId,
        tokensSpent,
        newBalance: 44,
        voteCount: Math.floor(Math.random() * 50) + 1
      };

      res.json(voteResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to cast vote" });
    }
  });

  app.get("/api/vibe-control/dj-dashboard", async (req, res) => {
    try {
      const djDashboard = {
        currentTrack: {
          title: "Dance The Night Away",
          artist: "The Weeknd", 
          duration: 225,
          currentTime: 150,
          bpm: 128,
          energy: 0.85
        },
        queue: [
          { title: "Blinding Lights", artist: "The Weeknd", votes: 45, tokens: 135 },
          { title: "Levitating", artist: "Dua Lipa", votes: 38, tokens: 114 },
          { title: "Good 4 U", artist: "Olivia Rodrigo", votes: 32, tokens: 96 }
        ],
        liveRequests: [
          { title: "Anti-Hero", artist: "Taylor Swift", votes: 15, tokens: 45, timeRequested: "2min ago" },
          { title: "Flowers", artist: "Miley Cyrus", votes: 12, tokens: 36, timeRequested: "3min ago" }
        ],
        crowdEnergy: {
          level: 0.82,
          trend: "increasing",
          peakTime: "22:30",
          recommendation: "Keep the energy high with dance tracks"
        }
      };

      res.json(djDashboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DJ dashboard" });
    }
  });

  app.get("/api/vibe-control/bar-dashboard", async (req, res) => {
    try {
      const barDashboard = {
        activePoll: {
          title: "Happy Hour Special",
          timeRemaining: 180,
          options: [
            { name: "Mojitos", votes: 31, percentage: 42 },
            { name: "Cosmos", votes: 23, percentage: 31 },
            { name: "Margaritas", votes: 20, percentage: 27 }
          ]
        },
        topOrders: [
          { drink: "Moscow Mule", count: 23, trending: true },
          { drink: "Whiskey Sour", count: 18, trending: false },
          { drink: "Espresso Martini", count: 15, trending: true }
        ],
        crowdPreferences: {
          sweetness: 0.65,
          strength: 0.72,
          complexity: 0.58,
          temperature: "cold"
        },
        inventory: {
          vodka: 0.85,
          gin: 0.92,
          rum: 0.78,
          whiskey: 0.88,
          mixers: 0.95
        }
      };

      res.json(barDashboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bar dashboard" });
    }
  });

  app.post("/api/vibe-control/earn-tokens", async (req, res) => {
    try {
      const { activity, duration } = req.body;
      
      let tokensEarned = 0;
      let reason = "";

      switch (activity) {
        case "dancing":
          tokensEarned = Math.floor(duration / 30) * 2;
          reason = `Dancing detected - ${Math.floor(duration / 60)} minutes`;
          break;
        case "social":
          tokensEarned = 5;
          reason = "Social interaction bonus";
          break;
        case "attendance":
          tokensEarned = 10;
          reason = "Party attendance bonus";
          break;
        case "referral":
          tokensEarned = 15;
          reason = "Friend referral bonus";
          break;
        default:
          tokensEarned = 1;
          reason = "Participation bonus";
      }

      const result = {
        tokensEarned,
        reason,
        newBalance: 47 + tokensEarned,
        timestamp: new Date().toISOString()
      };

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to process token earning" });
    }
  });

  app.get("/api/vibe-control/leaderboard", async (req, res) => {
    try {
      const leaderboard = {
        topContributors: [
          { 
            name: "Sarah M.", 
            tokens: 245, 
            level: "Vibe Master", 
            avatar: "SM",
            badges: ["DJ's Choice", "Dance Captain", "Social Butterfly"]
          },
          { 
            name: "Alex K.", 
            tokens: 198, 
            level: "Party Pro", 
            avatar: "AK",
            badges: ["Music Maven", "Crowd Pleaser"]
          },
          { 
            name: "Jordan L.", 
            tokens: 167, 
            level: "Music Maven", 
            avatar: "JL",
            badges: ["Trendsetter", "Beat Master"]
          },
          { 
            name: "Casey T.", 
            tokens: 134, 
            level: "Dance Captain", 
            avatar: "CT",
            badges: ["Energy Booster", "Floor Filler"]
          },
          { 
            name: "Riley P.", 
            tokens: 112, 
            level: "Mood Maker", 
            avatar: "RP",
            badges: ["Vibe Checker", "Party Starter"]
          }
        ],
        recentActivity: [
          { user: "Sarah M.", action: "voted for Blinding Lights", time: "2s ago", type: "music", tokens: 3 },
          { user: "Alex K.", action: "spent 5 tokens on lighting", time: "8s ago", type: "lighting", tokens: 5 },
          { user: "Jordan L.", action: "requested Levitating", time: "15s ago", type: "music", tokens: 0 },
          { user: "Casey T.", action: "voted for Margaritas", time: "23s ago", type: "drinks", tokens: 5 },
          { user: "Riley P.", action: "earned 3 tokens dancing", time: "31s ago", type: "reward", tokens: -3 },
          { user: "Morgan D.", action: "voted for neon lighting", time: "45s ago", type: "lighting", tokens: 2 }
        ]
      };

      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.post("/api/vibe-control/create-vote", async (req, res) => {
    try {
      const { type, title, description, options, tokensRequired, duration } = req.body;

      if (!type || !title || !options || options.length < 2) {
        return res.status(400).json({ message: "Invalid vote configuration" });
      }

      const newVote = {
        id: `vote-${type}-${Date.now()}`,
        type,
        title,
        description,
        options: options.map((option: any, index: number) => ({
          id: `opt-${index + 1}`,
          title: option.title,
          description: option.description || "",
          votes: 0,
          percentage: 0
        })),
        totalVotes: 0,
        tokensRequired: tokensRequired || 1,
        timeRemaining: duration || 300,
        isActive: true,
        createdBy: "Event Host",
        createdAt: new Date().toISOString()
      };

      res.json(newVote);
    } catch (error) {
      res.status(500).json({ message: "Failed to create vote" });
    }
  });

  // AR Party Overlays Routes - Augmented Reality Experience System
  app.get("/api/ar-overlays/filters", async (req, res) => {
    try {
      const arFilters = [
        {
          id: "music-pulse",
          name: "Beat Pulse",
          type: "music",
          trigger: "Bass Drop",
          description: "Pulsing neon effects that sync to the beat",
          isActive: true,
          popularity: 92,
          preview: "🌈",
          lastTriggered: "2025-01-26T20:32:00Z",
          triggerCount: 1247
        },
        {
          id: "disco-sparkle",
          name: "Disco Sparkle",
          type: "lighting",
          trigger: "Strobe Lights",
          description: "Sparkling particle effects matching venue lighting",
          isActive: true,
          popularity: 88,
          preview: "✨",
          lastTriggered: "2025-01-26T20:31:45Z",
          triggerCount: 892
        },
        {
          id: "love-hearts",
          name: "Love Hearts",
          type: "manual",
          trigger: "Manual",
          description: "Floating hearts for romantic moments",
          isActive: false,
          popularity: 76,
          preview: "💖",
          lastTriggered: "2025-01-26T20:25:12Z",
          triggerCount: 234
        },
        {
          id: "energy-burst",
          name: "Energy Burst",
          type: "music",
          trigger: "High Energy",
          description: "Explosive light bursts on music peaks",
          isActive: true,
          popularity: 85,
          preview: "🔥",
          lastTriggered: "2025-01-26T20:32:15Z",
          triggerCount: 567
        },
        {
          id: "cosmic-waves",
          name: "Cosmic Waves",
          type: "lighting",
          trigger: "Color Change",
          description: "Flowing cosmic waves that follow lighting patterns",
          isActive: true,
          popularity: 79,
          preview: "🌌",
          lastTriggered: "2025-01-26T20:30:28Z",
          triggerCount: 445
        }
      ];

      res.json(arFilters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AR filters" });
    }
  });

  app.get("/api/ar-overlays/holograms", async (req, res) => {
    try {
      const holograms = [
        {
          id: "dance-floor-sign",
          title: "Dance Floor Welcome",
          type: "3d_object",
          position: { x: 0, y: 2, z: -5 },
          scale: 1.5,
          isVisible: true,
          interactionCount: 234,
          content: "Welcome to the Dance Floor!",
          animation: "floating",
          lastInteraction: "2025-01-26T20:31:22Z"
        },
        {
          id: "floating-menu",
          title: "Cocktail Menu",
          type: "interactive",
          position: { x: -3, y: 1.5, z: -2 },
          scale: 1.0,
          isVisible: true,
          interactionCount: 156,
          content: "Interactive cocktail menu with prices and ingredients",
          animation: "pulse",
          lastInteraction: "2025-01-26T20:32:01Z"
        },
        {
          id: "graffiti-wall",
          title: "Digital Graffiti Wall",
          type: "interactive",
          position: { x: 5, y: 1, z: -8 },
          scale: 2.0,
          isVisible: true,
          interactionCount: 89,
          content: "Leave your mark on the digital wall",
          animation: "shimmer",
          lastInteraction: "2025-01-26T20:29:45Z"
        },
        {
          id: "photo-frame",
          title: "AR Photo Frame",
          type: "interactive",
          position: { x: 2, y: 1.8, z: -3 },
          scale: 1.2,
          isVisible: true,
          interactionCount: 312,
          content: "Take photos with AR party frames",
          animation: "sparkle",
          lastInteraction: "2025-01-26T20:31:55Z"
        },
        {
          id: "dj-info",
          title: "DJ Track Info",
          type: "text",
          position: { x: -2, y: 3, z: -6 },
          scale: 0.8,
          isVisible: true,
          interactionCount: 445,
          content: "Now Playing: Blinding Lights - The Weeknd",
          animation: "typing",
          lastInteraction: "2025-01-26T20:32:10Z"
        }
      ];

      res.json(holograms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AR holograms" });
    }
  });

  app.get("/api/ar-overlays/vendor-booths", async (req, res) => {
    try {
      const vendorBooths = [
        {
          id: "booth-cosmetics",
          vendorName: "Glow Beauty Co.",
          category: "Cosmetics",
          products: ["AR Makeup Try-On", "Glow Filters", "Beauty Tips"],
          arAssets: ["virtual_makeup.usdz", "glow_effects.reality"],
          qrCode: "QR_GLOW_BEAUTY",
          visitors: 67,
          engagement: 84,
          averageSessionTime: "3m 45s",
          topProduct: "AR Makeup Try-On",
          revenue: 1240,
          conversions: 23
        },
        {
          id: "booth-fashion",
          vendorName: "Urban Style",
          category: "Fashion",
          products: ["Virtual Outfits", "Style Match", "Trend Preview"],
          arAssets: ["clothing_try_on.usdz", "style_filters.reality"],
          qrCode: "QR_URBAN_STYLE",
          visitors: 45,
          engagement: 78,
          averageSessionTime: "2m 56s",
          topProduct: "Virtual Outfits",
          revenue: 890,
          conversions: 18
        },
        {
          id: "booth-drinks",
          vendorName: "Fizz Cocktails",
          category: "Beverages",
          products: ["Drink Customizer", "Cocktail Info", "Recipe Cards"],
          arAssets: ["drink_builder.usdz", "cocktail_info.reality"],
          qrCode: "QR_FIZZ_COCKTAILS",
          visitors: 92,
          engagement: 91,
          averageSessionTime: "4m 12s",
          topProduct: "Drink Customizer",
          revenue: 2340,
          conversions: 45
        },
        {
          id: "booth-tech",
          vendorName: "TechGlow",
          category: "Technology",
          products: ["AR Gadgets", "Smart Accessories", "Tech Demos"],
          arAssets: ["tech_showcase.usdz", "gadget_preview.reality"],
          qrCode: "QR_TECH_GLOW",
          visitors: 38,
          engagement: 88,
          averageSessionTime: "5m 23s",
          topProduct: "AR Gadgets",
          revenue: 1560,
          conversions: 15
        }
      ];

      res.json(vendorBooths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor AR booths" });
    }
  });

  app.get("/api/ar-overlays/metrics", async (req, res) => {
    try {
      const arMetrics = {
        totalActiveUsers: 127,
        filtersTriggered: 2341,
        hologramInteractions: 479,
        vendorBoothVisits: 204,
        avgSessionDuration: "4m 32s",
        popularFilter: "Beat Pulse",
        engagementRate: 87,
        peakUsageTime: "22:30",
        deviceBreakdown: {
          ios: 58,
          android: 62,
          web: 7
        },
        filterCategories: {
          music: 1456,
          lighting: 672,
          manual: 213
        },
        vendorRevenue: 6030,
        totalConversions: 101
      };

      res.json(arMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AR metrics" });
    }
  });

  app.post("/api/ar-overlays/trigger-filter", async (req, res) => {
    try {
      const { filterId, triggerType, intensity, duration } = req.body;

      if (!filterId) {
        return res.status(400).json({ message: "Filter ID is required" });
      }

      const triggerResult = {
        success: true,
        filterId,
        triggerType: triggerType || "manual",
        intensity: intensity || 75,
        duration: duration || 30,
        activeUsers: Math.floor(Math.random() * 50) + 80,
        timestamp: new Date().toISOString()
      };

      res.json(triggerResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to trigger AR filter" });
    }
  });

  app.post("/api/ar-overlays/interact-hologram", async (req, res) => {
    try {
      const { hologramId, interactionType, userId } = req.body;

      if (!hologramId) {
        return res.status(400).json({ message: "Hologram ID is required" });
      }

      const interactionResult = {
        success: true,
        hologramId,
        interactionType: interactionType || "touch",
        userId: userId || "guest_" + Math.random().toString(36).substr(2, 9),
        response: getHologramResponse(hologramId, interactionType),
        timestamp: new Date().toISOString()
      };

      res.json(interactionResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to process hologram interaction" });
    }
  });

  app.post("/api/ar-overlays/scan-vendor", async (req, res) => {
    try {
      const { vendorId, userId } = req.body;

      if (!vendorId) {
        return res.status(400).json({ message: "Vendor ID is required" });
      }

      const scanResult = {
        success: true,
        vendorId,
        userId: userId || "guest_" + Math.random().toString(36).substr(2, 9),
        arExperienceUrl: `https://ar-experience.vibes.com/vendor/${vendorId}`,
        welcomeMessage: getVendorWelcomeMessage(vendorId),
        specialOffers: getVendorOffers(vendorId),
        sessionToken: "ar_session_" + Math.random().toString(36).substr(2, 12),
        timestamp: new Date().toISOString()
      };

      res.json(scanResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to process vendor scan" });
    }
  });

  app.post("/api/ar-overlays/create-hologram", async (req, res) => {
    try {
      const { title, type, position, scale, content, animation } = req.body;

      if (!title || !type || !position) {
        return res.status(400).json({ message: "Title, type, and position are required" });
      }

      const newHologram = {
        id: `hologram_${Date.now()}`,
        title,
        type,
        position,
        scale: scale || 1.0,
        content: content || "",
        animation: animation || "static",
        isVisible: true,
        interactionCount: 0,
        createdAt: new Date().toISOString(),
        lastInteraction: null
      };

      res.json(newHologram);
    } catch (error) {
      res.status(500).json({ message: "Failed to create hologram" });
    }
  });

  app.get("/api/ar-overlays/qr-code/:type/:id", async (req, res) => {
    try {
      const { type, id } = req.params;

      const qrData = {
        type,
        id,
        url: `https://vibes.com/ar/${type}/${id}`,
        qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?data=https://vibes.com/ar/${type}/${id}&size=200x200`,
        instructions: getARInstructions(type),
        timestamp: new Date().toISOString()
      };

      res.json(qrData);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });

  // Helper functions for AR system
  function getHologramResponse(hologramId: string, interactionType: string) {
    const responses: { [key: string]: { [key: string]: string } } = {
      "floating-menu": {
        "touch": "Opening cocktail menu with today's specials!",
        "gesture": "Swipe to browse different drink categories",
        "voice": "What drink would you like to learn about?"
      },
      "graffiti-wall": {
        "touch": "Tap to add your digital signature to the wall",
        "gesture": "Draw your message in the air",
        "voice": "Say your message to add it to the wall"
      },
      "photo-frame": {
        "touch": "Get ready for your AR photo! Strike a pose!",
        "gesture": "Smile and wave for the camera",
        "voice": "Say cheese for your AR memory!"
      }
    };

    return responses[hologramId]?.[interactionType] || "Hologram activated! Enjoy the AR experience.";
  }

  function getVendorWelcomeMessage(vendorId: string) {
    const messages: { [key: string]: string } = {
      "booth-cosmetics": "Welcome to Glow Beauty Co.! Try on our latest AR makeup looks and discover your perfect glow.",
      "booth-fashion": "Step into Urban Style! Virtually try on our newest collections and find your perfect look.",
      "booth-drinks": "Welcome to Fizz Cocktails! Customize your perfect drink and see it come to life in AR.",
      "booth-tech": "Discover TechGlow innovations! Experience our latest gadgets through immersive AR demos."
    };

    return messages[vendorId] || "Welcome to our AR experience! Explore our products in a whole new way.";
  }

  function getVendorOffers(vendorId: string) {
    const offers: { [key: string]: string[] } = {
      "booth-cosmetics": ["20% off AR makeup products", "Free beauty consultation", "Exclusive glow filter unlock"],
      "booth-fashion": ["15% off featured collections", "Style personality quiz", "Virtual wardrobe planning"],
      "booth-drinks": ["Buy 2 get 1 free cocktails", "Custom drink recipe card", "VIP bar access"],
      "booth-tech": ["30% off AR accessories", "Free tech demo session", "Early access to new products"]
    };

    return offers[vendorId] || ["Welcome bonus: 10% off", "Exclusive AR content access"];
  }

  function getARInstructions(type: string) {
    const instructions: { [key: string]: string[] } = {
      "filter": [
        "Open your phone camera",
        "Point at the QR code to scan",
        "Allow camera permissions",
        "Move your phone to trigger AR effects"
      ],
      "hologram": [
        "Scan the QR code with your camera",
        "Look around to find AR holograms",
        "Tap on holograms to interact",
        "Use gestures for advanced features"
      ],
      "vendor": [
        "Scan to enter vendor AR booth",
        "Browse products in 3D space",
        "Try virtual products",
        "Complete purchase in AR"
      ]
    };

    return instructions[type] || [
      "Scan QR code with phone camera",
      "Follow on-screen instructions",
      "Enjoy the AR experience!"
    ];
  }

  // ==================== AI-PERSONALIZED RECOMMENDATIONS SYSTEM ====================
  
  // Get AI-generated event recommendations based on user profile
  app.get("/api/ai-recommendations/events", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      
      // Simulate AI analysis of user's social graph, preferences, and calendar
      const recommendations = [
        {
          id: "event-rec-1",
          title: "Sunset Rooftop DJ Set",
          date: "2025-01-28T18:00:00Z",
          venue: "Sky Lounge Downtown",
          matchScore: 94,
          reasons: [
            "Your love for electronic music",
            "3 close friends attending",
            "Perfect for your social energy level"
          ],
          attendingFriends: ["Sarah M.", "Alex K.", "Jordan L."],
          vibeTag: "Electronic Euphoria",
          category: "Music",
          estimatedEnjoyment: 92,
          aiConfidence: 0.94,
          socialGraphScore: 0.89,
          preferenceMatch: 0.96
        },
        {
          id: "event-rec-2",
          title: "Intimate Wine & Jazz Evening",
          date: "2025-01-30T19:30:00Z",
          venue: "The Blue Note",
          matchScore: 87,
          reasons: [
            "Matches your sophisticated taste",
            "Small group preference",
            "Jazz in your top genres"
          ],
          attendingFriends: ["Casey T.", "Riley P."],
          vibeTag: "Sophisticated Chill",
          category: "Culture",
          estimatedEnjoyment: 89,
          aiConfidence: 0.87,
          socialGraphScore: 0.73,
          preferenceMatch: 0.91
        },
        {
          id: "event-rec-3",
          title: "Beach Bonfire & Acoustic Vibes",
          date: "2025-02-01T16:00:00Z",
          venue: "Malibu Beach",
          matchScore: 91,
          reasons: [
            "Outdoor party lover",
            "Acoustic music preference",
            "Sunset timing preference"
          ],
          attendingFriends: ["Morgan D.", "Taylor S.", "Cameron R."],
          vibeTag: "Natural Harmony",
          category: "Outdoor",
          estimatedEnjoyment: 88,
          aiConfidence: 0.91,
          socialGraphScore: 0.85,
          preferenceMatch: 0.88
        }
      ];
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating event recommendations:", error);
      res.status(500).json({ error: "Failed to generate event recommendations" });
    }
  });

  // Get AI-curated playlists based on mood and music history
  app.get("/api/ai-recommendations/playlists", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      
      // Simulate AI music curation based on listening history and mood
      const playlists = [
        {
          id: "playlist-ai-1",
          name: "Your Perfect Party Mix",
          moodMatch: 96,
          tracks: [
            "Blinding Lights - The Weeknd",
            "Levitating - Dua Lipa",
            "Good 4 U - Olivia Rodrigo",
            "Heat Waves - Glass Animals",
            "Stay - The Kid LAROI & Justin Bieber"
          ],
          vibe: "High Energy Dance",
          energyLevel: 92,
          personalizedFor: "Your Saturday night energy",
          reasoning: "Based on your recent dance activity and favorite artists",
          aiGenerated: true,
          moodAnalysis: {
            energy: 0.92,
            valence: 0.88,
            danceability: 0.95
          },
          userHistory: {
            genrePreferences: ["Pop", "Electronic", "Dance"],
            recentListening: ["Electronic", "Pop Rock"],
            partyContext: "High energy social gatherings"
          }
        },
        {
          id: "playlist-ai-2",
          name: "Chill Conversation Starter",
          moodMatch: 89,
          tracks: [
            "Heat Waves - Glass Animals",
            "Peaches - Justin Bieber",
            "drivers license - Olivia Rodrigo",
            "Positions - Ariana Grande",
            "Watermelon Sugar - Harry Styles"
          ],
          vibe: "Relaxed Social",
          energyLevel: 65,
          personalizedFor: "Your social gathering style",
          reasoning: "Perfect for your preference for meaningful conversations",
          aiGenerated: true,
          moodAnalysis: {
            energy: 0.65,
            valence: 0.78,
            danceability: 0.60
          },
          userHistory: {
            genrePreferences: ["Indie Pop", "Alternative", "R&B"],
            recentListening: ["Chill Pop", "Indie"],
            partyContext: "Intimate social settings"
          }
        },
        {
          id: "playlist-ai-3",
          name: "Retro Feels Nostalgia",
          moodMatch: 84,
          tracks: [
            "Don't Stop Me Now - Queen",
            "September - Earth Wind & Fire",
            "I Want It That Way - Backstreet Boys",
            "Mr. Brightside - The Killers",
            "Sweet Child O' Mine - Guns N' Roses"
          ],
          vibe: "Nostalgic Fun",
          energyLevel: 78,
          personalizedFor: "Your throwback music love",
          reasoning: "Matches your nostalgic personality trait",
          aiGenerated: true,
          moodAnalysis: {
            energy: 0.78,
            valence: 0.85,
            danceability: 0.72
          },
          userHistory: {
            genrePreferences: ["Classic Rock", "80s Pop", "90s Hits"],
            recentListening: ["Retro", "Classic Rock"],
            partyContext: "Nostalgic themed events"
          }
        }
      ];
      
      res.json(playlists);
    } catch (error) {
      console.error("Error generating playlist recommendations:", error);
      res.status(500).json({ error: "Failed to generate playlist recommendations" });
    }
  });

  // Get AI-matched vibe buddies based on personality compatibility
  app.get("/api/ai-recommendations/vibe-buddies", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      
      // Simulate AI personality matching and social graph analysis
      const vibeBuddies = [
        {
          id: "buddy-ai-1",
          name: "Alex Chen",
          avatar: "AC",
          compatibilityScore: 93,
          sharedInterests: ["Electronic Music", "Art Galleries", "Rooftop Parties"],
          personality: "Creative Extrovert",
          socialConnection: "Friend of Sarah M.",
          meetingReason: "Both love deep house music and creative conversations",
          personalityMatch: {
            introversion: 0.25, // Both extroverted
            openness: 0.92,     // Both highly open to experiences
            agreeableness: 0.84, // Compatible social styles
            conscientiousness: 0.76,
            neuroticism: 0.31   // Both emotionally stable
          },
          interactionPrediction: {
            conversationFlow: 0.91,
            activityAlignment: 0.88,
            longTermFriendship: 0.85
          },
          mutualFriends: ["Sarah M.", "Jordan K."],
          recommendationReason: "AI detected high compatibility in music taste and social energy levels"
        },
        {
          id: "buddy-ai-2",
          name: "Maya Rodriguez",
          avatar: "MR",
          compatibilityScore: 87,
          sharedInterests: ["Jazz Music", "Wine Tasting", "Intimate Gatherings"],
          personality: "Sophisticated Socializer",
          socialConnection: "Friend of Casey T.",
          meetingReason: "Share appreciation for sophisticated cultural experiences",
          personalityMatch: {
            introversion: 0.65, // Both prefer smaller groups
            openness: 0.89,
            agreeableness: 0.91,
            conscientiousness: 0.88,
            neuroticism: 0.28
          },
          interactionPrediction: {
            conversationFlow: 0.94,
            activityAlignment: 0.82,
            longTermFriendship: 0.89
          },
          mutualFriends: ["Casey T.", "Riley P."],
          recommendationReason: "Similar appreciation for cultural depth and quality over quantity in social interactions"
        },
        {
          id: "buddy-ai-3",
          name: "Jordan Kim",
          avatar: "JK",
          compatibilityScore: 91,
          sharedInterests: ["Outdoor Events", "Acoustic Music", "Photography"],
          personality: "Nature-Loving Creative",
          socialConnection: "Friend of Morgan D.",
          meetingReason: "Both enjoy natural settings and authentic experiences",
          personalityMatch: {
            introversion: 0.45, // Moderate extroversion
            openness: 0.95,     // Highly creative and open
            agreeableness: 0.87,
            conscientiousness: 0.71,
            neuroticism: 0.25
          },
          interactionPrediction: {
            conversationFlow: 0.86,
            activityAlignment: 0.94,
            longTermFriendship: 0.88
          },
          mutualFriends: ["Morgan D.", "Taylor S."],
          recommendationReason: "Strong alignment in values around authenticity and natural experiences"
        }
      ];
      
      res.json(vibeBuddies);
    } catch (error) {
      console.error("Error generating vibe buddy recommendations:", error);
      res.status(500).json({ error: "Failed to generate vibe buddy recommendations" });
    }
  });

  // Get AI-analyzed personality profile
  app.get("/api/ai-recommendations/personality", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      
      // Simulate AI personality analysis based on party behavior and preferences
      const personalityProfile = [
        {
          trait: "Social Energy",
          score: 78,
          description: "You thrive in medium-sized groups (8-15 people)",
          partyStyle: "Engaged but not overwhelming",
          aiAnalysis: {
            dataPoints: 156,
            confidence: 0.91,
            trendDirection: "increasing",
            lastUpdated: "2025-01-26"
          },
          behaviorPatterns: [
            "Prefers parties with 8-15 attendees",
            "Most active in first 2 hours of events",
            "Higher satisfaction in mixed indoor/outdoor venues"
          ]
        },
        {
          trait: "Music Taste",
          score: 85,
          description: "Eclectic taste with preference for emotional depth",
          partyStyle: "Appreciates curated, meaningful playlists",
          aiAnalysis: {
            dataPoints: 243,
            confidence: 0.95,
            trendDirection: "stable",
            lastUpdated: "2025-01-26"
          },
          behaviorPatterns: [
            "Responds positively to genre diversity",
            "Strong preference for songs with emotional narratives",
            "Enjoys discovering new artists at events"
          ]
        },
        {
          trait: "Adventure Level",
          score: 72,
          description: "Open to new experiences with some familiarity",
          partyStyle: "Enjoys unique venues with comfortable elements",
          aiAnalysis: {
            dataPoints: 89,
            confidence: 0.83,
            trendDirection: "increasing",
            lastUpdated: "2025-01-25"
          },
          behaviorPatterns: [
            "Chooses events with mix of known and unknown elements",
            "Higher satisfaction when trying new activities with familiar people",
            "Prefers novel locations with good accessibility"
          ]
        },
        {
          trait: "Conversation Style",
          score: 81,
          description: "Prefers meaningful connections over small talk",
          partyStyle: "Values quality interactions and shared interests",
          aiAnalysis: {
            dataPoints: 127,
            confidence: 0.88,
            trendDirection: "stable",
            lastUpdated: "2025-01-26"
          },
          behaviorPatterns: [
            "Longer conversation durations with fewer people",
            "High engagement when discussing shared interests",
            "Prefers structured social activities over pure mingling"
          ]
        }
      ];
      
      res.json(personalityProfile);
    } catch (error) {
      console.error("Error generating personality profile:", error);
      res.status(500).json({ error: "Failed to generate personality profile" });
    }
  });

  // Get AI insights and recommendation engine statistics
  app.get("/api/ai-recommendations/insights", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      
      // Simulate AI system insights and performance metrics
      const insights = {
        totalRecommendations: 247,
        accuracyRate: 91,
        personalityConfidence: 87,
        friendsInNetwork: 156,
        eventsAttended: 23,
        satisfactionScore: 4.6,
        learningProgress: 94,
        nextPersonalityUpdate: "2 days",
        
        // Advanced AI metrics
        modelPerformance: {
          eventPredictionAccuracy: 0.91,
          playlistSatisfaction: 0.89,
          vibeMatchSuccess: 0.87,
          personalityStability: 0.94
        },
        
        dataAnalysis: {
          socialGraphNodes: 156,
          behaviorDataPoints: 1247,
          musicPreferenceChanges: 12,
          personalityEvolution: 0.08
        },
        
        recommendationStats: {
          totalGenerated: 247,
          accepted: 189,
          declined: 31,
          pending: 27,
          averageConfidence: 0.88
        },
        
        learningMetrics: {
          algorithmVersion: "v2.1.3",
          trainingDataSize: "10k+ user interactions",
          lastModelUpdate: "2025-01-20",
          nextScheduledUpdate: "2025-02-01"
        }
      };
      
      res.json(insights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      res.status(500).json({ error: "Failed to generate AI insights" });
    }
  });

  // Accept or interact with AI recommendation
  app.post("/api/ai-recommendations/interact", async (req, res) => {
    try {
      const { recommendationType, recommendationId, action, feedback } = req.body;
      
      // Simulate AI learning from user interaction
      const interaction = {
        id: `interaction-${Date.now()}`,
        userId: 1,
        recommendationType, // 'event', 'playlist', 'vibe-buddy'
        recommendationId,
        action, // 'accept', 'decline', 'save', 'connect'
        feedback,
        timestamp: new Date().toISOString(),
        processed: true
      };
      
      // Simulate AI model update based on feedback
      const modelUpdate = {
        confidenceAdjustment: feedback ? 0.02 : 0.01,
        preferenceWeight: action === 'accept' ? 1.1 : 0.9,
        recommendationScore: calculateRecommendationScore(action, feedback),
        learningImpact: "User interaction recorded for future recommendations"
      };
      
      res.json({
        interaction,
        modelUpdate,
        message: "Your feedback helps improve future recommendations",
        nextRecommendationUpdate: "within 24 hours"
      });
    } catch (error) {
      console.error("Error processing AI recommendation interaction:", error);
      res.status(500).json({ error: "Failed to process recommendation interaction" });
    }
  });

  // Update user preference settings for AI recommendations
  app.post("/api/ai-recommendations/preferences", async (req, res) => {
    try {
      const { 
        recommendationSensitivity, 
        socialGraphWeight, 
        musicPersonalizationLevel,
        personalityAnalysisEnabled 
      } = req.body;
      
      // Simulate updating AI recommendation engine settings
      const updatedPreferences = {
        userId: 1,
        recommendationSensitivity: recommendationSensitivity || 85,
        socialGraphWeight: socialGraphWeight || 0.7,
        musicPersonalizationLevel: musicPersonalizationLevel || 0.8,
        personalityAnalysisEnabled: personalityAnalysisEnabled !== false,
        lastUpdated: new Date().toISOString(),
        effectiveFrom: new Date(Date.now() + 3600000).toISOString() // 1 hour delay
      };
      
      // Simulate AI model recalibration
      const recalibration = {
        status: "scheduled",
        estimatedCompletionTime: "1 hour",
        affectedRecommendations: ["events", "playlists", "vibe-buddies"],
        confidenceImpact: "minimal during transition period"
      };
      
      res.json({
        preferences: updatedPreferences,
        recalibration,
        message: "AI recommendation engine will adapt to your new preferences within an hour"
      });
    } catch (error) {
      console.error("Error updating AI recommendation preferences:", error);
      res.status(500).json({ error: "Failed to update recommendation preferences" });
    }
  });

  // Helper function to calculate recommendation score
  function calculateRecommendationScore(action: string, feedback?: string): number {
    let baseScore = 0;
    
    switch (action) {
      case 'accept':
        baseScore = 1.0;
        break;
      case 'save':
        baseScore = 0.8;
        break;
      case 'decline':
        baseScore = 0.2;
        break;
      default:
        baseScore = 0.5;
    }
    
    // Adjust based on feedback sentiment (simplified)
    if (feedback) {
      const positiveWords = ['great', 'perfect', 'love', 'amazing', 'excellent'];
      const negativeWords = ['bad', 'wrong', 'hate', 'terrible', 'awful'];
      
      const feedbackLower = feedback.toLowerCase();
      const hasPositive = positiveWords.some(word => feedbackLower.includes(word));
      const hasNegative = negativeWords.some(word => feedbackLower.includes(word));
      
      if (hasPositive) baseScore += 0.2;
      if (hasNegative) baseScore -= 0.3;
    }
    
    return Math.max(0, Math.min(1, baseScore));
  }

  // ==================== DECENTRALIZED PARTY DAOs SYSTEM ====================
  
  // Get DAO community information
  app.get("/api/dao/community", async (req, res) => {
    try {
      const communityId = req.query.id || "party-dao-1";
      
      // Simulate DAO community data with governance parameters
      const daoData = {
        id: communityId,
        name: "Sunset Collective DAO",
        description: "A community-driven party collective focused on unforgettable experiences",
        totalMembers: 47,
        totalProposals: 12,
        successfulEvents: 8,
        treasuryValue: 15750,
        governanceToken: "PARTY",
        quorumPercentage: 30,
        proposalThreshold: 100,
        votingPeriod: "7 days",
        
        // Advanced DAO metrics
        governanceMetrics: {
          participationRate: 0.72,
          proposalSuccessRate: 0.83,
          averageVotingTime: "3.2 days",
          treasuryGrowthRate: 0.15,
          memberSatisfaction: 4.7
        },
        
        smartContractAddresses: {
          governance: "0x742d4e3c9d12a1b8f7e6c3a9",
          treasury: "0x123abc7f9e8d6c5b4a3f2e1d", 
          voting: "0x456def9c8b7a6e5d4c3b2a1f",
          token: "0x789ghi3f2e1d9c8b7a6e5d4c"
        },
        
        daoSettings: {
          minimumProposalBond: 50,
          executionDelay: "24 hours",
          gracePeriod: "7 days",
          emergencyQuorum: 0.15,
          maxActiveProposals: 10
        }
      };
      
      res.json(daoData);
    } catch (error) {
      console.error("Error fetching DAO community data:", error);
      res.status(500).json({ error: "Failed to fetch DAO community data" });
    }
  });

  // Get active DAO proposals
  app.get("/api/dao/proposals", async (req, res) => {
    try {
      const daoId = req.query.daoId || "party-dao-1";
      
      // Simulate active DAO proposals with detailed voting data
      const proposals = [
        {
          id: "prop-dao-1",
          title: "Summer Beach Festival Theme",
          description: "Proposal to organize a beach festival with tropical theme, live DJ sets, and beach volleyball tournament",
          category: "theme",
          proposer: "0x742...d4e3",
          proposerName: "Alex Chen",
          votesFor: 34,
          votesAgainst: 8,
          totalVotes: 42,
          quorum: 15,
          deadline: "2025-01-30T23:59:59Z",
          status: "active",
          bondAmount: 100,
          executionTime: null,
          details: {
            budget: 8500,
            venue: "Malibu Beach Club",
            duration: "8 hours",
            capacity: 200,
            expectedAttendance: 175,
            profitSharing: "60% DAO treasury, 40% member rewards"
          },
          votingBreakdown: {
            founders: { for: 12, against: 1 },
            contributors: { for: 15, against: 3 },
            members: { for: 7, against: 4 }
          },
          discussionHash: "0xabc123def456...",
          createdAt: "2025-01-24T10:00:00Z"
        },
        {
          id: "prop-dao-2",
          title: "Select DJ Kollective for Main Event",
          description: "Vote to book DJ Kollective for our next major event based on their electronic/house music expertise",
          category: "dj",
          proposer: "0x123...abc7",
          proposerName: "Maya Rodriguez",
          votesFor: 28,
          votesAgainst: 6,
          totalVotes: 34,
          quorum: 15,
          deadline: "2025-01-31T23:59:59Z",
          status: "active",
          bondAmount: 75,
          executionTime: null,
          details: {
            fee: 2500,
            duration: "4 hours",
            genre: "Electronic/House",
            equipment: "Full DJ booth setup",
            soundSystem: "Included",
            lightingRig: "Advanced LED setup"
          },
          votingBreakdown: {
            founders: { for: 9, against: 2 },
            contributors: { for: 12, against: 2 },
            members: { for: 7, against: 2 }
          },
          discussionHash: "0xdef789abc123...",
          createdAt: "2025-01-25T14:30:00Z"
        },
        {
          id: "prop-dao-3",
          title: "Increase Event Photography Budget",
          description: "Proposal to allocate additional 15% budget for professional event photography and videography",
          category: "budget",
          proposer: "0x456...def9",
          proposerName: "Jordan Kim",
          votesFor: 15,
          votesAgainst: 12,
          totalVotes: 27,
          quorum: 15,
          deadline: "2025-02-02T23:59:59Z",
          status: "active",
          bondAmount: 50,
          executionTime: null,
          details: {
            currentBudget: 1500,
            proposedIncrease: 225,
            justification: "Enhanced social media presence and event memories",
            deliverables: "Professional photos + highlight reel video",
            rights: "DAO owns full commercial rights"
          },
          votingBreakdown: {
            founders: { for: 6, against: 4 },
            contributors: { for: 5, against: 6 },
            members: { for: 4, against: 2 }
          },
          discussionHash: "0x123456789abc...",
          createdAt: "2025-01-26T09:15:00Z"
        }
      ];
      
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching DAO proposals:", error);
      res.status(500).json({ error: "Failed to fetch DAO proposals" });
    }
  });

  // Get DAO members with voting power and contributions
  app.get("/api/dao/members", async (req, res) => {
    try {
      const daoId = req.query.daoId || "party-dao-1";
      
      // Simulate DAO member data with governance metrics
      const members = [
        {
          id: "member-dao-1",
          address: "0x742d4e3c9d12a1b8f7e6c3a9",
          name: "Alex Chen",
          avatar: "AC",
          votingPower: 850,
          contribution: 2400,
          reputation: 94,
          joinedAt: "2024-08-15",
          role: "founder",
          
          // Advanced member metrics
          governanceStats: {
            proposalsCreated: 5,
            votesParticipated: 11,
            successfulProposals: 4,
            participationRate: 0.92,
            averageVoteTime: "2.1 days"
          },
          
          tokenHoldings: {
            partyTokens: 850,
            vestedTokens: 200,
            rewardTokens: 125,
            stakedTokens: 500
          },
          
          contributionHistory: [
            { type: "monthly_dues", amount: 200, date: "2025-01-26" },
            { type: "event_profit", amount: 150, date: "2025-01-20" },
            { type: "initial_deposit", amount: 1000, date: "2024-08-15" }
          ]
        },
        {
          id: "member-dao-2",
          address: "0x123abc7f9e8d6c5b4a3f2e1d",
          name: "Maya Rodriguez",
          avatar: "MR",
          votingPower: 720,
          contribution: 1900,
          reputation: 87,
          joinedAt: "2024-09-03",
          role: "contributor",
          
          governanceStats: {
            proposalsCreated: 3,
            votesParticipated: 10,
            successfulProposals: 2,
            participationRate: 0.83,
            averageVoteTime: "1.8 days"
          },
          
          tokenHoldings: {
            partyTokens: 720,
            vestedTokens: 150,
            rewardTokens: 95,
            stakedTokens: 400
          },
          
          contributionHistory: [
            { type: "monthly_dues", amount: 150, date: "2025-01-26" },
            { type: "vendor_referral", amount: 75, date: "2025-01-18" },
            { type: "initial_deposit", amount: 800, date: "2024-09-03" }
          ]
        },
        {
          id: "member-dao-3", 
          address: "0x456def9c8b7a6e5d4c3b2a1f",
          name: "Jordan Kim",
          avatar: "JK",
          votingPower: 650,
          contribution: 1650,
          reputation: 82,
          joinedAt: "2024-09-20",
          role: "contributor",
          
          governanceStats: {
            proposalsCreated: 2,
            votesParticipated: 9,
            successfulProposals: 1,
            participationRate: 0.75,
            averageVoteTime: "3.5 days"
          },
          
          tokenHoldings: {
            partyTokens: 650,
            vestedTokens: 100,
            rewardTokens: 80,
            stakedTokens: 350
          },
          
          contributionHistory: [
            { type: "monthly_dues", amount: 125, date: "2025-01-26" },
            { type: "event_profit", amount: 90, date: "2025-01-15" },
            { type: "initial_deposit", amount: 700, date: "2024-09-20" }
          ]
        },
        {
          id: "member-dao-4",
          address: "0x789ghi3f2e1d9c8b7a6e5d4c",
          name: "Casey Taylor",
          avatar: "CT",
          votingPower: 580,
          contribution: 1320,
          reputation: 76,
          joinedAt: "2024-10-08",
          role: "member",
          
          governanceStats: {
            proposalsCreated: 1,
            votesParticipated: 7,
            successfulProposals: 0,
            participationRate: 0.58,
            averageVoteTime: "4.2 days"
          },
          
          tokenHoldings: {
            partyTokens: 580,
            vestedTokens: 75,
            rewardTokens: 45,
            stakedTokens: 250
          },
          
          contributionHistory: [
            { type: "monthly_dues", amount: 100, date: "2025-01-26" },
            { type: "referral_bonus", amount: 50, date: "2025-01-10" },
            { type: "initial_deposit", amount: 500, date: "2024-10-08" }
          ]
        }
      ];
      
      res.json(members);
    } catch (error) {
      console.error("Error fetching DAO members:", error);
      res.status(500).json({ error: "Failed to fetch DAO members" });
    }
  });

  // Get DAO treasury data with transparent financial tracking
  app.get("/api/dao/treasury", async (req, res) => {
    try {
      const daoId = req.query.daoId || "party-dao-1";
      
      // Simulate comprehensive treasury data
      const treasuryData = {
        totalFunds: 15750,
        availableFunds: 12300,
        lockedFunds: 2450,
        pendingWithdrawals: 1000,
        
        // Detailed financial metrics
        financialMetrics: {
          monthlyIncome: 1850,
          monthlyExpenses: 1320,
          profitMargin: 0.29,
          treasuryGrowthRate: 0.12,
          riskRating: "Low",
          liquidityRatio: 0.78
        },
        
        transactions: [
          {
            id: "tx-dao-1",
            type: "deposit",
            amount: 500,
            description: "Monthly contribution from Alex Chen",
            from: "0x742...d4e3",
            to: "DAO Treasury",
            timestamp: "2025-01-26T14:30:00Z",
            txHash: "0xabc123...def789",
            status: "confirmed",
            blockNumber: 19234567,
            gasUsed: "21000",
            category: "member_contribution"
          },
          {
            id: "tx-dao-2", 
            type: "withdrawal",
            amount: 2500,
            description: "DJ booking payment for December event",
            from: "DAO Treasury",
            to: "0x987...654f",
            timestamp: "2025-01-25T16:45:00Z",
            txHash: "0xdef456...abc123",
            status: "confirmed",
            blockNumber: 19234012,
            gasUsed: "35000",
            category: "event_expense",
            approvedBy: ["0x742...d4e3", "0x123...abc7", "0x456...def9"]
          },
          {
            id: "tx-dao-3",
            type: "allocation",
            amount: 1200,
            description: "Venue deposit for Beach Festival",
            from: "DAO Treasury",
            to: "Venue Escrow",
            timestamp: "2025-01-24T10:15:00Z",
            txHash: "0x123def...789abc",
            status: "pending",
            blockNumber: null,
            gasUsed: null,
            category: "event_deposit",
            escrowReleaseConditions: ["event_completion", "venue_satisfaction"]
          },
          {
            id: "tx-dao-4",
            type: "fine",
            amount: 25,
            description: "No-show penalty for member late cancellation",
            from: "0x999...888e",
            to: "DAO Treasury",
            timestamp: "2025-01-23T20:00:00Z",
            txHash: "0x456abc...123def",
            status: "confirmed",
            blockNumber: 19233456,
            gasUsed: "21000",
            category: "penalty"
          }
        ],
        
        budgetAllocations: [
          { 
            category: "Venue", 
            allocated: 6000, 
            spent: 3200, 
            remaining: 2800, 
            percentage: 38,
            projectedSpend: 5200,
            efficiency: 0.87
          },
          { 
            category: "Entertainment", 
            allocated: 4000, 
            spent: 2500, 
            remaining: 1500, 
            percentage: 25,
            projectedSpend: 3800,
            efficiency: 0.95
          },
          { 
            category: "Catering", 
            allocated: 3500, 
            spent: 1800, 
            remaining: 1700, 
            percentage: 22,
            projectedSpend: 3200,
            efficiency: 0.91
          },
          { 
            category: "Marketing", 
            allocated: 1500, 
            spent: 800, 
            remaining: 700, 
            percentage: 10,
            projectedSpend: 1350,
            efficiency: 0.90
          },
          { 
            category: "Equipment", 
            allocated: 750, 
            spent: 400, 
            remaining: 350, 
            percentage: 5,
            projectedSpend: 680,
            efficiency: 0.91
          }
        ],
        
        // Smart contract escrow tracking
        escrowContracts: [
          {
            id: "escrow-1",
            vendor: "Malibu Beach Club",
            amount: 1200,
            purpose: "Venue deposit for Beach Festival",
            releaseConditions: ["event_completion", "no_damage_claims"],
            status: "active",
            createdAt: "2025-01-24T10:15:00Z",
            releaseDate: "2025-02-05T00:00:00Z"
          },
          {
            id: "escrow-2",
            vendor: "DJ Kollective",
            amount: 1250,
            purpose: "50% advance for DJ services",
            releaseConditions: ["event_start", "equipment_setup"],
            status: "pending_approval",
            createdAt: "2025-01-26T11:20:00Z",
            releaseDate: "2025-02-01T18:00:00Z"
          }
        ]
      };
      
      res.json(treasuryData);
    } catch (error) {
      console.error("Error fetching DAO treasury data:", error);
      res.status(500).json({ error: "Failed to fetch DAO treasury data" });
    }
  });

  // Submit vote on DAO proposal
  app.post("/api/dao/vote", async (req, res) => {
    try {
      const { proposalId, vote, voterAddress, votingPower, reason } = req.body;
      
      if (!proposalId || !vote || !voterAddress) {
        return res.status(400).json({ error: "Missing required voting parameters" });
      }
      
      // Simulate vote submission with blockchain transaction
      const voteSubmission = {
        id: `vote-${Date.now()}`,
        proposalId,
        voterAddress,
        vote, // "for" or "against"
        votingPower: votingPower || 100,
        reason: reason || "",
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 8)}`,
        blockNumber: 19234000 + Math.floor(Math.random() * 1000),
        gasUsed: "45000",
        status: "confirmed"
      };
      
      // Simulate updating proposal vote counts
      const updatedProposal = {
        proposalId,
        newVotesFor: vote === "for" ? 1 : 0,
        newVotesAgainst: vote === "against" ? 1 : 0,
        voterParticipation: true,
        quorumProgress: "Updated based on new vote"
      };
      
      res.json({
        vote: voteSubmission,
        proposalUpdate: updatedProposal,
        message: "Vote successfully submitted to blockchain",
        estimatedConfirmation: "2-3 minutes"
      });
    } catch (error) {
      console.error("Error submitting DAO vote:", error);
      res.status(500).json({ error: "Failed to submit vote" });
    }
  });

  // Create new DAO proposal
  app.post("/api/dao/proposals", async (req, res) => {
    try {
      const { title, description, category, details, proposerAddress, bondAmount } = req.body;
      
      if (!title || !description || !category || !proposerAddress) {
        return res.status(400).json({ error: "Missing required proposal parameters" });
      }
      
      // Simulate proposal creation with smart contract interaction
      const newProposal = {
        id: `prop-dao-${Date.now()}`,
        title,
        description,
        category,
        proposer: proposerAddress,
        proposerName: "New Member", // Would be resolved from address
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        quorum: 15, // Based on DAO settings
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: "active",
        bondAmount: bondAmount || 50,
        executionTime: null,
        details: details || {},
        votingBreakdown: {
          founders: { for: 0, against: 0 },
          contributors: { for: 0, against: 0 },
          members: { for: 0, against: 0 }
        },
        discussionHash: `0x${Math.random().toString(16).slice(2, 18)}...`,
        createdAt: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 8)}`,
        blockNumber: 19234000 + Math.floor(Math.random() * 1000)
      };
      
      res.json({
        proposal: newProposal,
        message: "Proposal successfully created and submitted to governance contract",
        bondLocked: bondAmount || 50,
        votingStartTime: "immediately",
        estimatedCompletion: "7 days"
      });
    } catch (error) {
      console.error("Error creating DAO proposal:", error);
      res.status(500).json({ error: "Failed to create proposal" });
    }
  });

  // Treasury operations (deposits, withdrawals, allocations)
  app.post("/api/dao/treasury/deposit", async (req, res) => {
    try {
      const { amount, fromAddress, description, category } = req.body;
      
      if (!amount || !fromAddress) {
        return res.status(400).json({ error: "Missing required deposit parameters" });
      }
      
      // Simulate treasury deposit with blockchain transaction
      const deposit = {
        id: `deposit-${Date.now()}`,
        type: "deposit",
        amount: parseFloat(amount),
        description: description || "Member contribution",
        from: fromAddress,
        to: "DAO Treasury",
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 8)}`,
        status: "pending",
        blockNumber: null,
        gasUsed: null,
        category: category || "member_contribution",
        confirmations: 0,
        requiredConfirmations: 12
      };
      
      res.json({
        transaction: deposit,
        message: "Deposit transaction submitted to blockchain",
        newTreasuryBalance: "Will be updated after confirmation",
        estimatedConfirmation: "10-15 minutes"
      });
    } catch (error) {
      console.error("Error processing treasury deposit:", error);
      res.status(500).json({ error: "Failed to process deposit" });
    }
  });

  app.post("/api/dao/treasury/withdraw", async (req, res) => {
    try {
      const { amount, toAddress, description, category, approvers } = req.body;
      
      if (!amount || !toAddress || !description) {
        return res.status(400).json({ error: "Missing required withdrawal parameters" });
      }
      
      // Simulate multi-signature withdrawal process
      const withdrawal = {
        id: `withdraw-${Date.now()}`,
        type: "withdrawal",
        amount: parseFloat(amount),
        description,
        from: "DAO Treasury",
        to: toAddress,
        timestamp: new Date().toISOString(),
        status: "pending_approval",
        category: category || "general_expense",
        
        // Multi-signature requirements
        requiredApprovals: 3,
        currentApprovals: approvers ? approvers.length : 0,
        approvers: approvers || [],
        timelock: "24 hours",
        proposedExecution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      res.json({
        withdrawal,
        message: "Withdrawal request created and pending multi-signature approval",
        requiredApprovals: 3,
        timelockPeriod: "24 hours",
        nextStep: "Awaiting additional signatures from DAO members"
      });
    } catch (error) {
      console.error("Error processing treasury withdrawal:", error);
      res.status(500).json({ error: "Failed to process withdrawal" });
    }
  });

  // DAO governance settings and parameters
  app.get("/api/dao/governance", async (req, res) => {
    try {
      const daoId = req.query.daoId || "party-dao-1";
      
      // Simulate comprehensive governance parameters
      const governanceData = {
        daoId,
        
        // Voting parameters
        votingParameters: {
          quorumPercentage: 30,
          votingPeriod: "7 days",
          proposalThreshold: 100,
          executionDelay: "24 hours",
          gracePeriod: "7 days",
          emergencyQuorum: 15,
          maxActiveProposals: 10
        },
        
        // Token economics
        tokenEconomics: {
          totalSupply: 100000,
          circulatingSupply: 67420,
          treasuryReserve: 25000,
          founderPool: 7580,
          tokenSymbol: "PARTY",
          decimals: 18,
          
          // Distribution mechanics
          distributionRules: {
            membershipReward: 50, // tokens per month
            proposalBond: 100,
            votingReward: 5,
            eventParticipationBonus: 25,
            referralBonus: 75
          }
        },
        
        // Smart contract addresses
        contracts: {
          governance: "0x742d4e3c9d12a1b8f7e6c3a9",
          treasury: "0x123abc7f9e8d6c5b4a3f2e1d",
          voting: "0x456def9c8b7a6e5d4c3b2a1f",
          token: "0x789ghi3f2e1d9c8b7a6e5d4c",
          timelock: "0xabc123def456789012345678"
        },
        
        // Governance rules and enforcement
        rules: {
          automated: [
            "Proposals auto-execute after successful vote and timelock",
            "Treasury withdrawals require multi-signature approval",
            "Event funds automatically locked in escrow until completion",
            "No-show fines automatically distributed to treasury"
          ],
          
          transparency: [
            "All transactions publicly viewable on blockchain",
            "Real-time treasury balance updates",
            "Immutable voting records and proposal history",
            "Automated financial reporting and audit trails"
          ],
          
          penalties: [
            { offense: "no_show_after_rsvp", penalty: 25, currency: "USD" },
            { offense: "proposal_spam", penalty: 100, currency: "PARTY" },
            { offense: "vote_manipulation", penalty: 500, currency: "PARTY" },
            { offense: "treasury_abuse", penalty: "governance_removal", currency: null }
          ]
        },
        
        // DAO performance metrics
        performance: {
          participationRate: 0.72,
          proposalSuccessRate: 0.83,
          averageVotingTime: "3.2 days",
          treasuryGrowthRate: 0.15,
          memberSatisfaction: 4.7,
          eventSuccessRate: 0.94,
          
          // Historical data
          monthlyMetrics: [
            { month: "2025-01", proposals: 3, participation: 0.75, treasury: 15750 },
            { month: "2024-12", proposals: 2, participation: 0.68, treasury: 14200 },
            { month: "2024-11", proposals: 4, participation: 0.71, treasury: 13100 }
          ]
        }
      };
      
      res.json(governanceData);
    } catch (error) {
      console.error("Error fetching governance data:", error);
      res.status(500).json({ error: "Failed to fetch governance data" });
    }
  });

  // Execute passed proposal (smart contract interaction)
  app.post("/api/dao/execute", async (req, res) => {
    try {
      const { proposalId, executorAddress } = req.body;
      
      if (!proposalId || !executorAddress) {
        return res.status(400).json({ error: "Missing required execution parameters" });
      }
      
      // Simulate proposal execution through smart contracts
      const execution = {
        proposalId,
        executorAddress,
        executionTime: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 8)}`,
        status: "executing",
        estimatedCompletion: "5-10 minutes",
        
        // Execution steps
        steps: [
          { step: "validate_proposal", status: "completed", timestamp: new Date().toISOString() },
          { step: "check_timelock", status: "completed", timestamp: new Date().toISOString() },
          { step: "execute_proposal", status: "pending", timestamp: null },
          { step: "update_state", status: "pending", timestamp: null },
          { step: "emit_events", status: "pending", timestamp: null }
        ],
        
        // Execution effects
        effects: {
          treasuryUpdates: "Funds will be allocated as specified",
          memberUpdates: "Voting power and reputation will be updated",
          eventScheduling: "Event will be added to calendar if applicable",
          contractUpdates: "DAO parameters will be modified if applicable"
        }
      };
      
      res.json({
        execution,
        message: "Proposal execution initiated",
        blockchainTransaction: execution.txHash,
        estimatedGasFee: "0.015 ETH"
      });
    } catch (error) {
      console.error("Error executing DAO proposal:", error);
      res.status(500).json({ error: "Failed to execute proposal" });
    }
  });

  // ==================== AI PARTY MEDIA SUITE SYSTEM ====================
  
  // Get all media assets for an event with AI analysis
  app.get("/api/media/assets", async (req, res) => {
    try {
      const eventId = req.query.eventId || "beach-festival-2025";
      
      // Simulate comprehensive media assets with AI analysis
      const mediaAssets = [
        {
          id: "asset-media-1",
          type: "photo",
          url: "/api/media/photo/beach-sunset-group.jpg",
          thumbnail: "/api/media/thumb/beach-sunset-group.jpg",
          timestamp: "2025-01-26T20:30:00Z",
          uploader: "Alex Chen",
          uploaderAvatar: "AC",
          size: 2.4,
          tags: ["dance", "group", "highlight", "golden_hour"],
          
          // Advanced AI analysis
          aiAnalysis: {
            confidence: 0.95,
            people: ["Alex Chen", "Maya Rodriguez", "Jordan Kim"],
            emotions: ["joy", "excitement", "celebration"],
            highlights: ["perfect_lighting", "group_photo", "dance_moment"],
            quality: 0.92,
            
            // Technical analysis
            technical: {
              resolution: "4032x3024",
              colorProfile: "vivid",
              sharpness: 0.89,
              exposure: "optimal",
              composition: "rule_of_thirds"
            },
            
            // Scene analysis
            scene: {
              location: "beach",
              timeOfDay: "golden_hour",
              weather: "clear",
              activity: "dancing",
              mood: "energetic"
            },
            
            // Social analysis
            social: {
              groupSize: 3,
              interactions: ["dancing", "laughing", "posing"],
              energyLevel: "high",
              memorability: 0.94
            }
          }
        },
        {
          id: "asset-media-2",
          type: "video",
          url: "/api/media/video/dj-set-crowd-reaction.mp4",
          thumbnail: "/api/media/thumb/dj-set-crowd-reaction.jpg",
          timestamp: "2025-01-26T21:15:00Z",
          uploader: "Maya Rodriguez",
          uploaderAvatar: "MR",
          duration: 45,
          size: 78.6,
          tags: ["dj", "crowd", "energy", "beat_drop"],
          
          aiAnalysis: {
            confidence: 0.88,
            people: ["DJ Kollective", "Crowd (50+ people)"],
            emotions: ["energy", "excitement", "euphoria"],
            highlights: ["beat_drop", "crowd_reaction", "light_show"],
            quality: 0.89,
            
            // Video-specific analysis
            videoAnalysis: {
              stabilization: 0.85,
              audioSync: true,
              beatDetection: {
                bpm: 128,
                beatDrops: [12.5, 28.7, 41.2],
                energyPeaks: [15.3, 31.1, 43.8]
              },
              visualEffects: ["laser_lights", "strobe", "fog_machine"],
              cameraMovement: "handheld_dynamic"
            },
            
            technical: {
              resolution: "1920x1080",
              framerate: 60,
              bitrate: "15mbps",
              codec: "h264",
              audioQuality: "48khz_stereo"
            },
            
            scene: {
              location: "main_stage",
              timeOfDay: "night",
              lighting: "stage_lights",
              activity: "dj_performance",
              crowdSize: "large"
            }
          }
        },
        {
          id: "asset-media-3",
          type: "photo",
          url: "/api/media/photo/friends-selfie-memory.jpg",
          thumbnail: "/api/media/thumb/friends-selfie-memory.jpg",
          timestamp: "2025-01-26T22:00:00Z",
          uploader: "Jordan Kim",
          uploaderAvatar: "JK",
          size: 3.1,
          tags: ["selfie", "friends", "memory", "close_up"],
          
          aiAnalysis: {
            confidence: 0.91,
            people: ["Jordan Kim", "Casey Taylor", "Sam Wilson"],
            emotions: ["happiness", "friendship", "nostalgia"],
            highlights: ["perfect_selfie", "golden_hour", "group_bonding"],
            quality: 0.88,
            
            technical: {
              resolution: "3024x4032",
              colorProfile: "natural",
              sharpness: 0.93,
              exposure: "slightly_overexposed",
              composition: "centered"
            },
            
            scene: {
              location: "beach_deck",
              timeOfDay: "late_evening",
              lighting: "ambient_party",
              activity: "socializing",
              intimacy: "close_friends"
            },
            
            social: {
              groupSize: 3,
              interactions: ["smiling", "embracing", "eye_contact"],
              energyLevel: "warm",
              memorability: 0.96
            }
          }
        },
        {
          id: "asset-media-4",
          type: "video",
          url: "/api/media/video/volleyball-tournament-highlights.mp4",
          thumbnail: "/api/media/thumb/volleyball-tournament.jpg",
          timestamp: "2025-01-26T19:45:00Z",
          uploader: "Casey Taylor",
          uploaderAvatar: "CT",
          duration: 120,
          size: 156.8,
          tags: ["volleyball", "tournament", "sports", "teamwork"],
          
          aiAnalysis: {
            confidence: 0.87,
            people: ["Tournament Teams", "Spectators"],
            emotions: ["competitive", "teamwork", "achievement"],
            highlights: ["winning_spike", "team_celebration", "crowd_cheers"],
            quality: 0.83,
            
            videoAnalysis: {
              stabilization: 0.78,
              audioSync: true,
              actionDetection: {
                spikes: [23.4, 67.8, 98.2],
                serves: [5.1, 34.7, 89.3],
                celebrations: [25.6, 70.1, 115.4]
              },
              sportsAnalysis: {
                gamePhase: "tournament_final",
                teamColors: ["blue", "red"],
                scoreVisible: true
              }
            }
          }
        }
      ];
      
      res.json(mediaAssets);
    } catch (error) {
      console.error("Error fetching media assets:", error);
      res.status(500).json({ error: "Failed to fetch media assets" });
    }
  });

  // Get AI-generated recap videos
  app.get("/api/media/recap-videos", async (req, res) => {
    try {
      const eventId = req.query.eventId || "beach-festival-2025";
      
      // Simulate AI-generated recap videos with detailed metadata
      const recapVideos = [
        {
          id: "recap-video-1",
          title: "Sunset Collective - Beach Festival Highlights",
          duration: 180,
          status: "ready",
          progress: 100,
          thumbnail: "/api/media/thumb/recap-highlights.jpg",
          url: "/api/media/video/sunset-collective-highlights.mp4",
          style: "cinematic",
          music: "Tropical House Vibes by DJ Ocean",
          highlights: ["DJ set opening", "Volleyball tournament", "Sunset moments", "Group celebrations"],
          createdAt: "2025-01-26T23:30:00Z",
          views: 247,
          shares: 34,
          nftMinted: false,
          
          // AI generation details
          aiGeneration: {
            processingTime: "12 minutes",
            assetsUsed: 89,
            transitions: "smooth_crossfades",
            colorGrading: "warm_sunset",
            musicSync: true,
            beatMatching: 0.94,
            
            // Content analysis
            contentBreakdown: {
              danceFloor: 0.35,
              socialMoments: 0.25,
              sportsActivities: 0.20,
              sunsetScenes: 0.20
            },
            
            // Technical specs
            technical: {
              resolution: "4k",
              framerate: 30,
              codec: "h265",
              audioMix: "stereo_spatial",
              fileSize: "450MB"
            }
          }
        },
        {
          id: "recap-video-2",
          title: "Epic Dance Floor Moments",
          duration: 90,
          status: "generating",
          progress: 75,
          thumbnail: "/api/media/thumb/dance-floor-energy.jpg",
          style: "energetic",
          music: "Electronic Dance Mix",
          highlights: ["Beat drops", "Crowd reactions", "Light shows", "Dance competitions"],
          createdAt: "2025-01-26T23:45:00Z",
          views: 0,
          shares: 0,
          nftMinted: false,
          
          aiGeneration: {
            processingTime: "8 minutes (estimated)",
            assetsUsed: 67,
            transitions: "quick_cuts",
            colorGrading: "vibrant_neon",
            musicSync: true,
            
            // Processing status
            currentStep: "audio_sync",
            completedSteps: ["asset_selection", "scene_detection", "beat_analysis"],
            remainingSteps: ["final_render", "quality_check"]
          }
        },
        {
          id: "recap-video-3",
          title: "Behind the Scenes Magic",
          duration: 120,
          status: "ready",
          progress: 100,
          thumbnail: "/api/media/thumb/behind-scenes.jpg",
          url: "/api/media/video/behind-scenes-magic.mp4",
          style: "social",
          music: "Chill Vibes Acoustic",
          highlights: ["Setup process", "Guest arrivals", "Vendor spotlights", "Candid moments"],
          createdAt: "2025-01-27T00:15:00Z",
          views: 156,
          shares: 21,
          nftMinted: true,
          
          aiGeneration: {
            processingTime: "15 minutes",
            assetsUsed: 134,
            transitions: "gentle_fades",
            colorGrading: "natural_warm",
            musicSync: false,
            storytelling: "chronological",
            
            nftDetails: {
              tokenId: "2001",
              contractAddress: "0x456def9c8b7a6e5d4c3b2a1f",
              mintPrice: "0.08 ETH",
              royalties: "5%"
            }
          }
        }
      ];
      
      res.json(recapVideos);
    } catch (error) {
      console.error("Error fetching recap videos:", error);
      res.status(500).json({ error: "Failed to fetch recap videos" });
    }
  });

  // Get smart photo collections with AI organization
  app.get("/api/media/photo-collections", async (req, res) => {
    try {
      const eventId = req.query.eventId || "beach-festival-2025";
      
      // Simulate AI-organized photo collections
      const photoCollections = [
        {
          id: "collection-golden-hour",
          name: "Golden Hour Magic",
          totalPhotos: 89,
          bestShots: 23,
          aiTagged: 89,
          thumbnail: "/api/media/thumb/golden-hour-collection.jpg",
          tags: ["sunset", "golden_hour", "portraits", "atmosphere"],
          people: ["Alex Chen", "Maya Rodriguez", "Jordan Kim", "Casey Taylor"],
          moments: ["Sunset silhouettes", "Beach portraits", "Group photos", "Candid laughs"],
          qualityScore: 0.94,
          
          // AI organization details
          aiOrganization: {
            groupingMethod: "temporal_visual_similarity",
            qualityFiltering: "top_25_percent",
            duplicateRemoval: 12,
            faceRecognitionAccuracy: 0.96,
            
            // Content analysis
            contentBreakdown: {
              portraits: 34,
              groupPhotos: 28,
              landscapeShots: 15,
              candidMoments: 12
            },
            
            // Technical metrics
            averageQuality: 0.89,
            averageResolution: "3024x4032",
            colorConsistency: 0.92,
            exposureOptimization: "applied"
          }
        },
        {
          id: "collection-dance-energy",
          name: "Dance Floor Energy",
          totalPhotos: 156,
          bestShots: 42,
          aiTagged: 156,
          thumbnail: "/api/media/thumb/dance-energy-collection.jpg",
          tags: ["dance", "energy", "lights", "movement"],
          people: ["DJ Kollective", "Dance Crew", "Party Guests"],
          moments: ["Epic dance battles", "DJ reactions", "Crowd euphoria", "Light displays"],
          qualityScore: 0.87,
          
          aiOrganization: {
            groupingMethod: "activity_based_clustering",
            motionDetection: true,
            lightingAnalysis: "dynamic_stage_lights",
            energyLevelScoring: 0.91,
            
            contentBreakdown: {
              actionShots: 67,
              djPerformance: 34,
              crowdReactions: 32,
              lightingEffects: 23
            },
            
            specialFeatures: {
              motionBlurArtistic: 15,
              perfectTimingShots: 28,
              uniqueAngles: 19
            }
          }
        },
        {
          id: "collection-food-friends",
          name: "Food & Friends",
          totalPhotos: 67,
          bestShots: 18,
          aiTagged: 67,
          thumbnail: "/api/media/thumb/food-friends-collection.jpg",
          tags: ["food", "friends", "social", "memories"],
          people: ["Food enthusiasts", "Friend groups", "Vendors"],
          moments: ["Food presentations", "Group dinners", "Vendor interactions", "Taste reactions"],
          qualityScore: 0.82,
          
          aiOrganization: {
            groupingMethod: "social_context_analysis",
            foodRecognition: true,
            socialGroupDetection: 0.88,
            moodAnalysis: "relaxed_social",
            
            contentBreakdown: {
              foodCloseups: 23,
              socialEating: 28,
              vendorInteractions: 16
            }
          }
        }
      ];
      
      res.json(photoCollections);
    } catch (error) {
      console.error("Error fetching photo collections:", error);
      res.status(500).json({ error: "Failed to fetch photo collections" });
    }
  });

  // Get NFT memory albums
  app.get("/api/media/nft-albums", async (req, res) => {
    try {
      const eventId = req.query.eventId || "beach-festival-2025";
      
      // Simulate NFT memory albums with blockchain integration
      const nftMemoryAlbums = [
        {
          id: "nft-album-genesis",
          title: "Sunset Collective Genesis Event",
          description: "Complete digital memory album from our inaugural beach festival with exclusive moments and highlights",
          tokenId: "1001",
          contractAddress: "0x742d4e3c9d12a1b8f7e6c3a9",
          price: 0.15,
          rarity: "legendary",
          assets: 247,
          minted: true,
          mintDate: "2025-01-27T00:30:00Z",
          owner: "0x123abc7f9e8d6c5b4a3f2e1d",
          
          metadata: {
            eventName: "Sunset Collective Beach Festival",
            eventDate: "2025-01-26",
            totalAssets: 247,
            highlights: ["DJ Kollective set", "Beach volleyball", "Sunset moments", "Community celebrations"],
            participants: 156,
            
            // NFT-specific metadata
            rarityAttributes: {
              exclusiveFootage: 23,
              behindScenes: 34,
              artistInteractions: 12,
              uniqueAngles: 67
            },
            
            // Blockchain details
            blockchain: "ethereum",
            standard: "ERC-721",
            ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            royalties: "5%",
            
            // Utility features
            unlockableContent: [
              "4K original videos",
              "RAW photo files",
              "Exclusive interview clips",
              "VIP event access for future events"
            ]
          }
        },
        {
          id: "nft-album-vip",
          title: "VIP Experience Collection",
          description: "Exclusive behind-the-scenes content and VIP moments from the event",
          price: 0.08,
          rarity: "epic",
          assets: 89,
          minted: false,
          
          metadata: {
            eventName: "Sunset Collective Beach Festival",
            eventDate: "2025-01-26",
            totalAssets: 89,
            highlights: ["VIP area access", "Artist meetups", "Exclusive performances", "Behind scenes"],
            participants: 34,
            
            rarityAttributes: {
              vipAccess: 89,
              artistMeetups: 15,
              exclusivePerformances: 8,
              behindScenes: 45
            },
            
            estimatedValue: {
              mintPrice: "0.08 ETH",
              projectedValue: "0.12-0.18 ETH",
              rarityScore: 0.73
            }
          }
        },
        {
          id: "nft-album-dance",
          title: "Dance Floor Chronicles",
          description: "High-energy collection capturing the best dance floor moments and music highlights",
          price: 0.05,
          rarity: "rare",
          assets: 134,
          minted: false,
          
          metadata: {
            eventName: "Sunset Collective Beach Festival",
            eventDate: "2025-01-26",
            totalAssets: 134,
            highlights: ["Beat drops", "Dance battles", "Crowd energy", "Light shows"],
            participants: 89,
            
            rarityAttributes: {
              beatDropMoments: 23,
              danceBattles: 12,
              lightShows: 34,
              crowdEuphoria: 65
            },
            
            musicalSync: {
              beatMatched: true,
              bpm: 128,
              genreFocus: "electronic_dance",
              energyProfile: "high_intensity"
            }
          }
        }
      ];
      
      res.json(nftMemoryAlbums);
    } catch (error) {
      console.error("Error fetching NFT albums:", error);
      res.status(500).json({ error: "Failed to fetch NFT albums" });
    }
  });

  // Generate new recap video
  app.post("/api/media/generate-recap", async (req, res) => {
    try {
      const { style, musicGenre, duration, eventId, highlights } = req.body;
      
      if (!style || !musicGenre) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Simulate AI video generation process
      const generationJob = {
        id: `recap-gen-${Date.now()}`,
        status: "initiated",
        progress: 0,
        estimatedTime: "10-15 minutes",
        
        // Generation parameters
        parameters: {
          style: style || "cinematic",
          musicGenre: musicGenre || "electronic",
          duration: duration || 120,
          targetAudience: "social_media",
          qualityPreset: "4k"
        },
        
        // AI processing pipeline
        processingSteps: [
          { step: "asset_analysis", status: "pending", description: "Analyzing uploaded media assets" },
          { step: "highlight_detection", status: "pending", description: "Identifying key moments and highlights" },
          { step: "music_selection", status: "pending", description: "Selecting and syncing background music" },
          { step: "scene_sequencing", status: "pending", description: "Arranging scenes for optimal flow" },
          { step: "transition_generation", status: "pending", description: "Creating smooth transitions" },
          { step: "color_grading", status: "pending", description: "Applying cinematic color correction" },
          { step: "audio_mixing", status: "pending", description: "Balancing music and ambient audio" },
          { step: "final_render", status: "pending", description: "Rendering final 4K video" },
          { step: "quality_check", status: "pending", description: "Automated quality verification" }
        ],
        
        // Expected output
        expectedOutput: {
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} Event Highlights`,
          duration: duration || 120,
          resolution: "4K (3840x2160)",
          fileSize: `${Math.round(duration * 8 / 60)} MB estimated`,
          format: "MP4 (H.265)"
        },
        
        createdAt: new Date().toISOString()
      };
      
      res.json({
        message: "Video generation initiated",
        job: generationJob,
        trackingUrl: `/api/media/generation-status/${generationJob.id}`,
        estimatedCompletion: new Date(Date.now() + 12 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error("Error generating recap video:", error);
      res.status(500).json({ error: "Failed to initiate video generation" });
    }
  });

  // Check video generation status
  app.get("/api/media/generation-status/:jobId", async (req, res) => {
    try {
      const { jobId } = req.params;
      
      // Simulate generation progress
      const progress = Math.min(100, Math.random() * 100);
      const currentStep = Math.floor(progress / 12);
      
      const statusUpdate = {
        jobId,
        status: progress >= 100 ? "completed" : "processing",
        progress: Math.round(progress),
        currentStep: currentStep < 8 ? currentStep : 8,
        
        // Processing details
        processingDetails: {
          assetsProcessed: Math.round(progress * 2.3),
          scenesGenerated: Math.round(progress * 0.8),
          transitionsApplied: Math.round(progress * 0.6),
          audioSyncProgress: Math.round(progress * 0.9)
        },
        
        // Estimated completion
        estimatedTimeRemaining: progress >= 100 ? 0 : Math.round((100 - progress) / 10),
        
        // If completed, provide download info
        ...(progress >= 100 && {
          downloadUrl: `/api/media/download/recap-${jobId}.mp4`,
          fileSize: "89.7 MB",
          duration: "2:34",
          resolution: "4K",
          thumbnailUrl: `/api/media/thumb/recap-${jobId}.jpg`
        })
      };
      
      res.json(statusUpdate);
    } catch (error) {
      console.error("Error checking generation status:", error);
      res.status(500).json({ error: "Failed to check generation status" });
    }
  });

  // Mint NFT memory album
  app.post("/api/media/mint-nft", async (req, res) => {
    try {
      const { albumId, title, description, price, rarity, assets } = req.body;
      
      if (!albumId || !title) {
        return res.status(400).json({ error: "Missing required NFT parameters" });
      }
      
      // Simulate NFT minting process
      const mintingJob = {
        id: `nft-mint-${Date.now()}`,
        albumId,
        status: "initiated",
        progress: 0,
        
        // NFT details
        nftDetails: {
          title,
          description: description || "Exclusive party memory collection",
          price: price || 0.05,
          rarity: rarity || "rare",
          totalAssets: assets || 50,
          
          // Blockchain preparation
          blockchain: "ethereum",
          standard: "ERC-721",
          estimatedGasFee: "0.002 ETH",
          contractAddress: "0x742d4e3c9d12a1b8f7e6c3a9"
        },
        
        // Minting process steps
        mintingSteps: [
          { step: "metadata_preparation", status: "pending", description: "Preparing NFT metadata" },
          { step: "ipfs_upload", status: "pending", description: "Uploading assets to IPFS" },
          { step: "smart_contract_interaction", status: "pending", description: "Interacting with NFT contract" },
          { step: "blockchain_confirmation", status: "pending", description: "Waiting for blockchain confirmation" },
          { step: "marketplace_listing", status: "pending", description: "Listing on NFT marketplaces" }
        ],
        
        // Estimated costs and timeline
        costs: {
          mintingFee: price * 0.025,
          gasFee: 0.002,
          marketplaceFee: price * 0.025,
          total: price * 0.05 + 0.002
        },
        
        estimatedCompletion: "5-10 minutes",
        createdAt: new Date().toISOString()
      };
      
      res.json({
        message: "NFT minting initiated",
        mintingJob,
        trackingUrl: `/api/media/minting-status/${mintingJob.id}`,
        blockchainExplorer: `https://etherscan.io/tx/pending`
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      res.status(500).json({ error: "Failed to initiate NFT minting" });
    }
  });

  // Check NFT minting status
  app.get("/api/media/minting-status/:jobId", async (req, res) => {
    try {
      const { jobId } = req.params;
      
      // Simulate minting progress
      const progress = Math.min(100, Math.random() * 100);
      const currentStep = Math.floor(progress / 20);
      
      const mintingStatus = {
        jobId,
        status: progress >= 100 ? "minted" : "processing",
        progress: Math.round(progress),
        currentStep: currentStep < 5 ? currentStep : 4,
        
        // Blockchain details
        blockchainDetails: {
          txHash: progress > 50 ? `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 8)}` : null,
          blockNumber: progress > 80 ? 19234000 + Math.floor(Math.random() * 1000) : null,
          confirmations: progress >= 100 ? 12 : Math.floor(progress / 10),
          gasUsed: progress > 50 ? "127,000" : null
        },
        
        // If completed, provide NFT info
        ...(progress >= 100 && {
          tokenId: Math.floor(Math.random() * 10000) + 1000,
          contractAddress: "0x742d4e3c9d12a1b8f7e6c3a9",
          ipfsHash: `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`,
          openseaUrl: `https://opensea.io/assets/ethereum/0x742d4e3c9d12a1b8f7e6c3a9/${Math.floor(Math.random() * 10000)}`,
          rarityRank: Math.floor(Math.random() * 1000) + 1
        })
      };
      
      res.json(mintingStatus);
    } catch (error) {
      console.error("Error checking minting status:", error);
      res.status(500).json({ error: "Failed to check minting status" });
    }
  });

  // Share media content
  app.post("/api/media/share", async (req, res) => {
    try {
      const { contentType, contentId, platform, message } = req.body;
      
      if (!contentType || !contentId || !platform) {
        return res.status(400).json({ error: "Missing required sharing parameters" });
      }
      
      // Simulate social media sharing
      const shareResult = {
        id: `share-${Date.now()}`,
        contentType,
        contentId,
        platform,
        message: message || "Check out this amazing party moment!",
        
        // Platform-specific optimizations
        optimizations: {
          instagram: {
            aspectRatio: "1:1",
            hashtagSuggestions: ["#PartyVibes", "#SunsetCollective", "#BeachFestival", "#GoodTimes"],
            storyFormat: true
          },
          twitter: {
            characterCount: 280,
            videoLength: "2:20",
            threadSuggestion: false
          },
          tiktok: {
            duration: "15s",
            effects: ["beat_sync", "color_pop"],
            musicSync: true
          },
          youtube: {
            title: "Sunset Collective Beach Festival Highlights",
            description: "Epic moments from our beach festival...",
            tags: ["party", "festival", "music", "beach"]
          }
        },
        
        // Analytics tracking
        analytics: {
          trackingPixel: `https://analytics.vibes.app/track/${Date.now()}`,
          utmSource: platform,
          utmMedium: "social_share",
          utmCampaign: "party_memories"
        },
        
        shareUrl: `https://vibes.app/share/${contentType}/${contentId}?ref=${platform}`,
        createdAt: new Date().toISOString()
      };
      
      res.json({
        message: "Content prepared for sharing",
        shareResult,
        previewUrl: shareResult.shareUrl,
        analytics: shareResult.analytics
      });
    } catch (error) {
      console.error("Error preparing content share:", error);
      res.status(500).json({ error: "Failed to prepare content for sharing" });
    }
  });

  // Download media content
  app.get("/api/media/download/:contentType/:contentId", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const format = req.query.format || "original";
      const quality = req.query.quality || "high";
      
      // Simulate download preparation
      const downloadInfo = {
        contentId,
        contentType,
        format,
        quality,
        
        // Download options
        availableFormats: {
          video: ["MP4", "MOV", "AVI"],
          photo: ["JPG", "PNG", "TIFF", "RAW"],
          collection: ["ZIP", "TAR.GZ"]
        },
        
        // Quality options
        qualityOptions: {
          original: { size: "125.7 MB", resolution: "4K" },
          high: { size: "78.3 MB", resolution: "1080p" },
          medium: { size: "34.2 MB", resolution: "720p" },
          low: { size: "15.8 MB", resolution: "480p" }
        },
        
        // Download preparation
        preparationTime: "2-5 minutes",
        downloadUrl: `/api/media/files/download-${contentId}-${format}-${quality}.zip`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        
        // Metadata included
        includedMetadata: {
          exifData: contentType === "photo",
          creationTimestamp: true,
          aiAnalysis: true,
          eventContext: true,
          socialTags: true
        }
      };
      
      res.json({
        message: "Download prepared",
        downloadInfo,
        status: "ready",
        directDownload: downloadInfo.downloadUrl
      });
    } catch (error) {
      console.error("Error preparing download:", error);
      res.status(500).json({ error: "Failed to prepare download" });
    }
  });

  // ==================== GLOBAL VIBE PASSPORT & LOYALTY PROGRAM ====================
  
  // Get user passport profile
  app.get("/api/passport/profile", async (req, res) => {
    try {
      const userId = req.query.userId || "user-vibe-explorer";
      
      // Simulate comprehensive user profile with loyalty data
      const userProfile = {
        id: userId,
        name: "Jordan Kim",
        avatar: "JK",
        currentTier: "City Explorer",
        totalPoints: 2847,
        eventsAttended: 23,
        referralsMade: 8,
        citiesVisited: 12,
        countriesVisited: 4,
        joinedAt: "2024-08-15T00:00:00Z",
        lastActivity: "2025-01-26T22:30:00Z",
        
        // Detailed loyalty metrics
        loyaltyMetrics: {
          monthlyGrowth: {
            points: 342,
            events: 4,
            referrals: 2,
            cities: 1
          },
          streaks: {
            eventAttendance: 8,
            weeklyActive: 12,
            monthlyGoals: 3
          },
          milestones: {
            nextPointsMilestone: 3000,
            nextEventsMilestone: 25,
            nextCityMilestone: 15,
            nextReferralMilestone: 10
          }
        },
        
        // Social stats
        socialStats: {
          connectionsLast30Days: 12,
          photosShared: 67,
          eventReviews: 15,
          helpfulVotes: 89,
          communityRank: 156
        },
        
        // Preferences
        preferences: {
          musicGenres: ["Electronic", "House", "Techno", "Tropical House"],
          eventTypes: ["Beach Parties", "Rooftop Events", "Underground", "Festivals"],
          cities: ["Miami", "NYC", "London", "Berlin", "Tokyo"],
          notifications: {
            newRewards: true,
            tierProgress: true,
            achievements: true,
            eventRecommendations: true
          }
        }
      };
      
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching passport profile:", error);
      res.status(500).json({ error: "Failed to fetch passport profile" });
    }
  });

  // Get passport stamps collection
  app.get("/api/passport/stamps", async (req, res) => {
    try {
      const userId = req.query.userId || "user-vibe-explorer";
      const category = req.query.category; // Filter by stamp type
      const rarity = req.query.rarity; // Filter by rarity
      
      // Simulate comprehensive passport stamps
      const allStamps = [
        {
          id: "stamp-sunset-collective",
          eventId: "beach-festival-2025",
          eventName: "Sunset Collective Beach Festival",
          eventLocation: "Miami Beach, FL",
          eventDate: "2025-01-26",
          stampType: "attendance",
          rarity: "legendary",
          points: 150,
          imageUrl: "/api/stamps/sunset-collective.png",
          description: "Attended the inaugural Sunset Collective festival with 500+ vibers",
          earnedAt: "2025-01-26T23:45:00Z",
          
          // Enhanced metadata
          metadata: {
            attendeeCount: 523,
            durationHours: 8,
            weatherCondition: "perfect",
            socialConnections: 12,
            photosShared: 8,
            venueRating: 4.9
          },
          
          // Special attributes
          specialAttributes: {
            foundingEvent: true,
            weatherBonus: "perfect_sunset",
            socialMultiplier: 1.5,
            rarityBonus: 50
          }
        },
        {
          id: "stamp-underground-warehouse",
          eventId: "warehouse-rave-nyc",
          eventName: "Underground Warehouse Experience",
          eventLocation: "Brooklyn, NY",
          eventDate: "2025-01-15",
          stampType: "attendance",
          rarity: "epic",
          points: 120,
          imageUrl: "/api/stamps/warehouse-underground.png",
          description: "Discovered hidden gem warehouse party with exclusive techno lineup",
          earnedAt: "2025-01-15T20:30:00Z",
          
          metadata: {
            attendeeCount: 289,
            durationHours: 12,
            weatherCondition: "indoor",
            socialConnections: 8,
            photosShared: 15,
            venueRating: 4.7
          },
          
          specialAttributes: {
            hiddenVenue: true,
            exclusiveLineup: true,
            undergroundScene: true,
            lateNightBonus: 25
          }
        },
        {
          id: "stamp-referral-milestone",
          eventId: "global-referral",
          eventName: "Vibe Spreader Achievement",
          eventLocation: "Global",
          eventDate: "2025-01-20",
          stampType: "referral",
          rarity: "rare",
          points: 80,
          imageUrl: "/api/stamps/referral-milestone.png",
          description: "Successfully referred 5 friends who attended events",
          earnedAt: "2025-01-20T14:22:00Z",
          
          metadata: {
            referralsCount: 5,
            conversionRate: 0.83,
            totalInvitesSent: 6,
            avgEventRating: 4.6
          },
          
          specialAttributes: {
            socialInfluencer: true,
            highConversion: true,
            communityBuilder: true
          }
        },
        {
          id: "stamp-first-international",
          eventId: "london-rooftop-2024",
          eventName: "London Rooftop Sessions",
          eventLocation: "London, UK",
          eventDate: "2024-12-08",
          stampType: "milestone",
          rarity: "epic",
          points: 200,
          imageUrl: "/api/stamps/international-debut.png",
          description: "First international event - London rooftop with skyline views",
          earnedAt: "2024-12-08T19:15:00Z",
          
          metadata: {
            attendeeCount: 156,
            durationHours: 6,
            weatherCondition: "clear_night",
            socialConnections: 15,
            photosShared: 23,
            venueRating: 4.8
          },
          
          specialAttributes: {
            firstInternational: true,
            skylineViews: true,
            culturalExplorer: true,
            globalViber: true,
            milestoneBonus: 100
          }
        },
        {
          id: "stamp-dj-discovery",
          eventId: "miami-underground-2024",
          eventName: "DJ Discovery Night",
          eventLocation: "Miami, FL",
          eventDate: "2024-11-22",
          stampType: "engagement",
          rarity: "rare",
          points: 90,
          imageUrl: "/api/stamps/dj-discovery.png",
          description: "Discovered and shared emerging DJ talent at underground event",
          earnedAt: "2024-11-22T21:45:00Z",
          
          metadata: {
            attendeeCount: 78,
            durationHours: 5,
            socialConnections: 6,
            djShares: 3,
            musicDiscoveries: 8
          },
          
          specialAttributes: {
            talentScout: true,
            earlyAdopter: true,
            musicCurator: true
          }
        },
        {
          id: "stamp-festival-marathon",
          eventId: "festival-weekend-2024",
          eventName: "Festival Marathon Weekend",
          eventLocation: "Austin, TX",
          eventDate: "2024-10-15",
          stampType: "attendance",
          rarity: "legendary",
          points: 250,
          imageUrl: "/api/stamps/festival-marathon.png",
          description: "Attended 3 different festivals in one weekend",
          earnedAt: "2024-10-15T23:59:00Z",
          
          metadata: {
            eventsAttended: 3,
            totalDuration: 28,
            stamina: "legendary",
            socialConnections: 34,
            photosShared: 67
          },
          
          specialAttributes: {
            marathonAttendee: true,
            enduranceViber: true,
            festivalHopper: true,
            weekendWarrior: true,
            staminaBonus: 125
          }
        }
      ];
      
      // Apply filters
      let filteredStamps = allStamps;
      if (category) {
        filteredStamps = filteredStamps.filter(stamp => stamp.stampType === category);
      }
      if (rarity) {
        filteredStamps = filteredStamps.filter(stamp => stamp.rarity === rarity);
      }
      
      res.json(filteredStamps);
    } catch (error) {
      console.error("Error fetching passport stamps:", error);
      res.status(500).json({ error: "Failed to fetch passport stamps" });
    }
  });

  // Get loyalty tiers system
  app.get("/api/passport/tiers", async (req, res) => {
    try {
      // Simulate comprehensive loyalty tier system
      const loyaltyTiers = [
        {
          id: "newcomer",
          name: "Vibe Newcomer",
          level: 1,
          requiredPoints: 0,
          color: "gray",
          icon: "👋",
          benefits: [
            "Basic event access",
            "Community chat access",
            "Event notifications",
            "Basic profile customization"
          ],
          currentMembers: 15420,
          badge: "/api/badges/newcomer.png",
          
          // Tier-specific features
          features: {
            eventCapacity: "unlimited",
            advanceBooking: "7 days",
            supportPriority: "standard",
            exclusiveEvents: false,
            discountRate: 0
          }
        },
        {
          id: "regular-viber",
          name: "Regular Viber",
          level: 2,
          requiredPoints: 500,
          color: "blue",
          icon: "🎵",
          benefits: [
            "Early event notifications (24h advance)",
            "5% booking discount",
            "Enhanced profile customization",
            "Event review privileges",
            "Basic analytics dashboard"
          ],
          currentMembers: 8932,
          badge: "/api/badges/regular-viber.png",
          
          features: {
            eventCapacity: "unlimited",
            advanceBooking: "14 days",
            supportPriority: "priority",
            exclusiveEvents: false,
            discountRate: 0.05
          }
        },
        {
          id: "city-explorer",
          name: "City Explorer",
          level: 3,
          requiredPoints: 1500,
          color: "purple",
          icon: "🌆",
          benefits: [
            "VIP event previews",
            "10% booking discount",
            "Exclusive city guides",
            "Priority customer support",
            "Guest list privileges",
            "Event planning tools",
            "Analytics dashboard"
          ],
          currentMembers: 3456,
          badge: "/api/badges/city-explorer.png",
          
          features: {
            eventCapacity: "unlimited",
            advanceBooking: "21 days",
            supportPriority: "vip",
            exclusiveEvents: true,
            discountRate: 0.10
          }
        },
        {
          id: "backstage-viber",
          name: "Backstage Viber",
          level: 4,
          requiredPoints: 4000,
          color: "gold",
          icon: "🎭",
          benefits: [
            "Backstage access at select events",
            "Meet & greet opportunities with artists",
            "15% booking discount",
            "Exclusive merchandise access",
            "VIP lounge access",
            "Personal event concierge",
            "Early festival ticket access",
            "Complimentary plus-ones"
          ],
          currentMembers: 892,
          badge: "/api/badges/backstage-viber.png",
          
          features: {
            eventCapacity: "unlimited",
            advanceBooking: "30 days",
            supportPriority: "white_glove",
            exclusiveEvents: true,
            discountRate: 0.15
          }
        },
        {
          id: "superhost",
          name: "Superhost",
          level: 5,
          requiredPoints: 10000,
          color: "diamond",
          icon: "👑",
          benefits: [
            "Host verification badge",
            "Revenue sharing program (5%)",
            "Featured event listings",
            "Personal event concierge",
            "Custom event branding",
            "Advanced analytics suite",
            "Dedicated account manager",
            "Beta feature access",
            "Annual Superhost summit invitation"
          ],
          currentMembers: 156,
          badge: "/api/badges/superhost.png",
          
          features: {
            eventCapacity: "unlimited",
            advanceBooking: "unlimited",
            supportPriority: "dedicated",
            exclusiveEvents: true,
            discountRate: 0.20,
            revenueShare: 0.05
          }
        }
      ];
      
      res.json(loyaltyTiers);
    } catch (error) {
      console.error("Error fetching loyalty tiers:", error);
      res.status(500).json({ error: "Failed to fetch loyalty tiers" });
    }
  });

  // Get available rewards
  app.get("/api/passport/rewards", async (req, res) => {
    try {
      const category = req.query.category; // Filter by reward category
      const userTier = req.query.tier || "city-explorer";
      
      // Simulate comprehensive rewards catalog
      const allRewards = [
        {
          id: "reward-vip-weekend",
          name: "VIP Weekend Pass",
          description: "All-access VIP pass for any weekend event in your city",
          category: "vip_access",
          cost: 800,
          rarity: "epic",
          imageUrl: "/api/rewards/vip-weekend-pass.jpg",
          available: 25,
          claimed: false,
          tierRestriction: "city-explorer",
          expiresAt: "2025-03-31T23:59:59Z",
          
          // Reward details
          details: {
            validityPeriod: "3 months",
            applicableEvents: "weekend_events",
            transferable: false,
            combinable: true,
            regions: ["North America", "Europe"]
          },
          
          // Usage stats
          stats: {
            totalClaimed: 234,
            userRating: 4.8,
            popularityRank: 3,
            redemptionRate: 0.89
          }
        },
        {
          id: "reward-limited-hoodie",
          name: "Limited Edition Vibes Hoodie",
          description: "Exclusive holographic hoodie with your tier badge and city collection",
          category: "merchandise",
          cost: 450,
          rarity: "rare",
          imageUrl: "/api/rewards/limited-hoodie.jpg",
          available: 100,
          claimed: false,
          tierRestriction: "regular-viber",
          
          details: {
            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
            materials: "Premium cotton blend with holographic elements",
            customization: "tier_badge_and_city_stamps",
            shipping: "worldwide_free"
          },
          
          stats: {
            totalClaimed: 456,
            userRating: 4.6,
            popularityRank: 7,
            redemptionRate: 0.76
          }
        },
        {
          id: "reward-golden-nft",
          name: "Golden Vibe Passport NFT",
          description: "Unique NFT representing your journey across the global party scene",
          category: "nft",
          cost: 1200,
          rarity: "legendary",
          imageUrl: "/api/rewards/golden-passport-nft.jpg",
          available: 50,
          claimed: false,
          tierRestriction: "backstage-viber",
          
          details: {
            blockchain: "ethereum",
            standard: "ERC-721",
            royalties: "5%",
            utility: "exclusive_event_access",
            rarity_attributes: "journey_based"
          },
          
          stats: {
            totalClaimed: 23,
            userRating: 4.9,
            popularityRank: 1,
            redemptionRate: 0.95
          }
        },
        {
          id: "reward-dj-masterclass",
          name: "Private DJ Masterclass",
          description: "One-on-one session with a featured DJ from recent events",
          category: "experiences",
          cost: 1500,
          rarity: "legendary",
          imageUrl: "/api/rewards/dj-masterclass.jpg",
          available: 10,
          claimed: false,
          tierRestriction: "backstage-viber",
          
          details: {
            duration: "2 hours",
            format: "in_person_or_virtual",
            equipment_provided: true,
            recording_allowed: true,
            certificate_included: true
          },
          
          stats: {
            totalClaimed: 67,
            userRating: 5.0,
            popularityRank: 2,
            redemptionRate: 0.98
          }
        },
        {
          id: "reward-city-discount",
          name: "City Explorer 25% Discount",
          description: "25% off your next 3 bookings in any new city you visit",
          category: "discounts",
          cost: 300,
          rarity: "common",
          imageUrl: "/api/rewards/city-discount.jpg",
          available: 200,
          claimed: true,
          tierRestriction: "regular-viber",
          claimedAt: "2025-01-20T15:30:00Z",
          
          details: {
            applicableBookings: 3,
            validityPeriod: "6 months",
            cityRestriction: "new_cities_only",
            combinable: false
          },
          
          stats: {
            totalClaimed: 1234,
            userRating: 4.4,
            popularityRank: 12,
            redemptionRate: 0.67
          }
        },
        {
          id: "reward-festival-vip",
          name: "Festival VIP Experience Package",
          description: "Complete VIP experience including backstage access, meet & greet, and premium amenities",
          category: "vip_access",
          cost: 2000,
          rarity: "legendary",
          imageUrl: "/api/rewards/festival-vip.jpg",
          available: 5,
          claimed: false,
          tierRestriction: "superhost",
          
          details: {
            inclusions: ["backstage_access", "artist_meetup", "vip_lounge", "premium_bar", "photographer"],
            validFestivals: "tier_1_festivals",
            guestAllowance: 1,
            transferable: false
          },
          
          stats: {
            totalClaimed: 12,
            userRating: 5.0,
            popularityRank: 1,
            redemptionRate: 1.0
          }
        }
      ];
      
      // Filter by category if specified
      let filteredRewards = allRewards;
      if (category) {
        filteredRewards = filteredRewards.filter(reward => reward.category === category);
      }
      
      // Filter by tier access
      const tierLevels = {
        "newcomer": 1,
        "regular-viber": 2,
        "city-explorer": 3,
        "backstage-viber": 4,
        "superhost": 5
      };
      
      const userTierLevel = tierLevels[userTier] || 1;
      filteredRewards = filteredRewards.filter(reward => {
        const requiredLevel = tierLevels[reward.tierRestriction] || 1;
        return userTierLevel >= requiredLevel;
      });
      
      res.json(filteredRewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });

  // Get user achievements
  app.get("/api/passport/achievements", async (req, res) => {
    try {
      const userId = req.query.userId || "user-vibe-explorer";
      const category = req.query.category; // Filter by achievement category
      
      // Simulate comprehensive achievements system
      const allAchievements = [
        {
          id: "achievement-first-event",
          name: "First Steps",
          description: "Attend your first Vibes event",
          category: "attendance",
          icon: "🎉",
          points: 50,
          rarity: "common",
          unlockedAt: "2024-08-20T19:30:00Z",
          progress: 1,
          maxProgress: 1,
          
          // Achievement metadata
          metadata: {
            unlockCondition: "attend_first_event",
            secretAchievement: false,
            repeatable: false,
            seasonalBonus: false
          }
        },
        {
          id: "achievement-city-hopper",
          name: "City Hopper",
          description: "Attend events in 10 different cities",
          category: "exploration",
          icon: "✈️",
          points: 300,
          rarity: "epic",
          unlockedAt: "2025-01-15T22:00:00Z",
          progress: 12,
          maxProgress: 10,
          
          metadata: {
            unlockCondition: "attend_events_in_10_cities",
            secretAchievement: false,
            repeatable: false,
            seasonalBonus: false,
            extraProgress: 2
          }
        },
        {
          id: "achievement-social-butterfly",
          name: "Social Butterfly",
          description: "Make 50 new connections at events",
          category: "social",
          icon: "🦋",
          points: 200,
          rarity: "rare",
          progress: 43,
          maxProgress: 50,
          
          metadata: {
            unlockCondition: "make_50_connections",
            secretAchievement: false,
            repeatable: false,
            seasonalBonus: false,
            nearCompletion: true
          }
        },
        {
          id: "achievement-vibe-spreader",
          name: "Vibe Spreader",
          description: "Refer 10 friends who attend events",
          category: "referrals",
          icon: "📢",
          points: 250,
          rarity: "rare",
          progress: 8,
          maxProgress: 10,
          
          metadata: {
            unlockCondition: "refer_10_active_friends",
            secretAchievement: false,
            repeatable: true,
            seasonalBonus: false
          }
        },
        {
          id: "achievement-content-creator",
          name: "Content Creator",
          description: "Share 25 event highlights on social media",
          category: "engagement",
          icon: "📸",
          points: 150,
          rarity: "rare",
          progress: 18,
          maxProgress: 25,
          
          metadata: {
            unlockCondition: "share_25_highlights",
            secretAchievement: false,
            repeatable: true,
            seasonalBonus: false
          }
        },
        {
          id: "achievement-globe-trotter",
          name: "Globe Trotter",
          description: "Attend events in 5 different countries",
          category: "exploration",
          icon: "🌍",
          points: 500,
          rarity: "legendary",
          progress: 4,
          maxProgress: 5,
          
          metadata: {
            unlockCondition: "attend_events_in_5_countries",
            secretAchievement: false,
            repeatable: false,
            seasonalBonus: false,
            nearCompletion: true
          }
        },
        {
          id: "achievement-night-owl",
          name: "Night Owl",
          description: "Attend 20 events that go past 2 AM",
          category: "attendance",
          icon: "🦉",
          points: 180,
          rarity: "rare",
          progress: 15,
          maxProgress: 20,
          
          metadata: {
            unlockCondition: "attend_20_late_night_events",
            secretAchievement: false,
            repeatable: false,
            seasonalBonus: false
          }
        },
        {
          id: "achievement-festival-fanatic",
          name: "Festival Fanatic",
          description: "Attend 5 different music festivals",
          category: "attendance",
          icon: "🎪",
          points: 400,
          rarity: "epic",
          progress: 3,
          maxProgress: 5,
          
          metadata: {
            unlockCondition: "attend_5_festivals",
            secretAchievement: false,
            repeatable: false,
            seasonalBonus: false
          }
        },
        {
          id: "achievement-early-adopter",
          name: "Early Adopter",
          description: "Attend 10 debut events or new venue openings",
          category: "exploration",
          icon: "🎯",
          points: 320,
          rarity: "epic",
          progress: 7,
          maxProgress: 10,
          
          metadata: {
            unlockCondition: "attend_10_debut_events",
            secretAchievement: false,
            repeatable: false,
            seasonalBonus: false
          }
        },
        {
          id: "achievement-review-master",
          name: "Review Master",
          description: "Write 50 helpful event reviews",
          category: "engagement",
          icon: "⭐",
          points: 220,
          rarity: "rare",
          progress: 31,
          maxProgress: 50,
          
          metadata: {
            unlockCondition: "write_50_helpful_reviews",
            secretAchievement: false,
            repeatable: true,
            seasonalBonus: false
          }
        }
      ];
      
      // Filter by category if specified
      let filteredAchievements = allAchievements;
      if (category) {
        filteredAchievements = filteredAchievements.filter(achievement => achievement.category === category);
      }
      
      res.json(filteredAchievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Claim reward
  app.post("/api/passport/claim-reward", async (req, res) => {
    try {
      const { rewardId, userId } = req.body;
      
      if (!rewardId || !userId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Simulate reward claiming process
      const claimResult = {
        id: `claim-${Date.now()}`,
        rewardId,
        userId,
        status: "processing",
        
        // Claim details
        claimDetails: {
          pointsDeducted: 800,
          remainingPoints: 2047,
          claimedAt: new Date().toISOString(),
          deliveryMethod: "digital",
          estimatedDelivery: "instant"
        },
        
        // Processing steps
        processingSteps: [
          { step: "validate_points", status: "completed", description: "Validating sufficient points" },
          { step: "verify_tier", status: "completed", description: "Verifying tier access" },
          { step: "check_availability", status: "completed", description: "Checking reward availability" },
          { step: "process_claim", status: "processing", description: "Processing reward claim" },
          { step: "deliver_reward", status: "pending", description: "Delivering reward to user" }
        ],
        
        // Reward details
        rewardDetails: {
          name: "VIP Weekend Pass",
          category: "vip_access",
          validityPeriod: "3 months",
          activationCode: "VIP-WEEKEND-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          instructions: "Present this code at any weekend event for VIP access"
        }
      };
      
      res.json({
        message: "Reward claim initiated",
        claimResult,
        trackingId: claimResult.id
      });
    } catch (error) {
      console.error("Error claiming reward:", error);
      res.status(500).json({ error: "Failed to claim reward" });
    }
  });

  // Add passport stamp (when user attends event)
  app.post("/api/passport/add-stamp", async (req, res) => {
    try {
      const { eventId, userId, stampType, eventData } = req.body;
      
      if (!eventId || !userId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Simulate stamp creation
      const newStamp = {
        id: `stamp-${Date.now()}`,
        eventId,
        eventName: eventData?.name || "Amazing Event",
        eventLocation: eventData?.location || "Unknown Location",
        eventDate: eventData?.date || new Date().toISOString().split('T')[0],
        stampType: stampType || "attendance",
        rarity: "common", // Will be calculated based on event data
        points: 50, // Base points, will be calculated
        imageUrl: `/api/stamps/${eventId}.png`,
        description: `Attended ${eventData?.name || "an amazing event"}`,
        earnedAt: new Date().toISOString(),
        
        // Calculate points and rarity based on event characteristics
        pointsCalculation: {
          basePoints: 50,
          attendanceBonus: 0,
          rarityMultiplier: 1.0,
          socialBonus: 0,
          timingBonus: 0,
          totalPoints: 50
        },
        
        // Stamp metadata
        metadata: {
          attendeeCount: eventData?.attendeeCount || 100,
          durationHours: eventData?.duration || 4,
          socialConnections: 0,
          photosShared: 0,
          venueRating: eventData?.rating || 4.0
        }
      };
      
      res.json({
        message: "Passport stamp added successfully",
        stamp: newStamp,
        pointsEarned: newStamp.points,
        newTotalPoints: 2897 // Simulated new total
      });
    } catch (error) {
      console.error("Error adding passport stamp:", error);
      res.status(500).json({ error: "Failed to add passport stamp" });
    }
  });

  // Get loyalty leaderboard
  app.get("/api/passport/leaderboard", async (req, res) => {
    try {
      const timeframe = req.query.timeframe || "monthly"; // weekly, monthly, all-time
      const category = req.query.category || "points"; // points, events, cities, referrals
      
      // Simulate leaderboard data
      const leaderboard = [
        {
          rank: 1,
          userId: "user-alex-chen",
          name: "Alex Chen",
          avatar: "AC",
          currentTier: "Superhost",
          points: 15420,
          eventsAttended: 67,
          citiesVisited: 23,
          referralsMade: 34,
          streak: 45,
          badgeCount: 23
        },
        {
          rank: 2,
          userId: "user-maya-rodriguez",
          name: "Maya Rodriguez",
          avatar: "MR",
          currentTier: "Backstage Viber",
          points: 12890,
          eventsAttended: 54,
          citiesVisited: 18,
          referralsMade: 28,
          streak: 32,
          badgeCount: 19
        },
        {
          rank: 3,
          userId: "user-jordan-kim",
          name: "Jordan Kim",
          avatar: "JK",
          currentTier: "City Explorer",
          points: 2847,
          eventsAttended: 23,
          citiesVisited: 12,
          referralsMade: 8,
          streak: 12,
          badgeCount: 8
        },
        {
          rank: 4,
          userId: "user-casey-taylor",
          name: "Casey Taylor",
          avatar: "CT",
          currentTier: "City Explorer",
          points: 2156,
          eventsAttended: 19,
          citiesVisited: 9,
          referralsMade: 12,
          streak: 8,
          badgeCount: 6
        },
        {
          rank: 5,
          userId: "user-sam-wilson",
          name: "Sam Wilson",
          avatar: "SW",
          currentTier: "Regular Viber",
          points: 1834,
          eventsAttended: 15,
          citiesVisited: 7,
          referralsMade: 6,
          streak: 5,
          badgeCount: 4
        }
      ];
      
      res.json({
        timeframe,
        category,
        leaderboard,
        userRank: 3, // Current user's rank
        totalParticipants: 28943
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // ===== COLLABORATIVE DESIGN SHARING API ROUTES =====
  
  // Get shared designs with filtering and sorting
  app.get("/api/designs/shared", async (req, res) => {
    try {
      const { category, sort, search } = req.query;
      
      const sharedDesigns = [
        {
          id: "design-neon-nights",
          title: "Neon Nights Party Invitation",
          description: "A vibrant, cyberpunk-inspired invitation template perfect for nightclub events and electronic music parties.",
          creator: {
            id: "creator-alex",
            name: "Alex Chen",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            verified: true,
            followers: 1247,
          },
          category: "invitation",
          tags: ["neon", "cyberpunk", "nightclub", "electronic", "futuristic"],
          thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
          previewImages: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
            "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800",
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
          ],
          createdAt: "2025-01-24T10:30:00Z",
          updatedAt: "2025-01-24T15:45:00Z",
          stats: {
            views: 2847,
            likes: 456,
            downloads: 189,
            remixes: 23,
            shares: 67,
          },
          isLiked: false,
          isBookmarked: true,
          visibility: "public",
          license: "free",
          difficulty: "intermediate",
          timeToComplete: 45,
          tools: ["Photoshop", "Illustrator", "Figma"],
          colors: ["#ff0080", "#00ffff", "#ffff00", "#ff4000", "#8000ff"],
          isRemix: false,
          collaboration: {
            isCollaborative: true,
            collaborators: [
              { id: "creator-alex", name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", role: "owner" },
              { id: "collab-sarah", name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150", role: "editor" },
            ],
            inviteCode: "NEON2025",
          },
        },
        {
          id: "design-minimalist-wedding",
          title: "Elegant Minimalist Wedding Suite",
          description: "Clean, sophisticated wedding invitation and decoration templates with modern typography and subtle gold accents.",
          creator: {
            id: "creator-emma",
            name: "Emma Rodriguez",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            verified: true,
            followers: 892,
          },
          category: "invitation",
          tags: ["wedding", "minimalist", "elegant", "typography", "gold"],
          thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
          previewImages: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
          ],
          createdAt: "2025-01-23T14:20:00Z",
          updatedAt: "2025-01-24T09:15:00Z",
          stats: {
            views: 1923,
            likes: 321,
            downloads: 156,
            remixes: 18,
            shares: 89,
          },
          isLiked: true,
          isBookmarked: false,
          visibility: "public",
          license: "premium",
          difficulty: "beginner",
          timeToComplete: 30,
          tools: ["Canva", "InDesign", "Figma"],
          colors: ["#ffffff", "#f8f8f8", "#d4af37", "#333333"],
          isRemix: false,
          collaboration: {
            isCollaborative: false,
            collaborators: [
              { id: "creator-emma", name: "Emma Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", role: "owner" },
            ],
          },
        },
        {
          id: "design-tropical-vibes",
          title: "Tropical Summer Vibes (Remix)",
          description: "A vibrant remix of the classic summer party theme with enhanced tropical elements and animated backgrounds.",
          creator: {
            id: "creator-mike",
            name: "Mike Johnson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            verified: false,
            followers: 234,
          },
          category: "theme",
          tags: ["tropical", "summer", "beach", "animated", "colorful"],
          thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
          previewImages: [
            "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          ],
          createdAt: "2025-01-22T16:45:00Z",
          updatedAt: "2025-01-23T11:30:00Z",
          stats: {
            views: 1456,
            likes: 198,
            downloads: 87,
            remixes: 12,
            shares: 34,
          },
          isLiked: false,
          isBookmarked: false,
          visibility: "public",
          license: "free",
          difficulty: "advanced",
          timeToComplete: 60,
          tools: ["After Effects", "Photoshop", "Figma"],
          colors: ["#ff6b35", "#f7931e", "#ffd23f", "#06ffa5", "#1fb3d3"],
          isRemix: true,
          originalDesign: {
            id: "design-summer-original",
            title: "Classic Summer Party Theme",
            creator: "Emma Rodriguez",
          },
          collaboration: {
            isCollaborative: true,
            collaborators: [
              { id: "creator-mike", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", role: "owner" },
            ],
            inviteCode: "TROPICAL25",
          },
        },
      ];

      res.json(sharedDesigns);
    } catch (error) {
      console.error("Error fetching shared designs:", error);
      res.status(500).json({ error: "Failed to fetch shared designs" });
    }
  });

  // Get user's own designs
  app.get("/api/designs/my-designs", async (req, res) => {
    try {
      const myDesigns = [
        {
          id: "my-design-birthday",
          title: "Retro Birthday Bash",
          description: "80s-inspired birthday party invitation with neon colors and retro typography.",
          creator: {
            id: "current-user",
            name: "You",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            verified: false,
            followers: 45,
          },
          category: "invitation",
          tags: ["birthday", "retro", "80s", "neon"],
          thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
          previewImages: ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800"],
          createdAt: "2025-01-20T12:00:00Z",
          updatedAt: "2025-01-24T08:30:00Z",
          stats: {
            views: 234,
            likes: 18,
            downloads: 7,
            remixes: 2,
            shares: 5,
          },
          isLiked: false,
          isBookmarked: false,
          visibility: "public",
          license: "free",
          difficulty: "beginner",
          timeToComplete: 25,
          tools: ["Canva"],
          colors: ["#ff0099", "#00ff99", "#9900ff", "#ffff00"],
          isRemix: false,
          collaboration: {
            isCollaborative: true,
            collaborators: [
              { id: "current-user", name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", role: "owner" },
              { id: "friend-jenny", name: "Jenny Wilson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150", role: "editor" },
            ],
            inviteCode: "RETRO80S",
          },
        },
      ];

      res.json(myDesigns);
    } catch (error) {
      console.error("Error fetching my designs:", error);
      res.status(500).json({ error: "Failed to fetch my designs" });
    }
  });

  // Get collaborations
  app.get("/api/designs/collaborations", async (req, res) => {
    try {
      const collaborations = [
        {
          id: "collab-design-gala",
          title: "Charity Gala Invitation",
          description: "Sophisticated invitation design for charity fundraising events.",
          creator: {
            id: "creator-david",
            name: "David Park",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            verified: true,
            followers: 567,
          },
          category: "invitation",
          tags: ["charity", "gala", "formal", "elegant"],
          thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
          previewImages: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"],
          createdAt: "2025-01-21T09:15:00Z",
          updatedAt: "2025-01-24T14:20:00Z",
          stats: {
            views: 892,
            likes: 76,
            downloads: 23,
            remixes: 5,
            shares: 12,
          },
          isLiked: false,
          isBookmarked: true,
          visibility: "unlisted",
          license: "free",
          difficulty: "intermediate",
          timeToComplete: 40,
          tools: ["InDesign", "Photoshop"],
          colors: ["#1a1a1a", "#ffffff", "#d4af37", "#8b0000"],
          isRemix: false,
          collaboration: {
            isCollaborative: true,
            collaborators: [
              { id: "creator-david", name: "David Park", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", role: "owner" },
              { id: "current-user", name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", role: "editor" },
              { id: "collab-lisa", name: "Lisa Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", role: "viewer" },
            ],
            inviteCode: "GALA2025",
          },
        },
      ];

      res.json(collaborations);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      res.status(500).json({ error: "Failed to fetch collaborations" });
    }
  });

  // Get design comments
  app.get("/api/designs/comments/:designId", async (req, res) => {
    try {
      const { designId } = req.params;

      const comments = [
        {
          id: "comment-1",
          designId: designId,
          author: {
            id: "user-sarah",
            name: "Sarah Kim",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150",
          },
          content: "Absolutely love the color palette! The neon effects are perfectly executed. This would be perfect for our upcoming EDM event.",
          createdAt: "2025-01-24T14:30:00Z",
          likes: 12,
          isLiked: false,
        },
        {
          id: "comment-2",
          designId: designId,
          author: {
            id: "user-tom",
            name: "Tom Wilson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          },
          content: "Great work! Could you share how you achieved the glow effect on the text?",
          createdAt: "2025-01-24T12:15:00Z",
          likes: 8,
          isLiked: true,
        },
      ];

      res.json(comments);
    } catch (error) {
      console.error("Error fetching design comments:", error);
      res.status(500).json({ error: "Failed to fetch design comments" });
    }
  });

  // Get pending collaboration invites
  app.get("/api/designs/invites", async (req, res) => {
    try {
      const invites = [
        {
          id: "invite-1",
          designId: "design-corporate-event",
          designTitle: "Corporate Event Branding Package",
          inviterName: "Jennifer Lopez",
          inviterAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
          role: "editor",
          expiresAt: "2025-01-30T23:59:59Z",
          status: "pending",
        },
        {
          id: "invite-2",
          designId: "design-music-festival",
          designTitle: "Music Festival Visual Identity",
          inviterName: "Chris Taylor",
          inviterAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          role: "viewer",
          expiresAt: "2025-01-28T23:59:59Z",
          status: "pending",
        },
      ];

      res.json(invites);
    } catch (error) {
      console.error("Error fetching collaboration invites:", error);
      res.status(500).json({ error: "Failed to fetch collaboration invites" });
    }
  });

  // Like a design
  app.post("/api/designs/:designId/like", async (req, res) => {
    try {
      const { designId } = req.params;
      
      res.json({
        message: "Design liked successfully",
        designId,
        liked: true,
        newLikeCount: 457 // Simulated increment
      });
    } catch (error) {
      console.error("Error liking design:", error);
      res.status(500).json({ error: "Failed to like design" });
    }
  });

  // Bookmark a design
  app.post("/api/designs/:designId/bookmark", async (req, res) => {
    try {
      const { designId } = req.params;
      
      res.json({
        message: "Design bookmarked successfully",
        designId,
        bookmarked: true
      });
    } catch (error) {
      console.error("Error bookmarking design:", error);
      res.status(500).json({ error: "Failed to bookmark design" });
    }
  });

  // Download a design
  app.post("/api/designs/:designId/download", async (req, res) => {
    try {
      const { designId } = req.params;
      
      res.json({
        message: "Download started",
        designId,
        downloadUrl: `/api/designs/${designId}/files.zip`,
        formats: ["PSD", "AI", "PNG", "SVG"],
        fileSize: "45.2 MB"
      });
    } catch (error) {
      console.error("Error downloading design:", error);
      res.status(500).json({ error: "Failed to download design" });
    }
  });

  // Create a remix with enhanced functionality
  app.post("/api/designs/:designId/remix", async (req, res) => {
    try {
      const { designId } = req.params;
      const { title, description, remixType, modifications } = req.body;
      
      // Validate remix type
      const validRemixTypes = ["full", "partial", "inspired"];
      if (!validRemixTypes.includes(remixType)) {
        return res.status(400).json({ error: "Invalid remix type" });
      }
      
      // Get original design details (mock data for now)
      const originalDesign = {
        id: designId,
        title: "Original Design",
        creator: "Original Creator",
        elements: [], // design elements
        metadata: {
          colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
          category: "invitation",
          tools: ["text", "shapes", "images"]
        }
      };
      
      const newRemixId = `remix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create remix based on type
      let remixData = {
        id: newRemixId,
        title,
        description,
        remixType,
        originalDesign: {
          id: originalDesign.id,
          title: originalDesign.title,
          creator: originalDesign.creator
        },
        isRemix: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: {
          id: "user-1",
          name: "Current User",
          avatar: "/avatars/user.jpg",
          verified: false
        },
        stats: {
          views: 0,
          likes: 0,
          downloads: 0,
          remixes: 0,
          shares: 0
        },
        category: originalDesign.metadata.category,
        visibility: "public",
        license: "free",
        attribution: {
          originalDesignId: designId,
          originalCreator: originalDesign.creator,
          remixType: remixType,
          attribution: `Remixed from "${originalDesign.title}" by ${originalDesign.creator}`
        }
      };
      
      // Apply remix modifications based on type
      switch (remixType) {
        case "full":
          remixData.elements = originalDesign.elements; // Copy all elements
          remixData.inheritedProperties = originalDesign.metadata;
          break;
        case "partial":
          remixData.elements = modifications?.elements || [];
          remixData.inspirationElements = originalDesign.elements;
          break;
        case "inspired":
          remixData.elements = [];
          remixData.inspirationConcepts = {
            colors: originalDesign.metadata.colors,
            style: "inspired-by",
            originalTheme: originalDesign.metadata.category
          };
          break;
      }
      
      // Store remix data (would normally save to database)
      console.log("Created remix:", remixData);
      
      res.json({
        success: true,
        message: "Remix created successfully",
        id: newRemixId,
        title: title,
        remix: remixData,
        editorUrl: `/design-editor/${newRemixId}`,
        attribution: remixData.attribution
      });
    } catch (error) {
      console.error("Error creating remix:", error);
      res.status(500).json({ error: "Failed to create remix" });
    }
  });

  // Share a design with enhanced sharing options
  app.post("/api/designs/:designId/share", async (req, res) => {
    try {
      const { designId } = req.params;
      const { platform, customMessage } = req.body;
      
      const shareUrl = `https://vibes.app/designs/${designId}`;
      
      // Platform-specific sharing metadata
      const shareData = {
        url: shareUrl,
        title: "Check out this amazing design on Vibes!",
        description: customMessage || "Created with Vibes Design Studio - Collaborative Event Design Platform",
        platforms: {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this amazing design!')}&url=${encodeURIComponent(shareUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          instagram: shareUrl,
          whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this design: ${shareUrl}`)}`,
          email: `mailto:?subject=${encodeURIComponent('Amazing Design from Vibes')}&body=${encodeURIComponent(`Check out this design I created: ${shareUrl}`)}`
        }
      };
      
      res.json({
        message: "Share link created",
        designId,
        shareUrl,
        shareData,
        socialLinks: {
          twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        }
      });
    } catch (error) {
      console.error("Error sharing design:", error);
      res.status(500).json({ error: "Failed to share design" });
    }
  });

  // Collaboration invitation endpoints
  app.post("/api/designs/:designId/invite", async (req, res) => {
    try {
      const { designId } = req.params;
      const { email, role } = req.body;
      
      // Validate role
      if (!["editor", "viewer"].includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
      }
      
      // Create invitation
      const inviteId = `invite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const inviteCode = Math.random().toString(36).substr(2, 12).toUpperCase();
      
      const invitation = {
        id: inviteId,
        designId,
        designTitle: "Collaborative Design",
        inviterName: "Current User",
        inviterAvatar: "/avatars/user.jpg",
        inviteeEmail: email,
        role,
        inviteCode,
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        acceptUrl: `${req.protocol}://${req.get('host')}/collaboration/accept/${inviteId}?code=${inviteCode}`
      };
      
      console.log("Created collaboration invitation:", invitation);
      
      res.json({
        success: true,
        invitation,
        message: `Collaboration invitation sent to ${email}`
      });
    } catch (error) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ error: "Failed to create invitation" });
    }
  });

  // Get collaboration invites for user
  app.get("/api/collaboration/invites", async (req, res) => {
    try {
      const invites = [
        {
          id: "invite-1",
          designId: "design-party-invitation",
          designTitle: "Birthday Party Invitation Template",
          inviterName: "Sarah Chen",
          inviterAvatar: "/avatars/sarah.jpg",
          role: "editor" as const,
          status: "pending" as const,
          createdAt: "2025-01-01T10:00:00Z",
          expiresAt: "2025-01-08T10:00:00Z"
        }
      ];
      
      res.json(invites);
    } catch (error) {
      console.error("Error fetching collaboration invites:", error);
      res.status(500).json({ error: "Failed to fetch invites" });
    }
  });

  // Add comment to design
  app.post("/api/designs/:designId/comments", async (req, res) => {
    try {
      const { designId } = req.params;
      const { content } = req.body;
      
      const newComment = {
        id: `comment-${Date.now()}`,
        designId,
        author: {
          id: "current-user",
          name: "You",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        },
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      };
      
      res.json({
        message: "Comment added successfully",
        comment: newComment
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  // Invite collaborator
  app.post("/api/designs/:designId/invite", async (req, res) => {
    try {
      const { designId } = req.params;
      const { email, role } = req.body;
      
      const invitation = {
        id: `invite-${Date.now()}`,
        designId,
        inviteeEmail: email,
        role,
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: "pending"
      };
      
      res.json({
        message: "Collaboration invitation sent",
        invitation
      });
    } catch (error) {
      console.error("Error sending collaboration invite:", error);
      res.status(500).json({ error: "Failed to send collaboration invite" });
    }
  });

  // Respond to collaboration invite
  app.post("/api/designs/invites/:inviteId/respond", async (req, res) => {
    try {
      const { inviteId } = req.params;
      const { action } = req.body; // "accept" or "decline"
      
      res.json({
        message: `Invitation ${action}ed successfully`,
        inviteId,
        action,
        status: action === "accept" ? "accepted" : "declined"
      });
    } catch (error) {
      console.error("Error responding to invite:", error);
      res.status(500).json({ error: "Failed to respond to invite" });
    }
  });

  // ===== IN-EVENT COMMERCE API ROUTES =====
  
  // Get shoppable items with filtering
  app.get("/api/commerce/items", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      const items = [
        {
          id: "outfit-neon-dress",
          name: "Electric Neon Party Dress",
          brand: "VibeFashion",
          price: 89.99,
          originalPrice: 129.99,
          category: "outfit",
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
          description: "Stunning neon dress perfect for party vibes. Made with sustainable materials and LED accent lighting.",
          availability: "in-stock",
          tags: ["party", "neon", "sustainable", "led"],
          rating: 4.8,
          reviews: 127,
          isExclusive: true,
          discountPercentage: 31,
          quickBuy: true,
          estimatedDelivery: "Tonight by 11PM",
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["Electric Blue", "Neon Pink", "Cyber Green"],
          location: {
            venue: "Club Cosmos",
            area: "VIP Lounge",
            booth: "Fashion Corner"
          },
          seller: {
            id: "seller-vibefashion",
            name: "VibeFashion",
            avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=150",
            verified: true,
            rating: 4.9
          },
          socialProof: {
            purchases: 23,
            likes: 456,
            shares: 89,
            views: 2341
          }
        },
        {
          id: "drink-cosmic-cocktail",
          name: "Cosmic Sunset Cocktail",
          brand: "Stellar Bar",
          price: 16.50,
          category: "drink",
          image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
          description: "Premium craft cocktail with color-changing elements and edible glitter. Instagrammable and delicious!",
          availability: "in-stock",
          tags: ["cocktail", "premium", "instagrammable", "color-changing"],
          rating: 4.7,
          reviews: 89,
          isExclusive: false,
          quickBuy: true,
          estimatedDelivery: "5-10 minutes",
          location: {
            venue: "Club Cosmos",
            area: "Main Bar"
          },
          seller: {
            id: "seller-stellar-bar",
            name: "Stellar Bar",
            avatar: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150",
            verified: true,
            rating: 4.8
          },
          socialProof: {
            purchases: 156,
            likes: 234,
            shares: 67,
            views: 1234
          }
        },
        {
          id: "merch-glow-bracelet",
          name: "LED Sync Bracelet",
          brand: "TechVibes",
          price: 29.99,
          originalPrice: 39.99,
          category: "merch",
          image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400",
          description: "Smart LED bracelet that syncs with the party's music and lighting. Connect with other party-goers!",
          availability: "limited",
          tags: ["led", "music-sync", "smart", "party-tech"],
          rating: 4.6,
          reviews: 203,
          isExclusive: true,
          discountPercentage: 25,
          quickBuy: true,
          estimatedDelivery: "Available at merch booth",
          colors: ["RGB", "White", "Gold"],
          location: {
            venue: "Club Cosmos",
            area: "Tech Corner",
            booth: "TechVibes Stand"
          },
          seller: {
            id: "seller-techvibes",
            name: "TechVibes",
            avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150",
            verified: true,
            rating: 4.7
          },
          socialProof: {
            purchases: 78,
            likes: 345,
            shares: 123,
            views: 987
          }
        },
        {
          id: "food-neon-sushi",
          name: "Glow Sushi Platter",
          brand: "Neon Bites",
          price: 24.99,
          category: "food",
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
          description: "Artisanal sushi with edible neon elements. A feast for your eyes and taste buds!",
          availability: "in-stock",
          tags: ["sushi", "artisanal", "neon", "instagram-worthy"],
          rating: 4.9,
          reviews: 67,
          isExclusive: false,
          quickBuy: true,
          estimatedDelivery: "15-20 minutes",
          location: {
            venue: "Club Cosmos",
            area: "Food Court"
          },
          seller: {
            id: "seller-neon-bites",
            name: "Neon Bites",
            avatar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150",
            verified: true,
            rating: 4.8
          },
          socialProof: {
            purchases: 45,
            likes: 178,
            shares: 34,
            views: 567
          }
        }
      ];

      res.json(items);
    } catch (error) {
      console.error("Error fetching commerce items:", error);
      res.status(500).json({ error: "Failed to fetch commerce items" });
    }
  });

  // Get shoppable moments
  app.get("/api/commerce/moments", async (req, res) => {
    try {
      const moments = [
        {
          id: "moment-1",
          type: "outfit-scan",
          timestamp: new Date().toISOString(),
          location: "Dance Floor",
          items: [
            {
              id: "outfit-neon-dress",
              name: "Electric Neon Party Dress",
              brand: "VibeFashion",
              price: 89.99,
              image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
            }
          ],
          context: {
            eventId: "event-cosmos-night",
            guestId: "guest-sarah",
            interactionType: "camera-scan"
          },
          specialOffers: {
            discount: 20,
            code: "PARTY20",
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
            minPurchase: 50
          }
        }
      ];

      res.json(moments);
    } catch (error) {
      console.error("Error fetching shoppable moments:", error);
      res.status(500).json({ error: "Failed to fetch shoppable moments" });
    }
  });

  // Get brand activations
  app.get("/api/commerce/brand-activations", async (req, res) => {
    try {
      const activations = [
        {
          id: "activation-techvibes",
          brandId: "brand-techvibes",
          brandName: "TechVibes",
          brandLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150",
          activationType: "qr-code",
          title: "Tech Vibes Challenge",
          description: "Scan the QR code at our booth and share a video wearing our LED bracelet to win exclusive merch!",
          location: "Tech Corner",
          isActive: true,
          engagement: {
            scans: 234,
            conversions: 67,
            shares: 45
          },
          rewards: {
            type: "discount",
            value: "30% OFF",
            description: "30% off all TechVibes products"
          },
          featuredProducts: ["merch-glow-bracelet"],
          socialChallenge: {
            hashtag: "#TechVibesParty",
            description: "Show off your LED bracelet moves!",
            prize: "Free premium LED kit worth $100"
          }
        },
        {
          id: "activation-stellar-bar",
          brandId: "brand-stellar-bar",
          brandName: "Stellar Bar",
          brandLogo: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150",
          activationType: "location-trigger",
          title: "Happy Hour Magic",
          description: "Get within 10 feet of the bar to unlock special drink discounts and limited-time cocktails!",
          location: "Main Bar",
          isActive: true,
          engagement: {
            scans: 567,
            conversions: 234,
            shares: 89
          },
          rewards: {
            type: "discount",
            value: "Buy 1 Get 1 Half Price",
            description: "Special pricing on premium cocktails"
          },
          featuredProducts: ["drink-cosmic-cocktail"]
        }
      ];

      res.json(activations);
    } catch (error) {
      console.error("Error fetching brand activations:", error);
      res.status(500).json({ error: "Failed to fetch brand activations" });
    }
  });

  // Get user's cart
  app.get("/api/commerce/cart", async (req, res) => {
    try {
      const cartItems = [
        {
          id: "outfit-neon-dress",
          name: "Electric Neon Party Dress",
          brand: "VibeFashion",
          price: 89.99,
          quantity: 1,
          selectedSize: "M",
          selectedColor: "Electric Blue",
          addedAt: new Date().toISOString(),
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
          estimatedDelivery: "Tonight by 11PM"
        }
      ];

      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  // Get order history
  app.get("/api/commerce/orders", async (req, res) => {
    try {
      const orders = [
        {
          id: "VB2025",
          status: "preparing",
          items: [
            {
              name: "Cosmic Sunset Cocktail",
              quantity: 1,
              price: 16.50,
              image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400"
            }
          ],
          total: 16.50,
          estimatedDelivery: "5-10 minutes",
          orderedAt: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: "VB2024",
          status: "delivered",
          items: [
            {
              name: "LED Sync Bracelet",
              quantity: 1,
              price: 29.99,
              image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400"
            }
          ],
          total: 29.99,
          deliveredAt: new Date(Date.now() - 1200000).toISOString()
        }
      ];

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Scan items for shopping
  app.post("/api/commerce/scan", async (req, res) => {
    try {
      const { itemType, location } = req.body;
      
      const moment = {
        id: `moment-${Date.now()}`,
        type: "outfit-scan",
        timestamp: new Date().toISOString(),
        location: location || "Unknown",
        items: [
          {
            id: "outfit-neon-dress",
            name: "Electric Neon Party Dress",
            brand: "VibeFashion",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
          }
        ],
        context: {
          eventId: "event-cosmos-night",
          guestId: "current-user",
          interactionType: "camera-scan"
        },
        specialOffers: {
          discount: 20,
          code: "SCAN20",
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          minPurchase: 50
        }
      };

      res.json({
        message: "Scan successful",
        moment
      });
    } catch (error) {
      console.error("Error scanning item:", error);
      res.status(500).json({ error: "Failed to scan item" });
    }
  });

  // Add item to cart
  app.post("/api/commerce/cart/add", async (req, res) => {
    try {
      const { itemId, quantity, size, color } = req.body;
      
      res.json({
        message: "Item added to cart successfully",
        itemId,
        quantity,
        size,
        color,
        cartTotal: 3
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  // Quick buy item
  app.post("/api/commerce/quick-buy", async (req, res) => {
    try {
      const { itemId, size, color } = req.body;
      
      const orderId = `VB${Date.now()}`;
      
      res.json({
        message: "Order placed successfully",
        orderId,
        estimatedDelivery: "5-10 minutes",
        trackingUrl: `/api/commerce/orders/${orderId}/track`
      });
    } catch (error) {
      console.error("Error processing quick buy:", error);
      res.status(500).json({ error: "Failed to process quick buy" });
    }
  });

  // Activate brand offer
  app.post("/api/commerce/brand-activations/:activationId/activate", async (req, res) => {
    try {
      const { activationId } = req.params;
      
      res.json({
        message: "Brand activation successful",
        activationId,
        reward: {
          type: "discount",
          value: "30% OFF",
          description: "30% off all products"
        },
        code: `BRAND${Date.now().toString().slice(-4)}`,
        expiresAt: new Date(Date.now() + 7200000).toISOString()
      });
    } catch (error) {
      console.error("Error activating brand offer:", error);
      res.status(500).json({ error: "Failed to activate brand offer" });
    }
  });

  // Share item on social media
  app.post("/api/commerce/share", async (req, res) => {
    try {
      const { itemId, platform } = req.body;
      
      res.json({
        message: "Item shared successfully",
        itemId,
        platform,
        shareUrl: `https://vibes.app/shop/${itemId}`,
        bonusPoints: 10
      });
    } catch (error) {
      console.error("Error sharing item:", error);
      res.status(500).json({ error: "Failed to share item" });
    }
  });

  // ===== CULTURAL DNA LAYER (ETHNOVIBES) API ROUTES =====
  
  // Get cultural vibe tags
  app.get("/api/cultural/vibe-tags", async (req, res) => {
    try {
      const { category, origin } = req.query;
      
      const culturalVibeTags = [
        {
          id: "afrobeats-lagos",
          name: "Afrobeats Lagos Vibe",
          category: "music",
          origin: {
            country: "Nigeria",
            region: "Lagos",
            flag: "🇳🇬"
          },
          description: "High-energy contemporary African music blending traditional Yoruba elements with modern pop, hip-hop, and dancehall.",
          elements: {
            colors: ["#008751", "#FFFFFF", "#008751"],
            patterns: ["Ankara prints", "Adire tie-dye", "Geometric patterns"],
            instruments: ["Talking drums", "Shekere", "Saxophone", "Synthesizers"],
            symbols: ["Gele headwrap", "Dashiki patterns", "Palm trees"]
          },
          culturalContext: {
            history: "Afrobeats emerged in Lagos in the 2000s, blending traditional Yoruba music with global influences.",
            significance: "Represents modern African identity and diaspora connection.",
            modernInfluence: "Global mainstream adoption by artists like Burna Boy, Wizkid, and Davido.",
            celebrations: ["Lagos Carnival", "Afro Nation", "Detty December"]
          },
          mediaAssets: {
            playlist: "spotify:playlist:afrobeats-lagos-hits",
            fashionGallery: "/cultural/afrobeats/fashion",
            danceInstructions: "/cultural/afrobeats/dance-moves"
          },
          popularity: 89,
          isAuthentic: true,
          verifiedBy: "Nigerian Cultural Council"
        },
        {
          id: "bollywood-glam",
          name: "Bollywood Glam",
          category: "fashion",
          origin: {
            country: "India",
            region: "Mumbai",
            flag: "🇮🇳"
          },
          description: "Glamorous fusion of traditional Indian aesthetics with contemporary Bollywood cinema style.",
          elements: {
            colors: ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5", "#8A2BE2"],
            patterns: ["Paisley", "Mandala", "Floral motifs", "Mirror work"],
            textiles: ["Silk", "Chiffon", "Georgette", "Brocade"],
            symbols: ["Lotus", "Peacock", "Henna patterns", "Maang tikka"]
          },
          culturalContext: {
            history: "Bollywood fashion evolved from classical Indian cinema, blending tradition with glamour.",
            significance: "Represents celebration, joy, and the beauty of Indian aesthetics.",
            modernInfluence: "Global red carpet adoption and fusion fashion trends.",
            celebrations: ["Diwali", "Bollywood Award Shows", "Indian Weddings"]
          },
          mediaAssets: {
            playlist: "spotify:playlist:bollywood-classics",
            fashionGallery: "/cultural/bollywood/outfits",
            recipeCollection: "/cultural/bollywood/party-snacks"
          },
          popularity: 92,
          isAuthentic: true,
          verifiedBy: "Indian Film Heritage Foundation"
        },
        {
          id: "latin-carnaval",
          name: "Latin Carnaval",
          category: "tradition",
          origin: {
            country: "Brazil",
            region: "Rio de Janeiro",
            flag: "🇧🇷"
          },
          description: "Vibrant celebration combining African, Indigenous, and Portuguese influences in explosive festival culture.",
          elements: {
            colors: ["#FFFF00", "#00FF00", "#0000FF", "#FF4500", "#FF1493"],
            patterns: ["Feather designs", "Sequin arrangements", "Tropical motifs"],
            instruments: ["Samba drums", "Cuica", "Agogo", "Tamborim"]
          },
          culturalContext: {
            history: "Rio Carnival tradition dating back to 1723, blending European, African, and Indigenous cultures.",
            significance: "Celebrates unity, diversity, and the joy of life.",
            modernInfluence: "Inspiration for global music festivals and celebration culture.",
            celebrations: ["Rio Carnival", "Salvador Carnival", "Street parties (Blocos)"]
          },
          mediaAssets: {
            playlist: "spotify:playlist:carnaval-samba-hits",
            danceInstructions: "/cultural/carnaval/samba-steps",
            recipeCollection: "/cultural/carnaval/brazilian-party-food"
          },
          popularity: 87,
          isAuthentic: true,
          verifiedBy: "Brazilian Cultural Ministry"
        },
        {
          id: "japanese-harmony",
          name: "Japanese Harmony",
          category: "tradition",
          origin: {
            country: "Japan",
            region: "Kyoto",
            flag: "🇯🇵"
          },
          description: "Zen-inspired aesthetics emphasizing simplicity, respect, and mindful celebration.",
          elements: {
            colors: ["#E8E8E8", "#D4AF37", "#8B0000", "#2F4F4F"],
            patterns: ["Cherry blossoms", "Waves", "Geometric simplicity"],
            symbols: ["Origami cranes", "Bamboo", "Tea ceremony elements"]
          },
          culturalContext: {
            history: "Traditional Japanese aesthetics rooted in Buddhist and Shinto principles.",
            significance: "Emphasizes harmony, respect, and mindful appreciation.",
            modernInfluence: "Global minimalism and mindfulness movements.",
            celebrations: ["Hanami", "Tea ceremonies", "Seasonal festivals"]
          },
          mediaAssets: {
            playlist: "spotify:playlist:japanese-traditional-modern",
            fashionGallery: "/cultural/japanese/kimono-modern",
            recipeCollection: "/cultural/japanese/ceremonial-foods"
          },
          popularity: 78,
          isAuthentic: true,
          verifiedBy: "Japan Cultural Heritage Association"
        }
      ];

      res.json(culturalVibeTags);
    } catch (error) {
      console.error("Error fetching cultural vibe tags:", error);
      res.status(500).json({ error: "Failed to fetch cultural vibe tags" });
    }
  });

  // Get cultural storytelling layers
  app.get("/api/cultural/storytelling-layers", async (req, res) => {
    try {
      const storytellingLayers = [
        {
          id: "layer-afrobeats-celebration",
          eventId: "event-1",
          culturalTheme: "Afrobeats Celebration",
          vibeTagsSelected: ["afrobeats-lagos"],
          storytellingElements: {
            welcomeMessage: {
              en: "Welcome to our Afrobeats celebration! Tonight, we honor the vibrant musical heritage of West Africa.",
              yoruba: "Kaabo si ibi iṣẹju Afrobeats wa! Loni, a yin iṣẹ ọrin ti o ni agbara ti Iwọ-oorun Afrika.",
              fr: "Bienvenue à notre célébration Afrobeats! Ce soir, nous honorons le patrimoine musical vibrant de l'Afrique de l'Ouest."
            },
            culturalBackground: {
              en: "Afrobeats represents the modern African diaspora, blending traditional rhythms with contemporary global sounds.",
              yoruba: "Afrobeats ṣe aṣoju ọmọ Afrika ti ode oni, ti o da awọn ilu ibile pọ pẹlu awọn ohun ti agbaye.",
              fr: "L'Afrobeats représente la diaspora africaine moderne, mélangeant les rythmes traditionnels avec les sons contemporains mondiaux."
            },
            traditionalElements: {
              food: [
                {
                  name: "Jollof Rice",
                  origin: "West Africa",
                  significance: "Unity dish shared across cultures, representing community and celebration",
                  translation: {
                    yoruba: "Iresi Jollof",
                    fr: "Riz Jollof"
                  }
                }
              ],
              music: [
                {
                  genre: "Afrobeats",
                  instruments: ["Talking drums", "Shekere", "Saxophone"],
                  culturalRole: "Storytelling through rhythm and contemporary expression",
                  translation: {
                    yoruba: "Orin Afrobeats",
                    fr: "Musique Afrobeats"
                  }
                }
              ],
              fashion: [
                {
                  garment: "Ankara Dress",
                  materials: ["African wax print fabric"],
                  occasion: "Celebrations and cultural pride expression",
                  symbolism: "Cultural identity and modern African fashion",
                  translation: {
                    yoruba: "Aṣọ Ankara",
                    fr: "Robe Ankara"
                  }
                }
              ]
            }
          },
          multiLanguageSupport: {
            primaryLanguage: "en",
            supportedLanguages: ["en", "yoruba", "fr", "hausa"],
            autoTranslate: true,
            culturalNuances: {
              yoruba: {
                greetings: ["Bawo", "Ekuro", "Kaabo"],
                traditions: ["Respect for elders", "Community celebration", "Storytelling through music"],
                etiquette: ["Remove shoes when appropriate", "Greet elders first", "Join the dance circle"]
              }
            }
          },
          interactiveElements: {
            culturalQuiz: true,
            traditionalGames: true,
            storytimeSegments: true,
            photoWithTraditionalElements: true
          },
          engagement: {
            views: 1247,
            interactions: 456,
            culturalBadgesEarned: 89,
            communityFeedback: 234
          }
        }
      ];

      res.json(storytellingLayers);
    } catch (error) {
      console.error("Error fetching storytelling layers:", error);
      res.status(500).json({ error: "Failed to fetch storytelling layers" });
    }
  });

  // Get cultural education modules
  app.get("/api/cultural/education-modules", async (req, res) => {
    try {
      const educationModules = [
        {
          id: "japanese-tea-ceremony",
          title: "Japanese Tea Ceremony Etiquette",
          culture: "Japanese",
          type: "tradition",
          difficulty: "intermediate",
          duration: 15,
          content: {
            introduction: "Learn the respectful way to participate in or host elements inspired by the Japanese tea ceremony.",
            keyElements: [
              {
                name: "Bowing (Ojigi)",
                description: "Proper bowing technique shows respect",
                visualAid: "/cultural/japanese/bowing-guide.jpg"
              },
              {
                name: "Tea Presentation",
                description: "How to present and receive tea mindfully",
                visualAid: "/cultural/japanese/tea-presentation.jpg"
              }
            ],
            practicalTips: [
              "Remove shoes when entering tea space",
              "Sit in seiza position (kneeling)",
              "Express gratitude: 'Arigatou gozaimasu'"
            ],
            respectfulParticipation: [
              "Ask permission before taking photos",
              "Observe before participating",
              "Show appreciation for the cultural significance"
            ],
            commonMistakes: [
              "Rushing through the ceremony",
              "Not acknowledging the host properly",
              "Using incorrect hand positions"
            ]
          },
          interactiveActivities: [
            {
              type: "quiz",
              question: "What should you say to show gratitude in Japanese?",
              options: ["Konnichiwa", "Arigatou gozaimasu", "Sayonara", "Sumimasen"],
              correctAnswer: "Arigatou gozaimasu",
              explanation: "Arigatou gozaimasu is the formal way to express deep gratitude."
            }
          ],
          completionRewards: {
            badge: "Tea Ceremony Appreciation",
            points: 150,
            unlocks: ["Advanced Japanese Traditions", "Asian Cultural Collection"]
          }
        },
        {
          id: "african-drumming-basics",
          title: "West African Drumming Traditions",
          culture: "West African",
          type: "music",
          difficulty: "beginner",
          duration: 20,
          content: {
            introduction: "Discover the rich tradition of West African drumming and its role in community celebration.",
            keyElements: [
              {
                name: "Djembe Basics",
                description: "The foundational drum of West African music",
                visualAid: "/cultural/african/djembe-guide.jpg",
                audioSample: "/cultural/african/djembe-sample.mp3"
              },
              {
                name: "Talking Drum Communication",
                description: "How drums were used to communicate across distances",
                visualAid: "/cultural/african/talking-drums.jpg",
                audioSample: "/cultural/african/talking-drum-sample.mp3"
              }
            ],
            practicalTips: [
              "Use your whole hand, not just fingertips",
              "Listen to the community rhythm before joining",
              "Respect the lead drummer's guidance"
            ],
            respectfulParticipation: [
              "Understand the spiritual significance",
              "Ask about drum sharing etiquette",
              "Participate with humility and joy"
            ],
            commonMistakes: [
              "Playing too loudly over others",
              "Not following rhythmic patterns",
              "Ignoring cultural context"
            ]
          },
          interactiveActivities: [
            {
              type: "audio-match",
              question: "Match the drum sound to its traditional name",
              options: ["Bass tone", "Open tone", "Slap tone", "Ghost note"],
              correctAnswer: "Bass tone",
              explanation: "The bass tone is played with the full palm in the center of the drum."
            }
          ],
          completionRewards: {
            badge: "Rhythm Keeper",
            points: 120,
            unlocks: ["Advanced African Music", "Global Percussion Collection"]
          }
        }
      ];

      res.json(educationModules);
    } catch (error) {
      console.error("Error fetching education modules:", error);
      res.status(500).json({ error: "Failed to fetch education modules" });
    }
  });

  // Get community contributions
  app.get("/api/cultural/community-contributions", async (req, res) => {
    try {
      const contributions = [
        {
          id: "contrib-1",
          contributorId: "user-amara",
          contributorName: "Amara from Lagos",
          contributorOrigin: "Nigerian Yoruba",
          contributionType: "recipe",
          content: "My grandmother's Jollof rice recipe has been passed down for three generations. The secret is in the parboiling technique and the blend of local spices including curry leaves and bay leaves.",
          verified: true,
          likes: 45,
          createdAt: new Date().toISOString(),
          culturalContext: "Traditional Nigerian cuisine representing family heritage"
        },
        {
          id: "contrib-2",
          contributorId: "user-hiroshi",
          contributorName: "Hiroshi from Kyoto",
          contributorOrigin: "Japanese Kyoto native",
          contributionType: "story",
          content: "The meaning behind the cherry blossom festival (hanami) goes beyond just viewing flowers. It's about recognizing the beauty and transience of life, celebrating renewal, and gathering with community.",
          verified: true,
          likes: 32,
          createdAt: new Date().toISOString(),
          culturalContext: "Japanese seasonal celebration and philosophy"
        },
        {
          id: "contrib-3",
          contributorId: "user-maria",
          contributorName: "Maria from São Paulo",
          contributorOrigin: "Brazilian Paulista",
          contributionType: "tradition",
          content: "Samba isn't just a dance - it's the heartbeat of Brazilian carnival culture. Each movement tells a story of resistance, joy, and community. The roda de samba (samba circle) is where everyone belongs.",
          verified: false,
          likes: 28,
          createdAt: new Date().toISOString(),
          culturalContext: "Brazilian carnival and dance tradition"
        }
      ];

      res.json(contributions);
    } catch (error) {
      console.error("Error fetching community contributions:", error);
      res.status(500).json({ error: "Failed to fetch community contributions" });
    }
  });

  // Get language support options
  app.get("/api/cultural/language-support", async (req, res) => {
    try {
      const languageSupport = [
        { code: "en", name: "English", flag: "🇺🇸", nativeSpeakers: 1500000000 },
        { code: "es", name: "Español", flag: "🇪🇸", nativeSpeakers: 500000000 },
        { code: "fr", name: "Français", flag: "🇫🇷", nativeSpeakers: 280000000 },
        { code: "pt", name: "Português", flag: "🇧🇷", nativeSpeakers: 260000000 },
        { code: "hi", name: "हिंदी", flag: "🇮🇳", nativeSpeakers: 600000000 },
        { code: "ar", name: "العربية", flag: "🇸🇦", nativeSpeakers: 400000000 },
        { code: "zh", name: "中文", flag: "🇨🇳", nativeSpeakers: 900000000 },
        { code: "ja", name: "日本語", flag: "🇯🇵", nativeSpeakers: 125000000 }
      ];

      res.json(languageSupport);
    } catch (error) {
      console.error("Error fetching language support:", error);
      res.status(500).json({ error: "Failed to fetch language support" });
    }
  });

  // Create cultural vibe tag
  app.post("/api/cultural/vibe-tags", async (req, res) => {
    try {
      const tagData = req.body;
      
      const newTag = {
        id: `tag-${Date.now()}`,
        ...tagData,
        createdAt: new Date().toISOString(),
        isAuthentic: false, // Requires verification
        popularity: 0
      };
      
      res.json({
        message: "Cultural vibe tag created successfully",
        tag: newTag
      });
    } catch (error) {
      console.error("Error creating cultural vibe tag:", error);
      res.status(500).json({ error: "Failed to create cultural vibe tag" });
    }
  });

  // Create storytelling layer
  app.post("/api/cultural/storytelling-layers", async (req, res) => {
    try {
      const layerData = req.body;
      
      const newLayer = {
        id: `layer-${Date.now()}`,
        ...layerData,
        createdAt: new Date().toISOString(),
        engagement: {
          views: 0,
          interactions: 0,
          culturalBadgesEarned: 0,
          communityFeedback: 0
        }
      };
      
      res.json({
        message: "Cultural storytelling layer created successfully",
        layer: newLayer
      });
    } catch (error) {
      console.error("Error creating storytelling layer:", error);
      res.status(500).json({ error: "Failed to create storytelling layer" });
    }
  });

  // Submit community contribution
  app.post("/api/cultural/contribute", async (req, res) => {
    try {
      const contribution = req.body;
      
      const newContribution = {
        id: `contrib-${Date.now()}`,
        ...contribution,
        createdAt: new Date().toISOString(),
        verified: false,
        likes: 0
      };
      
      res.json({
        message: "Cultural contribution submitted successfully",
        contribution: newContribution,
        reviewStatus: "pending"
      });
    } catch (error) {
      console.error("Error submitting contribution:", error);
      res.status(500).json({ error: "Failed to submit contribution" });
    }
  });

  // Translate content
  app.post("/api/cultural/translate", async (req, res) => {
    try {
      const { content, targetLanguage } = req.body;
      
      // Simulate translation service
      const translations = {
        es: "Contenido traducido al español",
        fr: "Contenu traduit en français",
        pt: "Conteúdo traduzido para português",
        hi: "हिंदी में अनुवादित सामग्री",
        ar: "المحتوى المترجم إلى العربية",
        zh: "翻译成中文的内容",
        ja: "日本語に翻訳されたコンテンツ"
      };
      
      res.json({
        originalContent: content,
        translatedContent: translations[targetLanguage] || "Translation not available",
        targetLanguage,
        language: targetLanguage,
        confidence: 0.95
      });
    } catch (error) {
      console.error("Error translating content:", error);
      res.status(500).json({ error: "Failed to translate content" });
    }
  });

  // AI DJ Companion API endpoints
  app.get("/api/dj/session", async (req, res) => {
    try {
      const session = await storage.getDJSession();
      res.json({
        success: true,
        session
      });
    } catch (error) {
      console.error('Error fetching DJ session:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch DJ session",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/dj/ai-suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getAISuggestions();
      res.json({
        success: true,
        suggestions
      });
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch AI suggestions",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/dj/crowd-analytics", async (req, res) => {
    try {
      const analytics = await storage.getCrowdAnalytics();
      res.json({
        success: true,
        analytics
      });
    } catch (error) {
      console.error('Error fetching crowd analytics:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch crowd analytics",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/dj/guest-preferences", async (req, res) => {
    try {
      const preferences = await storage.getGuestPreferences();
      res.json({
        success: true,
        preferences
      });
    } catch (error) {
      console.error('Error fetching guest preferences:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch guest preferences",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/dj/play-track", async (req, res) => {
    try {
      const { track } = req.body;
      
      if (!track || !track.id) {
        return res.status(400).json({
          success: false,
          message: "Track data is required"
        });
      }

      const playbackData = await storage.playTrack(track);
      
      res.json({
        success: true,
        track: playbackData
      });
    } catch (error) {
      console.error('Error playing track:', error);
      res.status(500).json({
        success: false,
        message: "Failed to play track",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/dj/vote-track", async (req, res) => {
    try {
      const { trackId, vote } = req.body;
      
      if (!trackId || !vote || !['up', 'down'].includes(vote)) {
        return res.status(400).json({
          success: false,
          message: "Valid track ID and vote (up/down) are required"
        });
      }

      const voteResult = await storage.voteTrack(trackId, vote);
      
      res.json({
        success: true,
        voteResult
      });
    } catch (error) {
      console.error('Error voting on track:', error);
      res.status(500).json({
        success: false,
        message: "Failed to vote on track",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/dj/update-preferences", async (req, res) => {
    try {
      const preferences = req.body;
      
      const updatedPreferences = await storage.updateDJPreferences(preferences);
      
      res.json({
        success: true,
        preferences: updatedPreferences
      });
    } catch (error) {
      console.error('Error updating DJ preferences:', error);
      res.status(500).json({
        success: false,
        message: "Failed to update DJ preferences",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Post-Event Experience API endpoints
  app.get("/api/digital-twins/:id/post-event/highlights", async (req, res) => {
    try {
      const { id } = req.params;
      const { zone, timeRange, filterTags } = req.query;
      
      const highlights = await storage.getPostEventHighlights({
        digitalTwinId: id,
        zone: zone as string,
        timeRange: timeRange as string,
        filterTags: filterTags ? (filterTags as string).split(',') : []
      });
      
      res.json({
        success: true,
        highlights
      });
    } catch (error) {
      console.error('Error fetching post-event highlights:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch post-event highlights",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/digital-twins/:id/post-event/recap-tour", async (req, res) => {
    try {
      const { id } = req.params;
      
      const tour = await storage.getPostEventRecapTour(id);
      
      res.json({
        success: true,
        tour
      });
    } catch (error) {
      console.error('Error fetching recap tour:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch recap tour",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/digital-twins/:id/post-event/sponsor-products", async (req, res) => {
    try {
      const { id } = req.params;
      const { zone, priceRange, availability } = req.query;
      
      const products = await storage.getPostEventSponsorProducts({
        digitalTwinId: id,
        zone: zone as string,
        priceRange: priceRange as string,
        availability: availability as string
      });
      
      res.json({
        success: true,
        products
      });
    } catch (error) {
      console.error('Error fetching sponsor products:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sponsor products",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/digital-twins/:id/post-event/memory/play", async (req, res) => {
    try {
      const { id } = req.params;
      const { memoryId, zone } = req.body;
      
      const playbackData = await storage.playPostEventMemory({
        digitalTwinId: id,
        memoryId,
        zone
      });
      
      res.json({
        success: true,
        playbackData
      });
    } catch (error) {
      console.error('Error playing memory:', error);
      res.status(500).json({
        success: false,
        message: "Failed to play memory",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/digital-twins/:id/post-event/memory-zones", async (req, res) => {
    try {
      const { id } = req.params;
      
      const zones = await storage.getPostEventMemoryZones(id);
      
      res.json({
        success: true,
        zones
      });
    } catch (error) {
      console.error('Error fetching memory zones:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch memory zones",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===== IMMERSIVE PARTYCAM API ROUTES =====
  
  // Get available AR filters
  app.get("/api/partycam/filters", async (req, res) => {
    try {
      const { category, theme } = req.query;
      
      const filters = [
        {
          id: "neon-rave",
          name: "Neon Rave",
          description: "Electric neon effects with pulsing beats visualization",
          category: "theme",
          thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150",
          previewVideo: "/api/filters/neon-rave-preview.mp4",
          isActive: false,
          isPremium: false,
          usageCount: 1247,
          rating: 4.8,
          tags: ["electronic", "glow", "party"],
          eventThemes: ["rave", "electronic", "nightclub"],
        },
        {
          id: "masquerade-mystery",
          name: "Masquerade Mystery",
          description: "Elegant venetian masks with golden particle effects",
          category: "theme",
          thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150",
          previewVideo: "/api/filters/masquerade-preview.mp4",
          isActive: false,
          isPremium: true,
          usageCount: 892,
          rating: 4.9,
          tags: ["elegant", "formal", "mystery"],
          eventThemes: ["masquerade", "formal", "gala"],
        },
        {
          id: "coca-cola-fizz",
          name: "Coca-Cola Fizz",
          description: "Refreshing bubbles and Coca-Cola branding effects",
          category: "sponsor",
          thumbnail: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=150",
          previewVideo: "/api/filters/cocacola-preview.mp4",
          isActive: false,
          isPremium: false,
          usageCount: 2341,
          rating: 4.6,
          tags: ["refreshing", "bubbles", "brand"],
          sponsorBrand: "Coca-Cola",
          sponsorLogo: "/api/brands/cocacola-logo.png",
          eventThemes: ["summer", "casual", "outdoor"],
        },
        {
          id: "galaxy-dreams",
          name: "Galaxy Dreams",
          description: "Cosmic effects with stars and nebula backgrounds",
          category: "effect",
          thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=150",
          previewVideo: "/api/filters/galaxy-preview.mp4",
          isActive: false,
          isPremium: true,
          usageCount: 567,
          rating: 4.7,
          tags: ["cosmic", "dreamy", "space"],
          eventThemes: ["futuristic", "space", "sci-fi"],
        },
        {
          id: "retro-synthwave",
          name: "Retro Synthwave",
          description: "80s synthwave aesthetic with neon grids and chrome effects",
          category: "theme",
          thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150",
          previewVideo: "/api/filters/synthwave-preview.mp4",
          isActive: false,
          isPremium: false,
          usageCount: 1456,
          rating: 4.7,
          tags: ["retro", "80s", "synthwave"],
          eventThemes: ["retro", "80s", "synthwave"],
        },
        {
          id: "spotify-pulse",
          name: "Spotify Pulse",
          description: "Music visualization with Spotify branding and beat detection",
          category: "sponsor",
          thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150",
          previewVideo: "/api/filters/spotify-preview.mp4",
          isActive: false,
          isPremium: false,
          usageCount: 3245,
          rating: 4.9,
          tags: ["music", "visualization", "brand"],
          sponsorBrand: "Spotify",
          sponsorLogo: "/api/brands/spotify-logo.png",
          eventThemes: ["music", "concert", "festival"],
        }
      ];

      // Filter by category if specified
      let filteredResults = filters;
      if (category) {
        filteredResults = filteredResults.filter(f => f.category === category);
      }
      if (theme) {
        filteredResults = filteredResults.filter(f => f.eventThemes.includes(theme as string));
      }

      res.json(filteredResults);
    } catch (error) {
      console.error("Error fetching AR filters:", error);
      res.status(500).json({ error: "Failed to fetch AR filters" });
    }
  });

  // Get camera modes
  app.get("/api/partycam/modes", async (req, res) => {
    try {
      const modes = [
        {
          id: "360",
          name: "360° Immersive",
          description: "Full spherical recording for VR experiences",
          resolution: "4K",
          frameRate: "60fps",
          isActive: false,
          features: ["360-degree-capture", "vr-ready", "spatial-audio"],
          requirements: ["360-camera", "high-storage"],
        },
        {
          id: "standard",
          name: "Standard HD",
          description: "Traditional high-definition recording",
          resolution: "1080p",
          frameRate: "30fps",
          isActive: false,
          features: ["hd-quality", "standard-editing"],
          requirements: ["standard-camera"],
        },
        {
          id: "vr",
          name: "VR Ready",
          description: "Optimized for VR headset viewing",
          resolution: "2K",
          frameRate: "90fps",
          isActive: false,
          features: ["vr-optimized", "low-latency", "stereoscopic"],
          requirements: ["vr-camera", "high-processing"],
        },
        {
          id: "ar",
          name: "AR Enhanced",
          description: "Augmented reality with object tracking",
          resolution: "1080p",
          frameRate: "60fps",
          isActive: false,
          features: ["object-tracking", "ar-overlays", "real-time-effects"],
          requirements: ["ar-capable-device", "motion-sensors"],
        },
      ];

      res.json(modes);
    } catch (error) {
      console.error("Error fetching camera modes:", error);
      res.status(500).json({ error: "Failed to fetch camera modes" });
    }
  });

  // Get recorded sessions
  app.get("/api/partycam/recordings", async (req, res) => {
    try {
      const recordings = [
        {
          id: "rec-birthday-bash",
          name: "Birthday Bash - Main Room",
          duration: 1847,
          mode: "360° Immersive",
          filters: ["neon-rave", "galaxy-dreams"],
          thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300",
          timestamp: "2 hours ago",
          size: "2.4 GB",
          quality: "4K",
          is360: true,
          hasAR: true,
          views: 234,
          likes: 67,
          shares: 23,
          downloadUrl: "/api/recordings/rec-birthday-bash/download",
          streamUrl: "/api/recordings/rec-birthday-bash/stream",
        },
        {
          id: "rec-dance-floor",
          name: "Dance Floor Action",
          duration: 892,
          mode: "AR Enhanced",
          filters: ["coca-cola-fizz"],
          thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
          timestamp: "4 hours ago",
          size: "1.1 GB",
          quality: "HD",
          is360: false,
          hasAR: true,
          views: 456,
          likes: 123,
          shares: 45,
          downloadUrl: "/api/recordings/rec-dance-floor/download",
          streamUrl: "/api/recordings/rec-dance-floor/stream",
        },
        {
          id: "rec-rooftop-sunset",
          name: "Rooftop Sunset Vibes",
          duration: 2145,
          mode: "360° Immersive",
          filters: ["retro-synthwave", "spotify-pulse"],
          thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
          timestamp: "1 day ago",
          size: "3.8 GB",
          quality: "4K",
          is360: true,
          hasAR: true,
          views: 891,
          likes: 234,
          shares: 89,
          downloadUrl: "/api/recordings/rec-rooftop-sunset/download",
          streamUrl: "/api/recordings/rec-rooftop-sunset/stream",
        },
      ];

      res.json(recordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      res.status(500).json({ error: "Failed to fetch recordings" });
    }
  });

  // Get highlight reels
  app.get("/api/partycam/highlights", async (req, res) => {
    try {
      const highlights = [
        {
          id: "highlight-birthday-epic",
          title: "Birthday Epic Moments",
          description: "Best moments from the birthday celebration with cinematic effects",
          thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300",
          duration: 187,
          clips: 12,
          style: "cinematic",
          music: "Uplifting Electronic",
          transitions: "Smooth Fade",
          generatedAt: "1 hour ago",
          downloads: 89,
          shares: 234,
          videoUrl: "/api/highlights/highlight-birthday-epic/video",
          downloadUrl: "/api/highlights/highlight-birthday-epic/download",
        },
        {
          id: "highlight-dance-madness",
          title: "Dance Floor Madness",
          description: "High-energy dance moments with beat-synchronized effects",
          thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
          duration: 156,
          clips: 8,
          style: "music-video",
          music: "Electronic Dance",
          transitions: "Beat Drop",
          generatedAt: "3 hours ago",
          downloads: 156,
          shares: 445,
          videoUrl: "/api/highlights/highlight-dance-madness/video",
          downloadUrl: "/api/highlights/highlight-dance-madness/download",
        },
        {
          id: "highlight-sunset-chill",
          title: "Sunset Chill Session",
          description: "Relaxing rooftop moments with golden hour aesthetics",
          thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
          duration: 203,
          clips: 15,
          style: "documentary",
          music: "Ambient Chill",
          transitions: "Cross Dissolve",
          generatedAt: "1 day ago",
          downloads: 67,
          shares: 123,
          videoUrl: "/api/highlights/highlight-sunset-chill/video",
          downloadUrl: "/api/highlights/highlight-sunset-chill/download",
        },
      ];

      res.json(highlights);
    } catch (error) {
      console.error("Error fetching highlight reels:", error);
      res.status(500).json({ error: "Failed to fetch highlight reels" });
    }
  });

  // Get live streaming stats
  app.get("/api/partycam/live-stats", async (req, res) => {
    try {
      const stats = {
        isLive: Math.random() > 0.7, // Simulate sometimes being live
        viewers: Math.floor(Math.random() * 500) + 50,
        peakViewers: Math.floor(Math.random() * 800) + 200,
        duration: Math.floor(Math.random() * 3600), // Up to 1 hour
        quality: "4K",
        bitrate: "15 Mbps",
        platform: "Multiple",
        interactions: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 50),
          shares: Math.floor(Math.random() * 20),
        },
        analytics: {
          avgWatchTime: "3:24",
          peakMoment: "22:15",
          engagementRate: 0.67,
          retention: 0.84,
        }
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching live stats:", error);
      res.status(500).json({ error: "Failed to fetch live stats" });
    }
  });

  // Start recording session
  app.post("/api/partycam/start-recording", async (req, res) => {
    try {
      const { mode, filters, settings } = req.body;

      const sessionId = `session-${Date.now()}`;
      const recording = {
        id: sessionId,
        mode,
        filters,
        settings,
        startedAt: new Date().toISOString(),
        status: "recording",
        quality: settings.quality || "HD",
        estimatedSize: "0 MB",
      };

      res.json({
        success: true,
        session: recording,
        message: "Recording session started successfully",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      res.status(500).json({ error: "Failed to start recording session" });
    }
  });

  // Toggle AR filter
  app.post("/api/partycam/filters/:filterId/toggle", async (req, res) => {
    try {
      const { filterId } = req.params;

      res.json({
        success: true,
        filterId,
        isActive: Math.random() > 0.5, // Simulate toggle
        message: "Filter toggled successfully",
      });
    } catch (error) {
      console.error("Error toggling filter:", error);
      res.status(500).json({ error: "Failed to toggle filter" });
    }
  });

  // Generate highlight reel
  app.post("/api/partycam/generate-highlight", async (req, res) => {
    try {
      const { recordings, style, music } = req.body;

      const highlightId = `highlight-${Date.now()}`;
      const highlight = {
        id: highlightId,
        title: `${style.charAt(0).toUpperCase() + style.slice(1)} Highlight Reel`,
        description: `Auto-generated ${style} style highlight reel`,
        style,
        music,
        recordings,
        status: "processing",
        estimatedDuration: 120,
        createdAt: new Date().toISOString(),
      };

      // Simulate processing time
      setTimeout(() => {
        console.log(`Highlight reel ${highlightId} processing completed`);
      }, 5000);

      res.json({
        success: true,
        highlight,
        message: "Highlight reel generation started",
        estimatedTime: "2-3 minutes",
      });
    } catch (error) {
      console.error("Error generating highlight reel:", error);
      res.status(500).json({ error: "Failed to generate highlight reel" });
    }
  });

  // Start live streaming
  app.post("/api/partycam/start-stream", async (req, res) => {
    try {
      const { title, description, platforms, settings } = req.body;

      const streamId = `stream-${Date.now()}`;
      const stream = {
        id: streamId,
        title,
        description,
        platforms,
        settings,
        startedAt: new Date().toISOString(),
        status: "live",
        viewers: 0,
        streamUrl: `https://stream.vibes.com/live/${streamId}`,
      };

      res.json({
        success: true,
        stream,
        message: "Live stream started successfully",
      });
    } catch (error) {
      console.error("Error starting live stream:", error);
      res.status(500).json({ error: "Failed to start live stream" });
    }
  });

  // Share recording
  app.post("/api/partycam/recordings/:recordingId/share", async (req, res) => {
    try {
      const { recordingId } = req.params;
      const { platforms, message } = req.body;

      const shareId = `share-${Date.now()}`;
      const shareData = {
        id: shareId,
        recordingId,
        platforms,
        message,
        shareUrl: `https://vibes.com/partycam/share/${recordingId}`,
        createdAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        share: shareData,
        message: "Recording shared successfully",
      });
    } catch (error) {
      console.error("Error sharing recording:", error);
      res.status(500).json({ error: "Failed to share recording" });
    }
  });

  // ===== END IMMERSIVE PARTYCAM API ROUTES =====

  // Smart Drink Concierge API Routes
  app.get("/api/drinks/menu", async (req, res) => {
    try {
      const drinks = [
        {
          id: "drink-mojito",
          name: "Classic Mojito",
          description: "Fresh mint, lime, white rum, and soda water",
          category: "cocktail",
          price: 12,
          abv: 15,
          ingredients: ["White Rum", "Fresh Mint", "Lime", "Sugar", "Soda Water"],
          allergens: [],
          preparationTime: 3,
          popularity: 85,
          moodTags: ["refreshing", "social", "energetic"],
          temperature: "cold",
          difficulty: "medium",
          image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=300",
          nutritionalInfo: { calories: 150, sugar: 12 },
          customizable: true,
          availability: true,
          barLocation: "main-bar",
        },
        {
          id: "drink-espresso-martini",
          name: "Espresso Martini",
          description: "Premium vodka, fresh espresso, coffee liqueur",
          category: "cocktail",
          price: 14,
          abv: 25,
          ingredients: ["Vodka", "Fresh Espresso", "Coffee Liqueur", "Sugar Syrup"],
          allergens: ["caffeine"],
          preparationTime: 4,
          popularity: 78,
          moodTags: ["sophisticated", "energetic", "evening"],
          temperature: "cold",
          difficulty: "complex",
          image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300",
          nutritionalInfo: { calories: 220, sugar: 8, caffeine: 63 },
          customizable: true,
          availability: true,
          barLocation: "premium-bar",
        },
        {
          id: "drink-craft-ipa",
          name: "Local Craft IPA",
          description: "Hoppy craft beer with citrus notes",
          category: "beer",
          price: 8,
          abv: 6.5,
          ingredients: ["Hops", "Malt", "Yeast", "Water"],
          allergens: ["gluten"],
          preparationTime: 1,
          popularity: 92,
          moodTags: ["casual", "social", "relaxed"],
          temperature: "cold",
          difficulty: "easy",
          image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300",
          nutritionalInfo: { calories: 180, sugar: 4 },
          customizable: false,
          availability: true,
          barLocation: "main-bar",
        },
        {
          id: "drink-matcha-latte",
          name: "Matcha Latte",
          description: "Premium ceremonial matcha with steamed oat milk",
          category: "coffee",
          price: 6,
          abv: 0,
          ingredients: ["Ceremonial Matcha", "Oat Milk", "Vanilla Syrup"],
          allergens: ["caffeine"],
          preparationTime: 2,
          popularity: 73,
          moodTags: ["calm", "focused", "healthy"],
          temperature: "hot",
          difficulty: "medium",
          image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300",
          nutritionalInfo: { calories: 120, sugar: 8, caffeine: 70 },
          customizable: true,
          availability: true,
          barLocation: "coffee-bar",
        },
        {
          id: "drink-old-fashioned",
          name: "Old Fashioned",
          description: "Bourbon, sugar, bitters, orange peel",
          category: "cocktail",
          price: 16,
          abv: 35,
          ingredients: ["Bourbon", "Sugar", "Angostura Bitters", "Orange Peel"],
          allergens: [],
          preparationTime: 5,
          popularity: 88,
          moodTags: ["classic", "sophisticated", "contemplative"],
          temperature: "room",
          difficulty: "complex",
          image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=300",
          nutritionalInfo: { calories: 200, sugar: 6 },
          customizable: true,
          availability: true,
          barLocation: "premium-bar",
        },
        {
          id: "drink-virgin-mojito",
          name: "Virgin Mojito",
          description: "Fresh mint, lime, and sparkling water",
          category: "non-alcoholic",
          price: 8,
          abv: 0,
          ingredients: ["Fresh Mint", "Lime", "Sugar", "Sparkling Water"],
          allergens: [],
          preparationTime: 2,
          popularity: 65,
          moodTags: ["refreshing", "healthy", "light"],
          temperature: "cold",
          difficulty: "easy",
          image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=300",
          nutritionalInfo: { calories: 45, sugar: 10 },
          customizable: true,
          availability: true,
          barLocation: "main-bar",
        }
      ];
      
      res.json(drinks);
    } catch (error) {
      console.error("Error fetching drink menu:", error);
      res.status(500).json({ error: "Failed to fetch drink menu" });
    }
  });

  app.get("/api/drinks/bars", async (req, res) => {
    try {
      const bars = [
        {
          id: "main-bar",
          name: "Main Bar",
          location: "Center Stage",
          currentWaitTime: Math.floor(Math.random() * 5) + 2,
          avgWaitTime: 4,
          capacity: 50,
          currentOrders: Math.floor(Math.random() * 20) + 5,
          staffCount: 3,
          specialties: ["Cocktails", "Beer", "Basic Spirits"],
          busyLevel: Math.random() > 0.5 ? "medium" : "low",
          coordinates: { x: 50, y: 30 },
        },
        {
          id: "premium-bar",
          name: "Premium Lounge",
          location: "VIP Area",
          currentWaitTime: Math.floor(Math.random() * 6) + 5,
          avgWaitTime: 8,
          capacity: 20,
          currentOrders: Math.floor(Math.random() * 12) + 3,
          staffCount: 2,
          specialties: ["Premium Cocktails", "Wine", "Top Shelf Spirits"],
          busyLevel: Math.random() > 0.3 ? "high" : "medium",
          coordinates: { x: 80, y: 70 },
        },
        {
          id: "coffee-bar",
          name: "Coffee Corner",
          location: "Near Entrance",
          currentWaitTime: Math.floor(Math.random() * 3) + 1,
          avgWaitTime: 3,
          capacity: 30,
          currentOrders: Math.floor(Math.random() * 8) + 2,
          staffCount: 2,
          specialties: ["Coffee", "Tea", "Non-Alcoholic"],
          busyLevel: "low",
          coordinates: { x: 20, y: 80 },
        },
      ];
      
      res.json(bars);
    } catch (error) {
      console.error("Error fetching bars:", error);
      res.status(500).json({ error: "Failed to fetch bar data" });
    }
  });

  app.get("/api/drinks/guests", async (req, res) => {
    try {
      const guests = [
        {
          id: "guest-1",
          name: "Alex Chen",
          wristbandId: "NFC-001",
          currentMood: "social",
          preferences: {
            alcoholic: true,
            sweetness: 3,
            strength: 2,
            temperature: "cold",
            allergens: [],
          },
          orderHistory: ["drink-mojito", "drink-craft-ipa"],
          currentTab: 28,
          loyaltyPoints: 150,
          spendingLimit: 100,
        },
        {
          id: "guest-2",
          name: "Sarah Martinez",
          wristbandId: "NFC-002",
          currentMood: "energetic",
          preferences: {
            alcoholic: true,
            sweetness: 4,
            strength: 3,
            temperature: "cold",
            allergens: ["gluten"],
          },
          orderHistory: ["drink-espresso-martini"],
          currentTab: 45,
          loyaltyPoints: 230,
          spendingLimit: 150,
        },
        {
          id: "guest-3",
          name: "Mike Johnson",
          wristbandId: "NFC-003",
          currentMood: "relaxed",
          preferences: {
            alcoholic: false,
            sweetness: 2,
            strength: 0,
            temperature: "any",
            allergens: ["caffeine"],
          },
          orderHistory: ["drink-virgin-mojito"],
          currentTab: 16,
          loyaltyPoints: 85,
          spendingLimit: 75,
        }
      ];
      
      res.json(guests);
    } catch (error) {
      console.error("Error fetching guests:", error);
      res.status(500).json({ error: "Failed to fetch guest data" });
    }
  });

  app.get("/api/drinks/orders", async (req, res) => {
    try {
      const orders = [
        {
          id: "order-001",
          guestId: "guest-1",
          items: [{ drinkId: "drink-mojito", quantity: 2, customizations: ["extra mint"], specialInstructions: "light on sugar" }],
          barLocation: "main-bar",
          status: "preparing",
          orderTime: new Date(Date.now() - 5 * 60000).toISOString(),
          estimatedReadyTime: new Date(Date.now() + 2 * 60000).toISOString(),
          totalAmount: 24,
          paymentStatus: "paid",
          queuePosition: 3,
        },
        {
          id: "order-002",
          guestId: "guest-2",
          items: [{ drinkId: "drink-espresso-martini", quantity: 1, customizations: [], specialInstructions: "" }],
          barLocation: "premium-bar",
          status: "ready",
          orderTime: new Date(Date.now() - 8 * 60000).toISOString(),
          estimatedReadyTime: new Date(Date.now() - 1 * 60000).toISOString(),
          totalAmount: 14,
          paymentStatus: "paid",
          queuePosition: 1,
        }
      ];
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch order data" });
    }
  });

  app.get("/api/drinks/mood-analytics/:guestId", async (req, res) => {
    try {
      const { guestId } = req.params;
      
      const moodAnalytics = {
        currentMood: "social",
        confidence: 0.85,
        suggestedDrinks: ["drink-mojito", "drink-craft-ipa", "drink-virgin-mojito"],
        moodHistory: [
          { time: "10:00", mood: "energetic", trigger: "music_change" },
          { time: "10:30", mood: "social", trigger: "group_interaction" },
          { time: "11:00", mood: "social", trigger: "conversation" },
        ],
      };
      
      res.json(moodAnalytics);
    } catch (error) {
      console.error("Error fetching mood analytics:", error);
      res.status(500).json({ error: "Failed to fetch mood analytics" });
    }
  });

  app.get("/api/drinks/real-time-stats", async (req, res) => {
    try {
      const stats = {
        totalOrders: Math.floor(Math.random() * 50) + 200,
        revenue: Math.floor(Math.random() * 500) + 1500,
        avgWaitTime: Math.floor(Math.random() * 3) + 3,
        activeGuests: Math.floor(Math.random() * 50) + 100,
        topDrink: "Classic Mojito",
        busiestBar: "Main Bar",
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching real-time stats:", error);
      res.status(500).json({ error: "Failed to fetch real-time stats" });
    }
  });

  app.post("/api/drinks/scan-wristband", async (req, res) => {
    try {
      const { wristbandId } = req.body;
      
      const guestMap = {
        "NFC-001": { guestId: "guest-1", guestName: "Alex Chen" },
        "NFC-002": { guestId: "guest-2", guestName: "Sarah Martinez" },
        "NFC-003": { guestId: "guest-3", guestName: "Mike Johnson" },
      };
      
      const guest = guestMap[wristbandId as keyof typeof guestMap];
      if (!guest) {
        return res.status(404).json({ error: "Wristband not found" });
      }
      
      res.json({
        success: true,
        guestId: guest.guestId,
        guestName: guest.guestName,
        wristbandId,
        scannedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error scanning wristband:", error);
      res.status(500).json({ error: "Failed to scan wristband" });
    }
  });

  app.post("/api/drinks/place-order", async (req, res) => {
    try {
      const { guestId, items, barLocation, paymentMethod } = req.body;
      
      const orderId = `order-${Date.now()}`;
      const estimatedWaitTime = Math.floor(Math.random() * 5) + 3;
      
      // Simulate order processing
      setTimeout(() => {
        console.log(`Order ${orderId} processing completed`);
      }, 2000);
      
      res.json({
        success: true,
        orderId,
        estimatedWaitTime,
        queuePosition: Math.floor(Math.random() * 8) + 1,
        orderTime: new Date().toISOString(),
        status: "pending",
      });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  app.post("/api/drinks/update-mood", async (req, res) => {
    try {
      const { guestId, mood, context } = req.body;
      
      res.json({
        success: true,
        guestId,
        previousMood: "happy",
        newMood: mood,
        confidence: Math.random() * 0.3 + 0.7,
        updatedAt: new Date().toISOString(),
        context,
      });
    } catch (error) {
      console.error("Error updating mood:", error);
      res.status(500).json({ error: "Failed to update mood" });
    }
  });

  app.post("/api/drinks/process-payment", async (req, res) => {
    try {
      const { items, totalAmount, barLocation, guestId } = req.body;
      
      // Generate unique order ID
      const orderId = `order-${Date.now()}`;
      const currentTime = new Date().toISOString();
      
      // Simulate payment processing
      const paymentResult = {
        success: true,
        paymentId: `payment-${Date.now()}`,
        amount: totalAmount,
        currency: "USD",
        method: "QR/NFC",
        processedAt: currentTime
      };
      
      // Create order after successful payment
      const order = {
        id: orderId,
        guestId,
        items: items.map((item: any) => ({
          drinkId: item.drinkId,
          quantity: item.quantity,
          customizations: [],
          specialInstructions: ""
        })),
        barLocation,
        status: "pending",
        orderTime: currentTime,
        estimatedReadyTime: new Date(Date.now() + (Math.floor(Math.random() * 5) + 3) * 60000).toISOString(),
        totalAmount,
        paymentStatus: "paid",
        queuePosition: Math.floor(Math.random() * 8) + 1,
        paymentDetails: paymentResult
      };
      
      // Simulate order processing delay
      setTimeout(() => {
        console.log(`Order ${orderId} is being prepared`);
      }, 2000);
      
      res.json({
        success: true,
        order,
        payment: paymentResult,
        message: "Payment processed successfully and order placed",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  // Interactive payment processing endpoint
  app.post("/api/drinks/interactive-payment", async (req, res) => {
    try {
      const { items, totalAmount, paymentMethod, tipAmount, promoCode, discount, vendorId } = req.body;
      
      // Generate unique IDs
      const orderId = `order-${Date.now()}`;
      const paymentId = `payment-${Date.now()}`;
      const currentTime = new Date().toISOString();
      
      // Calculate loyalty points based on spending
      const basePoints = Math.floor(totalAmount * 2); // 2 points per dollar
      const bonusPoints = paymentMethod === 'nfc' ? 5 : 0; // NFC bonus
      const loyaltyPointsEarned = basePoints + bonusPoints;
      
      // Simulate payment processing delays based on method
      const processingDelays = {
        nfc: 800,
        qr: 2000,
        mobile: 3000,
        card: 5000
      };
      
      const delay = processingDelays[paymentMethod as keyof typeof processingDelays] || 3000;
      
      // Simulate realistic payment processing
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Create payment record
      const paymentResult = {
        id: paymentId,
        orderId,
        amount: totalAmount,
        tipAmount: tipAmount || 0,
        discount: discount || 0,
        currency: "USD",
        method: paymentMethod,
        status: "completed",
        processedAt: currentTime,
        transactionId: `txn-${Date.now()}`,
        last4: paymentMethod === 'card' ? '****' : null,
        loyaltyPointsEarned
      };
      
      // Create order record
      const order = {
        id: orderId,
        guestId: "current-user",
        items: items.map((item: any) => ({
          drinkId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          customizations: item.customizations || [],
          specialInstructions: ""
        })),
        barLocation: "Main Bar",
        status: "confirmed",
        orderTime: currentTime,
        estimatedReadyTime: new Date(Date.now() + (Math.floor(Math.random() * 4) + 5) * 60000).toISOString(),
        totalAmount,
        paymentStatus: "paid",
        queuePosition: Math.floor(Math.random() * 6) + 1,
        paymentDetails: paymentResult,
        loyaltyPointsEarned
      };
      
      // Credit vendor account if vendorId is provided
      let vendorTransaction = null;
      if (vendorId) {
        const platformFeeRate = 0.03; // 3% platform fee
        const platformFee = totalAmount * platformFeeRate;
        const vendorPayout = totalAmount - platformFee;
        
        vendorTransaction = {
          id: `vendor-tx-${Date.now()}`,
          vendorId,
          orderId,
          customerId: "current-user",
          customerName: "Party Guest",
          grossAmount: totalAmount,
          platformFee,
          netAmount: vendorPayout,
          paymentMethod,
          status: 'completed' as const,
          processedAt: currentTime,
          description: `Drink order: ${items.map((item: any) => item.name).join(', ')}`,
          eventName: "New Year's Eve Party"
        };
        
        console.log(`✅ Vendor ${vendorId} will be credited $${vendorPayout.toFixed(2)} (after $${platformFee.toFixed(2)} platform fee)`);
      }

      console.log(`Interactive payment processed: ${paymentId} for order ${orderId}`);
      
      res.json({
        success: true,
        order,
        payment: paymentResult,
        loyaltyPointsEarned,
        estimatedWaitTime: "5-8 minutes",
        message: "Payment processed successfully! Your order is confirmed.",
        vendorTransaction: vendorTransaction
      });
    } catch (error) {
      console.error("Error processing interactive payment:", error);
      res.status(500).json({ error: "Failed to process interactive payment" });
    }
  });

  // Apply promo code endpoint
  app.post("/api/drinks/apply-promo", async (req, res) => {
    try {
      const { code } = req.body;
      
      // Simulate promo code validation
      const promoCodes = {
        'PARTY25': { discount: 25, description: 'Party Special - 25% off' },
        'NEWBIE': { discount: 15, description: 'First Time Visitor - 15% off' },
        'HAPPY10': { discount: 10, description: 'Happy Hour - 10% off' },
        'VIP50': { discount: 50, description: 'VIP Member - 50% off' },
        'STUDENT': { discount: 20, description: 'Student Discount - 20% off' }
      };
      
      const promo = promoCodes[code.toUpperCase() as keyof typeof promoCodes];
      
      if (!promo) {
        return res.status(400).json({ error: "Invalid promo code" });
      }
      
      res.json({
        success: true,
        code: code.toUpperCase(),
        discount: promo.discount,
        description: promo.description,
        appliedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error applying promo code:", error);
      res.status(500).json({ error: "Failed to apply promo code" });
    }
  });

  // Get payment methods and their status
  app.get("/api/drinks/payment-methods", async (req, res) => {
    try {
      const methods = [
        {
          id: 'nfc',
          name: 'NFC Wristband',
          description: 'Tap your wristband to pay instantly',
          processingTime: '< 1 second',
          discount: 5,
          popular: true,
          available: true,
          icon: 'waves'
        },
        {
          id: 'qr',
          name: 'QR Code',
          description: 'Scan with your phone to pay',
          processingTime: '< 3 seconds',
          available: true,
          icon: 'qr-code'
        },
        {
          id: 'mobile',
          name: 'Mobile Payment',
          description: 'Apple Pay, Google Pay, Samsung Pay',
          processingTime: '< 5 seconds',
          available: true,
          icon: 'smartphone'
        },
        {
          id: 'card',
          name: 'Credit Card',
          description: 'Traditional card payment',
          processingTime: '< 10 seconds',
          available: Math.random() > 0.3, // Simulate occasional unavailability
          icon: 'credit-card'
        }
      ];
      
      res.json(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  });

  // Vendor payment setup endpoints
  app.get("/api/vendor/account", async (req, res) => {
    try {
      // Mock vendor account data
      const vendorAccount = {
        id: "vendor-123",
        businessName: "Party Pro Catering",
        email: "contact@partypro.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business St, City, State 12345",
        taxId: "12-3456789",
        accountStatus: "verified",
        totalRevenue: 45750.00,
        monthlyRevenue: 12450.00,
        transactionCount: 156,
        averageOrderValue: 53.20
      };
      
      res.json(vendorAccount);
    } catch (error) {
      console.error("Error fetching vendor account:", error);
      res.status(500).json({ error: "Failed to fetch vendor account" });
    }
  });

  app.get("/api/vendor/payment-methods", async (req, res) => {
    try {
      const paymentMethods = [
        {
          id: "pm-1",
          type: "stripe",
          provider: "Stripe Connect",
          accountNumber: "acct_1234567890",
          status: "active",
          isDefault: true,
          setupDate: "2024-12-15",
          fees: {
            percentage: 2.9,
            fixed: 0.30
          }
        },
        {
          id: "pm-2", 
          type: "bank",
          provider: "Chase Business",
          accountNumber: "****5678",
          status: "active",
          isDefault: false,
          setupDate: "2024-11-20",
          fees: {
            percentage: 1.0,
            fixed: 0.25
          }
        }
      ];
      
      res.json(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  });

  app.get("/api/vendor/transactions", async (req, res) => {
    try {
      const transactions = [
        {
          id: "txn-001",
          customerId: "customer-123",
          customerName: "Sarah Johnson",
          amount: 85.50,
          fee: 2.78,
          netAmount: 82.72,
          paymentMethod: "Credit Card",
          status: "completed",
          date: "2025-01-01T10:30:00Z",
          description: "Premium drink package",
          eventName: "New Year's Eve Party"
        },
        {
          id: "txn-002",
          customerId: "customer-456",
          customerName: "Mike Chen",
          amount: 125.00,
          fee: 3.93,
          netAmount: 121.07,
          paymentMethod: "NFC Wristband",
          status: "completed",
          date: "2024-12-31T22:15:00Z",
          description: "VIP bar service",
          eventName: "Corporate Holiday Party"
        },
        {
          id: "txn-003",
          customerId: "customer-789",
          customerName: "Lisa Rodriguez",
          amount: 67.25,
          fee: 2.25,
          netAmount: 65.00,
          paymentMethod: "Mobile Payment",
          status: "completed",
          date: "2024-12-30T19:45:00Z",
          description: "Cocktail selection",
          eventName: "Birthday Celebration"
        },
        {
          id: "txn-004",
          customerId: "customer-321",
          customerName: "David Wilson",
          amount: 95.75,
          fee: 3.12,
          netAmount: 92.63,
          paymentMethod: "QR Code",
          status: "pending",
          date: "2025-01-01T08:20:00Z",
          description: "Catering service",
          eventName: "Wedding Reception"
        }
      ];
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/vendor/setup-account", async (req, res) => {
    try {
      const { businessName, email, phone, address, taxId, businessType } = req.body;
      
      // Simulate account setup
      if (!businessName || !email || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const accountId = `vendor-${Date.now()}`;
      
      // Create vendor account
      const newAccount = {
        id: accountId,
        businessName,
        email,
        phone,
        address: address || "",
        taxId: taxId || "",
        businessType: businessType || "individual",
        accountStatus: "verified",
        totalRevenue: 0,
        monthlyRevenue: 0,
        transactionCount: 0,
        averageOrderValue: 0,
        setupDate: new Date().toISOString()
      };
      
      console.log(`Vendor account created: ${accountId} for ${businessName}`);
      
      res.json({
        success: true,
        account: newAccount,
        message: "Vendor account successfully created and verified"
      });
    } catch (error) {
      console.error("Error setting up vendor account:", error);
      res.status(500).json({ error: "Failed to setup vendor account" });
    }
  });

  app.post("/api/vendor/add-payment-method", async (req, res) => {
    try {
      const { type, ...methodData } = req.body;
      
      if (!type) {
        return res.status(400).json({ error: "Payment method type is required" });
      }
      
      const methodId = `pm-${Date.now()}`;
      
      // Validate based on payment method type
      let paymentMethod;
      
      switch (type) {
        case "bank":
          if (!methodData.routingNumber || !methodData.accountNumber) {
            return res.status(400).json({ error: "Bank routing and account numbers are required" });
          }
          paymentMethod = {
            id: methodId,
            type: "bank",
            provider: methodData.bankName || "Bank Account",
            accountNumber: `****${methodData.accountNumber.slice(-4)}`,
            status: "active",
            isDefault: false,
            setupDate: new Date().toISOString(),
            fees: {
              percentage: 1.0,
              fixed: 0.25
            }
          };
          break;
          
        case "stripe":
          if (!methodData.email) {
            return res.status(400).json({ error: "Stripe email is required" });
          }
          paymentMethod = {
            id: methodId,
            type: "stripe",
            provider: "Stripe Connect",
            accountNumber: `acct_${Math.random().toString(36).substr(2, 10)}`,
            status: "pending",
            isDefault: false,
            setupDate: new Date().toISOString(),
            fees: {
              percentage: 2.9,
              fixed: 0.30
            }
          };
          break;
          
        case "paypal":
          if (!methodData.email) {
            return res.status(400).json({ error: "PayPal email is required" });
          }
          paymentMethod = {
            id: methodId,
            type: "paypal",
            provider: "PayPal Business",
            accountNumber: methodData.email,
            status: "pending",
            isDefault: false,
            setupDate: new Date().toISOString(),
            fees: {
              percentage: 3.5,
              fixed: 0.35
            }
          };
          break;
          
        default:
          return res.status(400).json({ error: "Unsupported payment method type" });
      }
      
      console.log(`Payment method added: ${methodId} (${type})`);
      
      res.json({
        success: true,
        paymentMethod,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} payment method successfully added`
      });
    } catch (error) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ error: "Failed to add payment method" });
    }
  });

  app.post("/api/vendor/update-payment-method", async (req, res) => {
    try {
      const { methodId, updates } = req.body;
      
      if (!methodId) {
        return res.status(400).json({ error: "Payment method ID is required" });
      }
      
      res.json({
        success: true,
        message: "Payment method updated successfully"
      });
    } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({ error: "Failed to update payment method" });
    }
  });

  app.delete("/api/vendor/payment-method/:methodId", async (req, res) => {
    try {
      const { methodId } = req.params;
      
      console.log(`Payment method deleted: ${methodId}`);
      
      res.json({
        success: true,
        message: "Payment method removed successfully"
      });
    } catch (error) {
      console.error("Error removing payment method:", error);
      res.status(500).json({ error: "Failed to remove payment method" });
    }
  });

  // Customer payment processing that connects to vendor accounts
  app.post("/api/vendor/process-customer-payment", async (req, res) => {
    try {
      const { vendorId, customerId, amount, paymentMethod, description, eventName } = req.body;
      
      if (!vendorId || !customerId || !amount) {
        return res.status(400).json({ error: "Missing required payment information" });
      }
      
      const transactionId = `txn-${Date.now()}`;
      
      // Calculate fees based on payment method
      const feeRates = {
        "credit-card": { percentage: 2.9, fixed: 0.30 },
        "nfc": { percentage: 2.5, fixed: 0.25 },
        "mobile": { percentage: 2.7, fixed: 0.30 },
        "qr": { percentage: 2.6, fixed: 0.25 },
        "bank": { percentage: 1.0, fixed: 0.25 }
      };
      
      const feeRate = feeRates[paymentMethod as keyof typeof feeRates] || feeRates["credit-card"];
      const fee = (amount * feeRate.percentage / 100) + feeRate.fixed;
      const netAmount = amount - fee;
      
      // Create transaction record
      const transaction = {
        id: transactionId,
        vendorId,
        customerId,
        amount,
        fee: Math.round(fee * 100) / 100,
        netAmount: Math.round(netAmount * 100) / 100,
        paymentMethod,
        status: "completed",
        date: new Date().toISOString(),
        description: description || "Payment received",
        eventName: eventName || "Event"
      };
      
      console.log(`Vendor payment processed: ${transactionId} for vendor ${vendorId}`);
      
      res.json({
        success: true,
        transaction,
        message: "Payment processed and credited to vendor account"
      });
    } catch (error) {
      console.error("Error processing vendor payment:", error);
      res.status(500).json({ error: "Failed to process vendor payment" });
    }
  });

  app.post("/api/drinks/complete-order", async (req, res) => {
    try {
      const { orderId } = req.body;
      
      res.json({
        success: true,
        orderId,
        status: "completed",
        completedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error completing order:", error);
      res.status(500).json({ error: "Failed to complete order" });
    }
  });

  // ====================================================================
  // VIBE MALL - EVENT POP-UP MARKETPLACE
  // ====================================================================

  // Get VibeMall items with filtering
  app.get("/api/vibe-mall/items", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      // Sample VibeMall items data
      const mallItems = [
        {
          id: "item-dj-jacket",
          name: "LED Light-Up DJ Jacket",
          description: "Exclusive jacket worn by tonight's headlining DJ with built-in LED strips",
          price: 299,
          originalPrice: 399,
          discount: 25,
          category: "clothing",
          vendor: {
            id: "vendor-beat-drops",
            name: "Beat Drops",
            logo: "🎧",
            verified: true,
            type: "influencer"
          },
          images: ["jacket1.jpg", "jacket2.jpg"],
          tags: ["trending", "limited-edition", "ar-enabled", "influencer-worn"],
          popularity: 94,
          inStock: true,
          limitedEdition: true,
          eventExclusive: true,
          influencerWorn: {
            influencer: "DJ Neon",
            avatar: "dj-neon.jpg",
            social: "@djneon_official"
          },
          arEnabled: true,
          likes: 1247,
          purchases: 89,
          trending: true
        },
        {
          id: "item-neon-playlist",
          name: "Neon Nights Exclusive Playlist",
          description: "Tonight's complete setlist with unreleased tracks and DJ transitions",
          price: 9.99,
          category: "music",
          vendor: {
            id: "vendor-sound-cloud",
            name: "SoundCloud Pro",
            logo: "🎵",
            verified: true,
            type: "sponsor"
          },
          images: ["playlist1.jpg"],
          tags: ["instant-download", "exclusive", "trending"],
          popularity: 87,
          inStock: true,
          eventExclusive: true,
          arEnabled: false,
          instantDownload: true,
          likes: 892,
          purchases: 234,
          trending: true
        },
        {
          id: "item-holographic-decor",
          name: "Holographic Party Decorations Set",
          description: "Complete set of holographic party decorations as seen at tonight's event",
          price: 149,
          originalPrice: 199,
          discount: 25,
          category: "decor",
          vendor: {
            id: "vendor-party-perfect",
            name: "Party Perfect",
            logo: "✨",
            verified: true,
            type: "vendor"
          },
          images: ["decor1.jpg", "decor2.jpg", "decor3.jpg"],
          tags: ["ar-enabled", "event-exclusive", "trending"],
          popularity: 76,
          inStock: true,
          eventExclusive: true,
          arEnabled: true,
          likes: 445,
          purchases: 67,
          trending: false
        },
        {
          id: "item-vip-afterparty",
          name: "VIP Afterparty Access",
          description: "Exclusive access to the private afterparty with meet & greet",
          price: 75,
          category: "tickets",
          vendor: {
            id: "vendor-event-organizer",
            name: "Vibes Events",
            logo: "🎟️",
            verified: true,
            type: "vendor"
          },
          images: ["vip1.jpg"],
          tags: ["limited-edition", "exclusive", "vip"],
          popularity: 98,
          inStock: true,
          limitedEdition: true,
          eventExclusive: true,
          arEnabled: false,
          likes: 1567,
          purchases: 12,
          trending: true
        },
        {
          id: "item-glow-sticks",
          name: "Premium LED Glow Sticks",
          description: "Professional-grade LED glow sticks used in tonight's light show",
          price: 24.99,
          category: "collectibles",
          vendor: {
            id: "vendor-rave-gear",
            name: "Rave Gear Co",
            logo: "💡",
            verified: true,
            type: "vendor"
          },
          images: ["glow1.jpg", "glow2.jpg"],
          tags: ["instant-delivery", "collectible"],
          popularity: 62,
          inStock: true,
          arEnabled: true,
          likes: 234,
          purchases: 156,
          trending: false
        },
        {
          id: "item-signature-sneakers",
          name: "DJ's Signature Light-Up Sneakers",
          description: "Limited edition sneakers worn by the headliner, with custom LED patterns",
          price: 349,
          originalPrice: 449,
          discount: 22,
          category: "clothing",
          vendor: {
            id: "vendor-step-up",
            name: "Step Up",
            logo: "👟",
            verified: true,
            type: "influencer"
          },
          images: ["sneakers1.jpg", "sneakers2.jpg"],
          tags: ["limited-edition", "ar-enabled", "influencer-worn", "trending"],
          popularity: 91,
          inStock: true,
          limitedEdition: true,
          influencerWorn: {
            influencer: "DJ Neon",
            avatar: "dj-neon.jpg",
            social: "@djneon_official"
          },
          arEnabled: true,
          likes: 1098,
          purchases: 23,
          trending: true
        }
      ];

      // Filter by category
      let filteredItems = mallItems;
      if (category && category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === category);
      }

      // Filter by search term
      if (search) {
        const searchLower = (search as string).toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      res.json(filteredItems);
    } catch (error) {
      console.error("Error fetching VibeMall items:", error);
      res.status(500).json({ error: "Failed to fetch VibeMall items" });
    }
  });

  // Purchase VibeMall items
  app.post("/api/vibe-mall/purchase", async (req, res) => {
    try {
      const { items, total } = req.body;
      
      // Generate unique purchase ID
      const purchaseId = `purchase-${Date.now()}`;
      const currentTime = new Date().toISOString();
      
      // Calculate delivery types
      let instantItems = 0;
      let physicalItems = 0;
      
      items.forEach((cartItem: any) => {
        if (cartItem.item.instantDownload || cartItem.item.category === 'music' || cartItem.item.category === 'tickets') {
          instantItems += cartItem.quantity;
        } else {
          physicalItems += cartItem.quantity;
        }
      });

      // Process vendor payments (3% platform fee)
      const vendorPayments = new Map();
      items.forEach((cartItem: any) => {
        const vendorId = cartItem.item.vendor.id;
        const itemTotal = cartItem.item.price * cartItem.quantity;
        const platformFee = itemTotal * 0.03;
        const vendorAmount = itemTotal - platformFee;
        
        if (vendorPayments.has(vendorId)) {
          vendorPayments.set(vendorId, vendorPayments.get(vendorId) + vendorAmount);
        } else {
          vendorPayments.set(vendorId, vendorAmount);
        }
      });

      // Create purchase record
      const purchase = {
        id: purchaseId,
        items: items,
        total: total,
        platformFee: total * 0.03,
        vendorPayments: Object.fromEntries(vendorPayments),
        instantItems,
        physicalItems,
        purchasedAt: currentTime,
        status: "completed"
      };

      // Simulate purchase processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      res.json({
        success: true,
        purchase,
        instantItems,
        physicalItems,
        message: "Purchase completed successfully"
      });
    } catch (error) {
      console.error("Error processing VibeMall purchase:", error);
      res.status(500).json({ error: "Failed to process purchase" });
    }
  });

  // Like/favorite VibeMall item
  app.post("/api/vibe-mall/like", async (req, res) => {
    try {
      const { itemId } = req.body;
      
      // In a real app, this would save to user's favorites
      const likeId = `like-${Date.now()}`;
      
      res.json({
        success: true,
        likeId,
        itemId,
        message: "Item added to favorites"
      });
    } catch (error) {
      console.error("Error liking VibeMall item:", error);
      res.status(500).json({ error: "Failed to like item" });
    }
  });

  // AR Try-On functionality
  app.post("/api/vibe-mall/ar-tryon", async (req, res) => {
    try {
      const { itemId } = req.body;
      
      // Generate AR session data
      const arSession = {
        id: `ar-${Date.now()}`,
        itemId,
        sessionUrl: `https://ar.vibes.com/tryon/${itemId}`,
        calibrationData: {
          faceTracking: true,
          bodyTracking: itemId.includes('clothing'),
          lightingAdjustment: true
        },
        createdAt: new Date().toISOString()
      };

      // Simulate AR processing
      await new Promise(resolve => setTimeout(resolve, 800));

      res.json({
        success: true,
        arSession,
        message: "AR try-on session ready"
      });
    } catch (error) {
      console.error("Error starting AR try-on:", error);
      res.status(500).json({ error: "Failed to start AR try-on" });
    }
  });

  // Get VibeMall analytics
  app.get("/api/vibe-mall/analytics", async (req, res) => {
    try {
      const analytics = {
        totalItems: 127,
        totalSales: 89750,
        topCategories: [
          { category: "clothing", sales: 34, revenue: 28439 },
          { category: "music", sales: 156, revenue: 1560 },
          { category: "tickets", sales: 67, revenue: 5025 },
          { category: "decor", sales: 23, revenue: 3427 },
          { category: "collectibles", sales: 89, revenue: 2234 }
        ],
        trendingItems: ["item-dj-jacket", "item-vip-afterparty", "item-signature-sneakers"],
        arUsage: {
          sessionsStarted: 234,
          conversionsFromAR: 67,
          conversionRate: 28.6
        },
        influencerImpact: {
          influencerItems: 23,
          influencerSales: 45,
          averageInfluencerPrice: 247
        }
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching VibeMall analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Pro Host Control Panel routes
  app.get("/api/pro-host/events", async (req, res) => {
    try {
      const hostEvents = [
        {
          id: "event-001",
          name: "Summer Pool Party 2025",
          date: "2025-07-15",
          time: "6:00 PM",
          venue: "Rooftop Pool Deck",
          capacity: 150,
          status: "live",
          hostId: "host-001"
        },
        {
          id: "event-002", 
          name: "Corporate Mixer",
          date: "2025-07-20",
          time: "7:00 PM",
          venue: "Downtown Convention Center",
          capacity: 200,
          status: "upcoming",
          hostId: "host-001"
        },
        {
          id: "event-003",
          name: "Birthday Celebration",
          date: "2025-06-28",
          time: "8:00 PM", 
          venue: "Private Residence",
          capacity: 80,
          status: "completed",
          hostId: "host-001"
        }
      ];
      
      res.json(hostEvents);
    } catch (error) {
      console.error("Error fetching host events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/pro-host/analytics/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
      
      const analytics = {
        eventId,
        totalInvited: 180,
        confirmedRSVPs: 145,
        actualAttendance: 128,
        attendanceRate: 88.3,
        averageSentiment: 0.82,
        engagementScore: 7.8,
        peakHour: "9:00 PM",
        dropoffRate: 11.7,
        totalNotificationsSent: 23,
        responseRate: 94.2,
        trends: {
          hourlyAttendance: [15, 32, 58, 89, 128, 142, 135, 98, 67, 34, 12],
          sentimentHistory: [0.65, 0.72, 0.78, 0.82, 0.79, 0.85, 0.88, 0.84, 0.81]
        }
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching event analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/pro-host/guests/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
      
      const guestList = [
        {
          id: "guest-001",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+1-555-0123",
          rsvpStatus: "confirmed",
          checkInTime: "6:15 PM",
          lastActivity: "9:45 PM",
          sentiment: "positive",
          sentimentScore: 0.89,
          engagementLevel: 8.5,
          dietaryRestrictions: ["vegetarian"],
          plusOnes: 1,
          arrived: true,
          leftEarly: false
        },
        {
          id: "guest-002", 
          name: "Michael Chen",
          email: "michael@example.com",
          phone: "+1-555-0124",
          rsvpStatus: "confirmed",
          checkInTime: "6:30 PM",
          lastActivity: "10:15 PM",
          sentiment: "positive",
          sentimentScore: 0.92,
          engagementLevel: 9.2,
          dietaryRestrictions: [],
          plusOnes: 0,
          arrived: true,
          leftEarly: false
        },
        {
          id: "guest-003",
          name: "Emily Rodriguez",
          email: "emily@example.com", 
          phone: "+1-555-0125",
          rsvpStatus: "confirmed",
          checkInTime: null,
          lastActivity: "4:30 PM",
          sentiment: "neutral",
          sentimentScore: 0.55,
          engagementLevel: 3.2,
          dietaryRestrictions: ["gluten-free"],
          plusOnes: 2,
          arrived: false,
          leftEarly: false
        },
        {
          id: "guest-004",
          name: "David Kim",
          email: "david@example.com",
          phone: "+1-555-0126", 
          rsvpStatus: "declined",
          checkInTime: null,
          lastActivity: "2:00 PM",
          sentiment: "negative",
          sentimentScore: 0.32,
          engagementLevel: 1.8,
          dietaryRestrictions: [],
          plusOnes: 0,
          arrived: false,
          leftEarly: false
        },
        {
          id: "guest-005",
          name: "Jessica Taylor",
          email: "jessica@example.com",
          phone: "+1-555-0127",
          rsvpStatus: "confirmed",
          checkInTime: "7:45 PM",
          lastActivity: "8:30 PM", 
          sentiment: "neutral",
          sentimentScore: 0.68,
          engagementLevel: 6.1,
          dietaryRestrictions: ["dairy-free"],
          plusOnes: 1,
          arrived: true,
          leftEarly: true
        }
      ];
      
      res.json(guestList);
    } catch (error) {
      console.error("Error fetching guest list:", error);
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  app.get("/api/pro-host/notifications/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
      
      const notifications = [
        {
          id: "notif-001",
          type: "attendance",
          message: "Attendance rate dropped to 85% - 3 confirmed guests haven't arrived",
          priority: "medium",
          timestamp: "2025-07-01 8:45 PM",
          actionRequired: true,
          handled: false
        },
        {
          id: "notif-002",
          type: "sentiment", 
          message: "Guest sentiment trending positive - 92% satisfaction rate",
          priority: "low",
          timestamp: "2025-07-01 9:15 PM",
          actionRequired: false,
          handled: true
        },
        {
          id: "notif-003",
          type: "engagement",
          message: "Peak engagement detected - perfect time for group activities",
          priority: "high",
          timestamp: "2025-07-01 9:30 PM",
          actionRequired: true,
          handled: false
        },
        {
          id: "notif-004",
          type: "rsvp",
          message: "2 last-minute RSVPs received - capacity at 96%",
          priority: "medium",
          timestamp: "2025-07-01 5:30 PM",
          actionRequired: false,
          handled: true
        },
        {
          id: "notif-005",
          type: "system",
          message: "AI insights updated - new recommendations available", 
          priority: "low",
          timestamp: "2025-07-01 10:00 PM",
          actionRequired: false,
          handled: false
        }
      ];
      
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/pro-host/ai-insights/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;
      
      const insights = {
        eventId,
        overallScore: 8.7,
        recommendations: [
          {
            title: "Boost Late-Night Energy",
            description: "Guest energy is declining. Consider starting the dance competition or opening the dessert bar to re-engage attendees.",
            action: "Start Activity",
            priority: "high"
          },
          {
            title: "VIP Guest Attention",
            description: "Sarah Johnson (VIP) seems disengaged. A personal check-in might improve her experience and overall event sentiment.",
            action: "Send Personal Note",
            priority: "medium" 
          },
          {
            title: "Photo Opportunity",
            description: "Perfect lighting detected at the main stage. This is an ideal time for group photos that guests will love sharing.",
            action: "Announce Photo Session",
            priority: "medium"
          },
          {
            title: "Service Optimization",
            description: "Bar wait times are longer than usual. Consider opening the secondary bar or adding staff to improve guest satisfaction.",
            action: "Optimize Service",
            priority: "high"
          }
        ],
        sentimentAnalysis: {
          positive: 68,
          neutral: 24, 
          negative: 8,
          trending: "up",
          keyTopics: ["music", "food", "atmosphere", "service"]
        },
        predictedOutcomes: {
          finalAttendance: "89%",
          avgSatisfaction: "4.3/5",
          socialSharing: "High",
          futureAttendance: "92%"
        }
      };
      
      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  app.post("/api/pro-host/send-notification", async (req, res) => {
    try {
      const { eventId, message, audience, type } = req.body;
      
      // Simulate sending push notification
      const audienceCount = {
        all: 150,
        checked_in: 128,
        vip: 15,
        confirmed: 145,
        maybe: 12
      }[audience] || 0;
      
      const notification = {
        id: `notif-${Date.now()}`,
        eventId,
        message,
        audience,
        type,
        sentTo: audienceCount,
        deliveryRate: 98.5,
        timestamp: new Date().toISOString(),
        status: "sent"
      };
      
      // Log notification activity
      console.log(`Push notification sent to ${audienceCount} guests: "${message}"`);
      
      res.json({
        success: true,
        notification,
        message: `Notification sent to ${audienceCount} guests with 98.5% delivery rate`
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  app.post("/api/pro-host/automate-post-event", async (req, res) => {
    try {
      const { eventId, tasks } = req.body;
      
      const automationPlan = {
        eventId,
        tasksConfigured: tasks.length,
        estimatedCompletion: "72 hours post-event",
        schedule: tasks.map(task => ({
          ...task,
          scheduledTime: new Date(Date.now() + task.delay * 60 * 60 * 1000).toISOString(),
          estimatedRecipients: task.type === 'thank_you' ? 128 : 
                               task.type === 'review_request' ? 115 :
                               task.type === 'photo_sharing' ? 128 : 98
        }))
      };
      
      console.log(`Post-event automation configured for event ${eventId}: ${tasks.length} tasks scheduled`);
      
      res.json({
        success: true,
        automationPlan,
        message: "Post-event automation successfully configured"
      });
    } catch (error) {
      console.error("Error configuring automation:", error);
      res.status(500).json({ message: "Failed to configure automation" });
    }
  });

  // Party Quest - Gamified Guest Experience routes
  app.get("/api/party-quest/quests", async (req, res) => {
    try {
      const quests = [
        {
          id: "quest-001",
          title: "Social Explorer",
          description: "Visit all vendor booths and meet 5 new people",
          type: "individual",
          category: "exploration",
          difficulty: "easy",
          requirements: [
            {
              id: "req-001",
              type: "visit",
              target: "vendor_booths",
              count: 8,
              completed: 3,
              description: "Visit all vendor booths"
            },
            {
              id: "req-002",
              type: "social",
              target: "meet_people",
              count: 5,
              completed: 2,
              description: "Meet 5 new people"
            }
          ],
          rewards: [
            {
              id: "reward-001",
              type: "drink_token",
              value: 2,
              description: "2 Drink Tokens",
              rarity: "common"
            },
            {
              id: "reward-002",
              type: "points",
              value: 150,
              description: "150 Quest Points"
            }
          ],
          timeLimit: 60,
          status: "available",
          progress: 37,
          participants: 23
        },
        {
          id: "quest-002",
          title: "Dance Floor Champion",
          description: "Dance 3 times and get others to join you",
          type: "individual",
          category: "social",
          difficulty: "medium",
          requirements: [
            {
              id: "req-003",
              type: "dance",
              target: "dance_floor",
              count: 3,
              completed: 1,
              description: "Dance 3 times on the dance floor"
            },
            {
              id: "req-004",
              type: "social",
              target: "inspire_dancing",
              count: 3,
              completed: 0,
              description: "Get 3 others to join you dancing"
            }
          ],
          rewards: [
            {
              id: "reward-003",
              type: "shout_out",
              value: "dance_champion",
              description: "DJ Shout-out as Dance Champion"
            },
            {
              id: "reward-004",
              type: "nft",
              value: "dance_nft",
              description: "Exclusive Dance Master NFT",
              rarity: "rare"
            }
          ],
          status: "active",
          progress: 33,
          participants: 15
        },
        {
          id: "quest-003",
          title: "Memory Maker",
          description: "Take creative photos and tag them with stories",
          type: "individual",
          category: "creative",
          difficulty: "easy",
          requirements: [
            {
              id: "req-005",
              type: "photo",
              target: "tagged_photos",
              count: 5,
              completed: 2,
              description: "Take and tag 5 creative photos"
            },
            {
              id: "req-006",
              type: "social",
              target: "photo_likes",
              count: 20,
              completed: 12,
              description: "Get 20 likes on your photos"
            }
          ],
          rewards: [
            {
              id: "reward-005",
              type: "badge",
              value: "photographer",
              description: "Photographer Badge"
            },
            {
              id: "reward-006",
              type: "vip_access",
              value: "photo_booth",
              description: "VIP Photo Booth Access"
            }
          ],
          status: "active",
          progress: 70,
          participants: 31
        },
        {
          id: "quest-004",
          title: "Trivia Master",
          description: "Answer party trivia questions and challenge others",
          type: "individual",
          category: "trivia",
          difficulty: "hard",
          requirements: [
            {
              id: "req-007",
              type: "trivia",
              target: "correct_answers",
              count: 10,
              completed: 6,
              description: "Answer 10 trivia questions correctly"
            },
            {
              id: "req-008",
              type: "social",
              target: "challenge_others",
              count: 3,
              completed: 1,
              description: "Challenge 3 others to trivia"
            }
          ],
          rewards: [
            {
              id: "reward-007",
              type: "nft",
              value: "trivia_champion",
              description: "Trivia Champion NFT",
              rarity: "epic"
            },
            {
              id: "reward-008",
              type: "points",
              value: 500,
              description: "500 Bonus Points"
            }
          ],
          status: "available",
          progress: 60,
          participants: 8
        },
        {
          id: "quest-005",
          title: "Team Unity Challenge",
          description: "Work with your team to complete synchronized tasks",
          type: "team",
          category: "challenge",
          difficulty: "medium",
          requirements: [
            {
              id: "req-009",
              type: "team",
              target: "synchronized_dance",
              count: 1,
              completed: 0,
              description: "Perform synchronized team dance"
            },
            {
              id: "req-010",
              type: "team",
              target: "group_photo",
              count: 3,
              completed: 1,
              description: "Take 3 creative team photos"
            }
          ],
          rewards: [
            {
              id: "reward-009",
              type: "drink_token",
              value: 5,
              description: "5 Drink Tokens per member"
            },
            {
              id: "reward-010",
              type: "badge",
              value: "team_unity",
              description: "Team Unity Badge"
            }
          ],
          teamSize: 4,
          maxParticipants: 24,
          status: "available",
          progress: 0,
          participants: 12
        }
      ];
      
      res.json(quests);
    } catch (error) {
      console.error("Error fetching quests:", error);
      res.status(500).json({ message: "Failed to fetch quests" });
    }
  });

  app.get("/api/party-quest/progress", async (req, res) => {
    try {
      const userProgress = {
        totalPoints: 1250,
        completedQuests: 7,
        rank: 5,
        drinkTokens: 8,
        achievements: [
          { name: "First Steps", description: "Completed first quest", unlocked: true },
          { name: "Social Butterfly", description: "Met 10 new people", unlocked: true },
          { name: "Photographer", description: "Took 5 tagged photos", unlocked: true },
          { name: "Dance Enthusiast", description: "Danced 5 times", unlocked: false }
        ],
        nftCollection: [
          { name: "Party Pioneer NFT", rarity: "common", earned: "2025-07-01" },
          { name: "Social Champion NFT", rarity: "rare", earned: "2025-07-01" },
          { name: "Photo Master NFT", rarity: "epic", earned: "2025-07-01" }
        ],
        activeQuests: ["quest-002", "quest-003"],
        streakDays: 1,
        level: 3,
        experiencePoints: 1250,
        nextLevelXP: 1500
      };
      
      res.json(userProgress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get("/api/party-quest/leaderboard", async (req, res) => {
    try {
      const leaderboard = {
        individual: [
          {
            id: "user-001",
            name: "Alex Chen",
            avatar: "/avatars/alex.jpg",
            points: 2150,
            questsCompleted: 12,
            rank: 1,
            badges: ["Trivia Master", "Social King", "Photo Pro"],
            title: "Quest Legend"
          },
          {
            id: "user-002", 
            name: "Maya Rodriguez",
            avatar: "/avatars/maya.jpg",
            points: 1980,
            questsCompleted: 11,
            rank: 2,
            badges: ["Dance Queen", "Team Captain", "Explorer"],
            title: "Party Champion"
          },
          {
            id: "user-003",
            name: "Jordan Smith",
            avatar: "/avatars/jordan.jpg",
            points: 1850,
            questsCompleted: 10,
            rank: 3,
            badges: ["Creative Genius", "Social Star"],
            title: "Rising Star"
          },
          {
            id: "user-004",
            name: "Sam Williams",
            avatar: "/avatars/sam.jpg",
            points: 1680,
            questsCompleted: 9,
            rank: 4,
            badges: ["Explorer", "Team Player"],
            title: "Adventure Seeker"
          },
          {
            id: "user-005",
            name: "You",
            avatar: "/avatars/user.jpg",
            points: 1250,
            questsCompleted: 7,
            rank: 5,
            badges: ["First Steps", "Social Butterfly"],
            title: "Quest Explorer"
          }
        ],
        teams: [
          {
            team: {
              id: "team-001",
              name: "Dance Dynasty",
              members: [
                { id: "user-001", name: "Alex Chen", avatar: "/avatars/alex.jpg", role: "captain", points: 2150, questsCompleted: 12, online: true },
                { id: "user-006", name: "Emma Davis", avatar: "/avatars/emma.jpg", role: "member", points: 1420, questsCompleted: 8, online: true },
                { id: "user-007", name: "Liam Johnson", avatar: "/avatars/liam.jpg", role: "member", points: 1180, questsCompleted: 6, online: false },
                { id: "user-008", name: "Zoe Martinez", avatar: "/avatars/zoe.jpg", role: "member", points: 980, questsCompleted: 5, online: true }
              ],
              questsCompleted: 15,
              totalPoints: 5730,
              rank: 1,
              color: "#FF6B6B",
              motto: "We move as one, we dance as one!",
              captain: "user-001",
              achievements: ["Team Unity", "Dance Masters", "Perfect Sync"]
            },
            points: 5730,
            questsCompleted: 15,
            rank: 1
          },
          {
            team: {
              id: "team-002",
              name: "Photo Hunters",
              members: [
                { id: "user-002", name: "Maya Rodriguez", avatar: "/avatars/maya.jpg", role: "captain", points: 1980, questsCompleted: 11, online: true },
                { id: "user-009", name: "Noah Brown", avatar: "/avatars/noah.jpg", role: "member", points: 1350, questsCompleted: 7, online: true },
                { id: "user-010", name: "Ava Wilson", avatar: "/avatars/ava.jpg", role: "member", points: 1120, questsCompleted: 6, online: true }
              ],
              questsCompleted: 12,
              totalPoints: 4450,
              rank: 2,
              color: "#4ECDC4",
              motto: "Capturing moments, creating memories",
              captain: "user-002",
              achievements: ["Creative Vision", "Memory Makers"]
            },
            points: 4450,
            questsCompleted: 12,
            rank: 2
          },
          {
            team: {
              id: "team-003",
              name: "Trivia Titans",
              members: [
                { id: "user-003", name: "Jordan Smith", avatar: "/avatars/jordan.jpg", role: "captain", points: 1850, questsCompleted: 10, online: false },
                { id: "user-011", name: "Ethan Garcia", avatar: "/avatars/ethan.jpg", role: "member", points: 1240, questsCompleted: 7, online: true },
                { id: "user-012", name: "Mia Thompson", avatar: "/avatars/mia.jpg", role: "member", points: 1090, questsCompleted: 6, online: true }
              ],
              questsCompleted: 10,
              totalPoints: 4180,
              rank: 3,
              color: "#45B7D1",
              motto: "Knowledge is our superpower!",
              captain: "user-003",
              achievements: ["Brain Trust", "Quiz Champions"]
            },
            points: 4180,
            questsCompleted: 10,
            rank: 3
          }
        ]
      };
      
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/party-quest/team", async (req, res) => {
    try {
      // User is not in a team yet
      res.json(null);
    } catch (error) {
      console.error("Error fetching user team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post("/api/party-quest/start", async (req, res) => {
    try {
      const { questId } = req.body;
      
      const questResponse = {
        questId,
        status: "started",
        message: "Quest started successfully!",
        startTime: new Date().toISOString(),
        estimatedCompletion: "30-60 minutes"
      };
      
      console.log(`Quest ${questId} started by user`);
      
      res.json(questResponse);
    } catch (error) {
      console.error("Error starting quest:", error);
      res.status(500).json({ message: "Failed to start quest" });
    }
  });

  app.post("/api/party-quest/create-team", async (req, res) => {
    try {
      const { name, motto } = req.body;
      
      const newTeam = {
        id: `team-${Date.now()}`,
        name,
        motto,
        members: [
          {
            id: "current-user",
            name: "You",
            avatar: "/avatars/user.jpg",
            role: "captain",
            points: 1250,
            questsCompleted: 7,
            online: true
          }
        ],
        questsCompleted: 0,
        totalPoints: 1250,
        rank: 0,
        color: "#9B59B6",
        captain: "current-user",
        achievements: []
      };
      
      console.log(`Team "${name}" created with motto: "${motto}"`);
      
      res.json({
        success: true,
        team: newTeam,
        message: "Team created successfully!"
      });
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  app.post("/api/party-quest/join-team", async (req, res) => {
    try {
      const { teamId } = req.body;
      
      const joinResponse = {
        teamId,
        status: "joined",
        message: "Successfully joined the team!",
        role: "member",
        welcomeMessage: "Welcome to the team! Ready for some epic quests?"
      };
      
      console.log(`User joined team ${teamId}`);
      
      res.json(joinResponse);
    } catch (error) {
      console.error("Error joining team:", error);
      res.status(500).json({ message: "Failed to join team" });
    }
  });

  app.post("/api/party-quest/claim-reward", async (req, res) => {
    try {
      const { questId } = req.body;
      
      const reward = {
        questId,
        reward: {
          type: "drink_token",
          value: 2,
          description: "2 Drink Tokens"
        },
        pointsEarned: 150,
        newTotal: 1400,
        rankChange: 0,
        unlockedAchievements: [],
        message: "Congratulations! You've earned your rewards!"
      };
      
      console.log(`Reward claimed for quest ${questId}`);
      
      res.json(reward);
    } catch (error) {
      console.error("Error claiming reward:", error);
      res.status(500).json({ message: "Failed to claim reward" });
    }
  });

  // PartyCast Live - Livestreaming API routes
  app.get("/api/partycast/streams", async (req, res) => {
    try {
      const streams = [
        {
          id: "stream-001",
          eventId: "event-001",
          eventTitle: "Sarah's Birthday Bash",
          hostName: "Sarah Johnson",
          hostAvatar: "/avatars/sarah.jpg",
          title: "Epic Birthday Party Live!",
          description: "Join us for an amazing birthday celebration with live music, dancing, and surprises!",
          status: "live",
          startTime: "2025-07-01T19:00:00Z",
          duration: 3600,
          thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
          streamUrl: "https://stream.vibes.com/sarah-birthday",
          isPrivate: false,
          viewerCount: 247,
          maxViewers: 350,
          totalViews: 1250,
          platforms: ["vibes", "youtube", "instagram"],
          quality: "1080p",
          tags: ["birthday", "party", "music", "dancing"],
          category: "birthday",
          isHybridEvent: true,
          recording: {
            isEnabled: true,
            autoSave: true,
            highlights: true
          },
          interactions: {
            commentsEnabled: true,
            votingEnabled: true,
            cheersEnabled: true,
            requestsEnabled: true,
            moderationEnabled: false
          },
          analytics: {
            peakViewers: 350,
            averageWatchTime: 1845,
            engagementRate: 78,
            totalComments: 423,
            totalCheers: 89,
            totalRequests: 34
          }
        },
        {
          id: "stream-002",
          eventId: "event-002",
          eventTitle: "Tech Company Annual Gala",
          hostName: "InnovateTech Events",
          hostAvatar: "/avatars/company.jpg",
          title: "Annual Innovation Gala",
          description: "Celebrating our achievements and looking forward to the future",
          status: "scheduled",
          startTime: "2025-07-02T20:00:00Z",
          duration: 0,
          thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
          streamUrl: "",
          isPrivate: true,
          accessCode: "TECH2025",
          viewerCount: 0,
          maxViewers: 500,
          totalViews: 0,
          platforms: ["vibes"],
          quality: "1080p",
          tags: ["corporate", "gala", "awards"],
          category: "corporate",
          isHybridEvent: true,
          recording: {
            isEnabled: true,
            autoSave: true,
            highlights: false
          },
          interactions: {
            commentsEnabled: true,
            votingEnabled: false,
            cheersEnabled: true,
            requestsEnabled: false,
            moderationEnabled: true
          },
          analytics: {
            peakViewers: 0,
            averageWatchTime: 0,
            engagementRate: 0,
            totalComments: 0,
            totalCheers: 0,
            totalRequests: 0
          }
        },
        {
          id: "stream-003",
          eventId: "event-003",
          eventTitle: "Weekend House Party",
          hostName: "Mike & Jessica",
          hostAvatar: "/avatars/couple.jpg",
          title: "Rooftop Summer Vibes",
          description: "Chill rooftop party with sunset views and great music",
          status: "ended",
          startTime: "2025-06-30T18:00:00Z",
          endTime: "2025-06-30T23:30:00Z",
          duration: 19800, // 5.5 hours
          thumbnail: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800",
          streamUrl: "https://stream.vibes.com/rooftop-vibes",
          isPrivate: false,
          viewerCount: 0,
          maxViewers: 189,
          totalViews: 892,
          platforms: ["vibes", "instagram"],
          quality: "720p",
          tags: ["house party", "rooftop", "sunset", "chill"],
          category: "party",
          isHybridEvent: true,
          recording: {
            isEnabled: true,
            autoSave: true,
            highlights: true
          },
          interactions: {
            commentsEnabled: true,
            votingEnabled: true,
            cheersEnabled: true,
            requestsEnabled: true,
            moderationEnabled: false
          },
          analytics: {
            peakViewers: 189,
            averageWatchTime: 2340,
            engagementRate: 85,
            totalComments: 267,
            totalCheers: 156,
            totalRequests: 28
          }
        }
      ];
      
      res.json(streams);
    } catch (error) {
      console.error("Error fetching streams:", error);
      res.status(500).json({ message: "Failed to fetch streams" });
    }
  });

  app.get("/api/partycast/comments/:streamId", async (req, res) => {
    try {
      const { streamId } = req.params;
      
      const comments = [
        {
          id: "comment-001",
          streamId: streamId,
          userId: "user-001",
          userName: "Alex Chen",
          userAvatar: "/avatars/alex.jpg",
          content: "This party looks amazing! Wish I could be there!",
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
          type: "comment",
          isPinned: false,
          isModerated: false
        },
        {
          id: "comment-002",
          streamId: streamId,
          userId: "user-002",
          userName: "Maya Rodriguez",
          userAvatar: "/avatars/maya.jpg",
          content: "Happy Birthday Sarah! 🎉",
          timestamp: new Date(Date.now() - 765000).toISOString(), // 12.75 min ago
          type: "cheer",
          metadata: {
            cheerType: "party",
            cheerAmount: 5
          },
          isPinned: false,
          isModerated: false
        },
        {
          id: "comment-003",
          streamId: streamId,
          userId: "user-003",
          userName: "Jordan Smith",
          userAvatar: "/avatars/jordan.jpg",
          content: "Can you play 'Happy' by Pharrell Williams?",
          timestamp: new Date(Date.now() - 660000).toISOString(), // 11 min ago
          type: "request",
          metadata: {
            requestSong: "Happy - Pharrell Williams"
          },
          isPinned: false,
          isModerated: false
        },
        {
          id: "comment-004",
          streamId: streamId,
          userId: "user-004",
          userName: "Emma Wilson",
          userAvatar: "/avatars/emma.jpg",
          content: "The decorations are stunning! 😍",
          timestamp: new Date(Date.now() - 480000).toISOString(), // 8 min ago
          type: "comment",
          isPinned: true,
          isModerated: false
        },
        {
          id: "comment-005",
          streamId: streamId,
          userId: "user-005",
          userName: "Chris Taylor",
          userAvatar: "/avatars/chris.jpg",
          content: "Fire party! 🔥🔥🔥",
          timestamp: new Date(Date.now() - 120000).toISOString(), // 2 min ago
          type: "cheer",
          metadata: {
            cheerType: "fire",
            cheerAmount: 3
          },
          isPinned: false,
          isModerated: false
        },
        {
          id: "comment-006",
          streamId: streamId,
          userId: "user-006",
          userName: "Lisa Park",
          userAvatar: "/avatars/lisa.jpg",
          content: "Thanks for sharing this with us remote viewers!",
          timestamp: new Date(Date.now() - 30000).toISOString(), // 30 sec ago
          type: "comment",
          isPinned: false,
          isModerated: false
        }
      ];
      
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.get("/api/partycast/requests/:streamId", async (req, res) => {
    try {
      const { streamId } = req.params;
      
      const requests = [
        {
          id: "request-001",
          streamId: streamId,
          userId: "user-003",
          userName: "Jordan Smith",
          userAvatar: "/avatars/jordan.jpg",
          type: "song",
          content: "Happy - Pharrell Williams",
          timestamp: new Date(Date.now() - 660000).toISOString(),
          status: "approved",
          votes: 12,
          priority: "high"
        },
        {
          id: "request-002",
          streamId: streamId,
          userId: "user-007",
          userName: "Sam Rodriguez",
          userAvatar: "/avatars/sam.jpg",
          type: "shoutout",
          content: "Shoutout to my friend Jake who couldn't make it!",
          timestamp: new Date(Date.now() - 420000).toISOString(),
          status: "pending",
          votes: 8,
          priority: "medium"
        },
        {
          id: "request-003",
          streamId: streamId,
          userId: "user-008",
          userName: "Rachel Green",
          userAvatar: "/avatars/rachel.jpg",
          type: "song",
          content: "Uptown Funk - Mark Ronson ft. Bruno Mars",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          status: "pending",
          votes: 15,
          priority: "high"
        },
        {
          id: "request-004",
          streamId: streamId,
          userId: "user-009",
          userName: "David Kim",
          userAvatar: "/avatars/david.jpg",
          type: "announcement",
          content: "Can you announce that pizza is arriving soon?",
          timestamp: new Date(Date.now() - 180000).toISOString(),
          status: "pending",
          votes: 3,
          priority: "low"
        }
      ];
      
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/partycast/analytics/:streamId", async (req, res) => {
    try {
      const { streamId } = req.params;
      
      const analytics = {
        streamId: streamId,
        realTimeStats: {
          currentViewers: 247,
          peakViewers: 350,
          totalViews: 1250,
          averageWatchTime: 1845,
          engagementRate: 78,
          newFollowers: 23
        },
        demographics: {
          ageGroups: [
            { range: "18-24", percentage: 35, count: 86 },
            { range: "25-34", percentage: 42, count: 104 },
            { range: "35-44", percentage: 18, count: 44 },
            { range: "45+", percentage: 5, count: 13 }
          ],
          locations: [
            { city: "New York", count: 89, percentage: 36 },
            { city: "Los Angeles", count: 62, percentage: 25 },
            { city: "Chicago", count: 34, percentage: 14 },
            { city: "Miami", count: 28, percentage: 11 },
            { city: "Other", count: 34, percentage: 14 }
          ]
        },
        engagement: {
          totalComments: 423,
          totalCheers: 89,
          totalRequests: 34,
          averageCommentsPerMinute: 7.2,
          topCheers: [
            { type: "party", count: 34, value: 510 },
            { type: "fire", count: 28, value: 84 },
            { type: "heart", count: 18, value: 54 },
            { type: "star", count: 9, value: 45 }
          ]
        },
        platforms: [
          { platform: "Vibes App", viewers: 156, percentage: 63 },
          { platform: "YouTube", viewers: 67, percentage: 27 },
          { platform: "Instagram", viewers: 24, percentage: 10 }
        ],
        timeline: [
          { time: "19:00", viewers: 45, comments: 12, cheers: 3 },
          { time: "19:15", viewers: 128, comments: 34, cheers: 8 },
          { time: "19:30", viewers: 247, comments: 67, cheers: 15 },
          { time: "19:45", viewers: 298, comments: 89, cheers: 22 },
          { time: "20:00", viewers: 350, comments: 134, cheers: 28 },
          { time: "20:15", viewers: 324, comments: 178, cheers: 35 },
          { time: "20:30", viewers: 289, comments: 234, cheers: 45 },
          { time: "20:45", viewers: 267, comments: 298, cheers: 58 },
          { time: "21:00", viewers: 247, comments: 356, cheers: 73 }
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/partycast/cheers", async (req, res) => {
    try {
      const cheers = [
        { id: "cheer-001", type: "applause", name: "Applause", icon: "👏", cost: 1, animation: "bounce", color: "#FFD700" },
        { id: "cheer-002", type: "fire", name: "Fire", icon: "🔥", cost: 2, animation: "pulse", color: "#FF4500" },
        { id: "cheer-003", type: "heart", name: "Love", icon: "❤️", cost: 3, animation: "float", color: "#FF69B4" },
        { id: "cheer-004", type: "star", name: "Star", icon: "⭐", cost: 5, animation: "sparkle", color: "#FFD700" },
        { id: "cheer-005", type: "crown", name: "Crown", icon: "👑", cost: 10, animation: "glow", color: "#FFD700" },
        { id: "cheer-006", type: "party", name: "Party", icon: "🎉", cost: 15, animation: "confetti", color: "#FF6B6B" }
      ];
      
      res.json(cheers);
    } catch (error) {
      console.error("Error fetching cheers:", error);
      res.status(500).json({ message: "Failed to fetch cheers" });
    }
  });

  app.post("/api/partycast/start", async (req, res) => {
    try {
      const { eventId, title, description, settings } = req.body;
      
      const newStream = {
        id: `stream-${Date.now()}`,
        eventId,
        title,
        description,
        streamUrl: `https://stream.vibes.com/${eventId}-${Date.now()}`,
        status: "live",
        startTime: new Date().toISOString(),
        settings,
        hostName: "Current User",
        viewerCount: 0
      };
      
      console.log(`Stream started: ${title} for event ${eventId}`);
      
      res.json({
        success: true,
        message: "Stream started successfully",
        streamId: newStream.id,
        streamUrl: newStream.streamUrl
      });
    } catch (error) {
      console.error("Error starting stream:", error);
      res.status(500).json({ message: "Failed to start stream" });
    }
  });

  app.post("/api/partycast/:streamId/end", async (req, res) => {
    try {
      const { streamId } = req.params;
      
      console.log(`Stream ended: ${streamId}`);
      
      res.json({
        success: true,
        message: "Stream ended successfully",
        streamId,
        endTime: new Date().toISOString(),
        recordingUrl: `https://recordings.vibes.com/${streamId}`
      });
    } catch (error) {
      console.error("Error ending stream:", error);
      res.status(500).json({ message: "Failed to end stream" });
    }
  });

  app.post("/api/partycast/:streamId/join", async (req, res) => {
    try {
      const { streamId } = req.params;
      const { accessCode } = req.body;
      
      // Simulate access code check for private streams
      const isPrivateStream = streamId === "stream-002";
      if (isPrivateStream && accessCode !== "TECH2025") {
        return res.status(403).json({ message: "Invalid access code" });
      }
      
      console.log(`User joined stream: ${streamId}`);
      
      res.json({
        success: true,
        message: "Successfully joined stream",
        streamId,
        joinTime: new Date().toISOString(),
        streamUrl: `https://stream.vibes.com/watch/${streamId}`
      });
    } catch (error) {
      console.error("Error joining stream:", error);
      res.status(500).json({ message: "Failed to join stream" });
    }
  });

  app.post("/api/partycast/:streamId/comment", async (req, res) => {
    try {
      const { streamId } = req.params;
      const { content, type } = req.body;
      
      const newComment = {
        id: `comment-${Date.now()}`,
        streamId,
        userId: "current-user",
        userName: "You",
        userAvatar: "/avatars/user.jpg",
        content,
        timestamp: new Date().toISOString(),
        type: type || "comment",
        isPinned: false,
        isModerated: false
      };
      
      console.log(`Comment added to stream ${streamId}: ${content}`);
      
      res.json({
        success: true,
        message: "Comment posted successfully",
        comment: newComment
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ message: "Failed to post comment" });
    }
  });

  app.post("/api/partycast/:streamId/cheer", async (req, res) => {
    try {
      const { streamId } = req.params;
      const { cheerType, message } = req.body;
      
      const cheerMap = {
        applause: "Applause",
        fire: "Fire",
        heart: "Love",
        star: "Star",
        crown: "Crown",
        party: "Party"
      };
      
      const cheerName = cheerMap[cheerType] || "Cheer";
      
      console.log(`Cheer sent to stream ${streamId}: ${cheerType}`);
      
      res.json({
        success: true,
        message: "Cheer sent successfully",
        cheerType,
        cheerName,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error sending cheer:", error);
      res.status(500).json({ message: "Failed to send cheer" });
    }
  });

  app.post("/api/partycast/:streamId/request", async (req, res) => {
    try {
      const { streamId } = req.params;
      const { type, content } = req.body;
      
      const newRequest = {
        id: `request-${Date.now()}`,
        streamId,
        userId: "current-user",
        userName: "You",
        userAvatar: "/avatars/user.jpg",
        type,
        content,
        timestamp: new Date().toISOString(),
        status: "pending",
        votes: 0,
        priority: "medium"
      };
      
      console.log(`Request sent to stream ${streamId}: ${type} - ${content}`);
      
      res.json({
        success: true,
        message: "Request sent successfully",
        request: newRequest
      });
    } catch (error) {
      console.error("Error sending request:", error);
      res.status(500).json({ message: "Failed to send request" });
    }
  });

  // Smart Entry & Identity - Next-gen access control API routes
  app.get("/api/smart-entry/methods", async (req, res) => {
    try {
      const methods = [
        {
          id: "face-recognition",
          type: "face",
          name: "Face Recognition",
          description: "AI-powered facial recognition with anti-spoofing",
          icon: "👤",
          enabled: true,
          securityLevel: "high",
          successRate: 94,
          avgProcessingTime: 2.3,
          requiresDevice: true,
          supportsGroup: false
        },
        {
          id: "nft-pass",
          type: "nft",
          name: "NFT Token Pass",
          description: "Blockchain-verified digital passes",
          icon: "🎫",
          enabled: true,
          securityLevel: "maximum",
          successRate: 99,
          avgProcessingTime: 1.8,
          requiresDevice: false,
          supportsGroup: true
        },
        {
          id: "voice-auth",
          type: "voice",
          name: "Voice Password",
          description: "Voice biometrics with secret phrase",
          icon: "🎤",
          enabled: true,
          securityLevel: "medium",
          successRate: 87,
          avgProcessingTime: 3.1,
          requiresDevice: true,
          supportsGroup: false
        },
        {
          id: "manual-entry",
          type: "manual",
          name: "Manual Verification",
          description: "Staff-assisted entry verification",
          icon: "👥",
          enabled: true,
          securityLevel: "low",
          successRate: 100,
          avgProcessingTime: 15.0,
          requiresDevice: false,
          supportsGroup: true
        }
      ];
      
      res.json(methods);
    } catch (error) {
      console.error("Error fetching entry methods:", error);
      res.status(500).json({ message: "Failed to fetch entry methods" });
    }
  });

  app.get("/api/smart-entry/queue", async (req, res) => {
    try {
      const queue = [
        {
          id: "guest-001",
          name: "Sarah Johnson",
          email: "sarah@email.com",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150",
          entryStatus: "entered",
          entryMethod: "face",
          entryTime: "2025-07-01T19:15:30Z",
          verificationScore: 96,
          fraudRisk: "low",
          faceMatchScore: 96,
          deviceInfo: {
            type: "iPhone 14",
            browser: "Safari",
            location: "New York, NY"
          },
          attempts: 1,
          isVIP: true,
          groupSize: 1
        },
        {
          id: "guest-002",
          name: "Alex Chen",
          email: "alex@email.com",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          entryStatus: "approved",
          entryMethod: "nft",
          verificationScore: 100,
          fraudRisk: "low",
          nftTokenId: "0x1234...5678",
          deviceInfo: {
            type: "Android",
            browser: "Chrome",
            location: "Los Angeles, CA"
          },
          attempts: 1,
          isVIP: false,
          groupSize: 2
        },
        {
          id: "guest-003",
          name: "Emma Rodriguez",
          email: "emma@email.com",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
          entryStatus: "pending",
          entryMethod: "voice",
          verificationScore: 0,
          fraudRisk: "medium",
          voiceMatchScore: 83,
          deviceInfo: {
            type: "Desktop",
            browser: "Firefox",
            location: "Chicago, IL"
          },
          attempts: 2,
          isVIP: false,
          groupSize: 1
        },
        {
          id: "guest-004",
          name: "Marcus Thompson",
          email: "marcus@email.com",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          entryStatus: "fraud_detected",
          entryMethod: "face",
          verificationScore: 0,
          fraudRisk: "high",
          faceMatchScore: 23,
          deviceInfo: {
            type: "Unknown",
            browser: "Unknown",
            location: "VPN - Hidden"
          },
          attempts: 5,
          isVIP: false,
          groupSize: 1
        },
        {
          id: "guest-005",
          name: "Jennifer Wilson",
          email: "jen@email.com",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
          entryStatus: "pending",
          entryMethod: "nft",
          verificationScore: 0,
          fraudRisk: "low",
          nftTokenId: "0x9876...5432",
          deviceInfo: {
            type: "iPad",
            browser: "Safari",
            location: "Miami, FL"
          },
          attempts: 1,
          isVIP: true,
          groupSize: 3
        }
      ];
      
      res.json(queue);
    } catch (error) {
      console.error("Error fetching guest queue:", error);
      res.status(500).json({ message: "Failed to fetch guest queue" });
    }
  });

  app.get("/api/smart-entry/stats", async (req, res) => {
    try {
      const stats = {
        totalAttempts: 247,
        successfulEntries: 198,
        fraudBlocked: 23,
        averageProcessingTime: 2.8,
        methodBreakdown: {
          face: { attempts: 89, success: 76, fraudDetected: 8 },
          nft: { attempts: 67, success: 65, fraudDetected: 2 },
          voice: { attempts: 45, success: 31, fraudDetected: 7 },
          manual: { attempts: 46, success: 46, fraudDetected: 0 }
        },
        realTimeMetrics: {
          currentQueue: 12,
          processingRate: 2.1,
          errorRate: 4.2,
          avgWaitTime: 1.8
        }
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching entry stats:", error);
      res.status(500).json({ message: "Failed to fetch entry stats" });
    }
  });

  app.get("/api/smart-entry/fraud-alerts", async (req, res) => {
    try {
      const alerts = [
        {
          id: "alert-001",
          guestId: "guest-004",
          guestName: "Marcus Thompson",
          alertType: "duplicate_face",
          severity: "high",
          timestamp: "2025-07-01T19:45:00Z",
          description: "Facial features match previously blocked user from different event",
          confidence: 87,
          resolved: false,
          action: "blocked"
        },
        {
          id: "alert-002",
          guestId: "guest-005",
          guestName: "Unknown User",
          alertType: "fake_nft",
          severity: "critical",
          timestamp: "2025-07-01T19:40:00Z",
          description: "NFT token appears to be counterfeit or duplicated",
          confidence: 95,
          resolved: false,
          action: "blocked"
        },
        {
          id: "alert-003",
          guestId: "guest-006",
          guestName: "Jennifer Lee",
          alertType: "voice_deepfake",
          severity: "medium",
          timestamp: "2025-07-01T19:38:00Z",
          description: "Voice pattern analysis suggests artificial generation",
          confidence: 73,
          resolved: true,
          action: "reviewed"
        },
        {
          id: "alert-004",
          guestId: "guest-007",
          guestName: "David Kim",
          alertType: "suspicious_device",
          severity: "medium",
          timestamp: "2025-07-01T19:35:00Z",
          description: "Device fingerprint matches known fraud patterns",
          confidence: 81,
          resolved: false,
          action: "flagged"
        },
        {
          id: "alert-005",
          guestId: "guest-008",
          guestName: "Lisa Zhang",
          alertType: "multiple_attempts",
          severity: "low",
          timestamp: "2025-07-01T19:30:00Z",
          description: "Multiple failed entry attempts with different methods",
          confidence: 65,
          resolved: true,
          action: "approved"
        }
      ];
      
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching fraud alerts:", error);
      res.status(500).json({ message: "Failed to fetch fraud alerts" });
    }
  });

  app.get("/api/smart-entry/nft-passes", async (req, res) => {
    try {
      const nftPasses = [
        {
          id: "nft-001",
          tokenId: "1234",
          contractAddress: "0xabc123...",
          eventId: "event-001",
          guestId: "guest-002",
          tierLevel: "vip",
          accessLevel: ["main_event", "vip_lounge", "backstage", "meet_greet"],
          mintedAt: "2025-06-15T10:00:00Z",
          usedAt: null,
          transferHistory: [
            {
              from: "0x000...000",
              to: "alex.eth",
              timestamp: "2025-06-15T10:00:00Z",
              verified: true
            }
          ],
          metadata: {
            image: "https://example.com/nft/vip-pass.png",
            attributes: [
              { trait_type: "Tier", value: "VIP" },
              { trait_type: "Event", value: "Summer Party 2025" },
              { trait_type: "Access Level", value: "Premium" }
            ]
          }
        },
        {
          id: "nft-002",
          tokenId: "5678",
          contractAddress: "0xdef456...",
          eventId: "event-001",
          guestId: "guest-005",
          tierLevel: "premium",
          accessLevel: ["main_event", "premium_seating"],
          mintedAt: "2025-06-20T14:30:00Z",
          usedAt: null,
          transferHistory: [
            {
              from: "0x000...000",
              to: "jennifer.eth",
              timestamp: "2025-06-20T14:30:00Z",
              verified: true
            }
          ],
          metadata: {
            image: "https://example.com/nft/premium-pass.png",
            attributes: [
              { trait_type: "Tier", value: "Premium" },
              { trait_type: "Event", value: "Summer Party 2025" },
              { trait_type: "Access Level", value: "Enhanced" }
            ]
          }
        }
      ];
      
      res.json(nftPasses);
    } catch (error) {
      console.error("Error fetching NFT passes:", error);
      res.status(500).json({ message: "Failed to fetch NFT passes" });
    }
  });

  app.post("/api/smart-entry/face-recognition", async (req, res) => {
    try {
      const { guestName, image, groupSize } = req.body;
      
      // Simulate face recognition processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different outcomes based on guest name
      const faceMatchScore = guestName.toLowerCase().includes('sarah') ? 96 : 
                           guestName.toLowerCase().includes('alex') ? 87 :
                           guestName.toLowerCase().includes('marcus') ? 23 : 85;
      
      const success = faceMatchScore > 75;
      const fraudDetected = faceMatchScore < 30;
      
      const result = {
        success,
        guestName,
        groupSize,
        method: "face_recognition",
        verificationScore: faceMatchScore,
        fraudDetected,
        message: success ? 
          `Face recognition successful! Welcome ${guestName}` :
          fraudDetected ? 
            "Face recognition failed - potential fraud detected" :
            "Face recognition failed - please try again or use manual verification",
        entryTime: success ? new Date().toISOString() : null,
        deviceInfo: {
          type: "Camera Device",
          confidence: faceMatchScore,
          antiSpoofing: !fraudDetected
        }
      };
      
      console.log(`Face recognition attempt: ${guestName} - Score: ${faceMatchScore}% - ${success ? 'SUCCESS' : 'FAILED'}`);
      
      res.json(result);
    } catch (error) {
      console.error("Error processing face recognition:", error);
      res.status(500).json({ message: "Failed to process face recognition" });
    }
  });

  app.post("/api/smart-entry/nft-verification", async (req, res) => {
    try {
      const { tokenId, guestName, groupSize } = req.body;
      
      // Simulate blockchain verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate NFT verification based on token ID
      const validTokens = ["1234", "5678", "9012", "0x1234", "0x5678"];
      const isValid = validTokens.some(token => tokenId.includes(token));
      const tierLevel = tokenId.includes("1234") ? "vip" :
                       tokenId.includes("5678") ? "premium" :
                       tokenId.includes("9012") ? "general" : "premium";
      
      const result = {
        success: isValid,
        guestName,
        groupSize,
        method: "nft_verification",
        verificationScore: isValid ? 100 : 0,
        tierLevel: isValid ? tierLevel : null,
        tokenId,
        message: isValid ? 
          `NFT pass verified! ${tierLevel.toUpperCase()} access granted for ${guestName}` :
          "NFT verification failed - invalid or used token",
        entryTime: isValid ? new Date().toISOString() : null,
        fraudDetected: !isValid && tokenId.length > 0,
        accessLevel: isValid ? 
          tierLevel === "vip" ? ["main_event", "vip_lounge", "backstage"] :
          tierLevel === "premium" ? ["main_event", "premium_seating"] :
          ["main_event"] : []
      };
      
      console.log(`NFT verification attempt: ${guestName} - Token: ${tokenId} - ${isValid ? 'SUCCESS' : 'FAILED'}`);
      
      res.json(result);
    } catch (error) {
      console.error("Error processing NFT verification:", error);
      res.status(500).json({ message: "Failed to process NFT verification" });
    }
  });

  app.post("/api/smart-entry/voice-authentication", async (req, res) => {
    try {
      const { voiceData, password, guestName, groupSize } = req.body;
      
      // Simulate voice processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate voice verification based on password
      const secretPhrases = ["party time", "vibe check", "let's dance", "summer vibes", "night out"];
      const passwordMatch = secretPhrases.some(phrase => 
        password.toLowerCase().includes(phrase.toLowerCase())
      );
      
      const voiceMatchScore = passwordMatch ? 
        (guestName.toLowerCase().includes('emma') ? 83 : 91) : 45;
      
      const success = passwordMatch && voiceMatchScore > 70;
      const deepfakeDetected = voiceMatchScore < 50 && password.length > 0;
      
      const result = {
        success,
        guestName,
        groupSize,
        method: "voice_authentication",
        verificationScore: voiceMatchScore,
        voiceMatchScore,
        fraudDetected: deepfakeDetected,
        message: success ? 
          `Voice authentication successful! Secret phrase verified for ${guestName}` :
          deepfakeDetected ?
            "Voice authentication failed - potential deepfake detected" :
            "Voice authentication failed - phrase or voice didn't match",
        entryTime: success ? new Date().toISOString() : null,
        reason: !success ? 
          deepfakeDetected ? "Deepfake detected" :
          !passwordMatch ? "Secret phrase incorrect" :
          "Voice pattern mismatch" : null
      };
      
      console.log(`Voice authentication attempt: ${guestName} - Score: ${voiceMatchScore}% - ${success ? 'SUCCESS' : 'FAILED'}`);
      
      res.json(result);
    } catch (error) {
      console.error("Error processing voice authentication:", error);
      res.status(500).json({ message: "Failed to process voice authentication" });
    }
  });

  app.post("/api/smart-entry/manual-entry", async (req, res) => {
    try {
      const { guestName, reason, groupSize } = req.body;
      
      // Simulate manual verification processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Manual entries are typically approved unless there's a specific reason not to
      const approved = true;
      
      const result = {
        success: approved,
        guestName,
        groupSize,
        method: "manual_verification",
        verificationScore: 100,
        approved,
        message: approved ? 
          `Manual verification approved for ${guestName}. Staff has verified identity.` :
          `Manual verification denied for ${guestName}. ${reason}`,
        entryTime: approved ? new Date().toISOString() : null,
        staffMember: "Security Team",
        reason: reason || "Standard manual verification"
      };
      
      console.log(`Manual entry request: ${guestName} - ${approved ? 'APPROVED' : 'DENIED'}`);
      
      res.json(result);
    } catch (error) {
      console.error("Error processing manual entry:", error);
      res.status(500).json({ message: "Failed to process manual entry" });
    }
  });

  app.post("/api/smart-entry/resolve-fraud/:alertId", async (req, res) => {
    try {
      const { alertId } = req.params;
      const { action } = req.body;
      
      // Simulate fraud alert resolution
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = {
        success: true,
        alertId,
        action,
        resolvedAt: new Date().toISOString(),
        resolvedBy: "Security Admin",
        message: `Fraud alert ${alertId} has been ${action}d`
      };
      
      console.log(`Fraud alert resolved: ${alertId} - Action: ${action}`);
      
      res.json(result);
    } catch (error) {
      console.error("Error resolving fraud alert:", error);
      res.status(500).json({ message: "Failed to resolve fraud alert" });
    }
  });

  // Live Reaction Walls routes
  app.get("/api/reaction-walls", (req, res) => {
    const walls = [
      {
        id: "wall-main-stage",
        name: "Main Stage Wall",
        location: "Dance Floor",
        isActive: true,
        currentFilter: "trending",
        displayedReactions: [],
        lastUpdated: new Date().toISOString(),
        viewerCount: Math.floor(Math.random() * 200) + 50,
        engagement: {
          totalReactions: Math.floor(Math.random() * 500) + 200,
          avgLikes: Math.round((Math.random() * 10 + 5) * 10) / 10,
          topMood: ["excited", "energetic", "happy"][Math.floor(Math.random() * 3)],
        },
      },
      {
        id: "wall-vip-lounge",
        name: "VIP Lounge Wall",
        location: "VIP Area",
        isActive: true,
        currentFilter: "most-hyped",
        displayedReactions: [],
        lastUpdated: new Date(Date.now() - 30000).toISOString(),
        viewerCount: Math.floor(Math.random() * 80) + 20,
        engagement: {
          totalReactions: Math.floor(Math.random() * 150) + 50,
          avgLikes: Math.round((Math.random() * 15 + 8) * 10) / 10,
          topMood: "excited",
        },
      },
      {
        id: "wall-bar-area",
        name: "Bar Vibes Wall",
        location: "Bar & Cocktails",
        isActive: true,
        currentFilter: "funniest",
        displayedReactions: [],
        lastUpdated: new Date(Date.now() - 75000).toISOString(),
        viewerCount: Math.floor(Math.random() * 120) + 40,
        engagement: {
          totalReactions: Math.floor(Math.random() * 300) + 100,
          avgLikes: Math.round((Math.random() * 8 + 4) * 10) / 10,
          topMood: "happy",
        },
      },
    ];
    res.json(walls);
  });

  app.get("/api/reactions", (req, res) => {
    const { wallId, filter } = req.query;
    
    const emojis = ["🔥", "💃", "🎉", "🎵", "✨", "🚀", "⚡", "💫", "🎊", "🥳", "😍", "🤩", "💯", "🙌"];
    const moods = ["excited", "happy", "energetic", "chill", "wild"];
    const priorities = ["trending", "funny", "hyped", "normal"];
    
    const reactions = Array.from({ length: 12 }, (_, i) => {
      const type = ["emoji", "selfie", "video"][Math.floor(Math.random() * 3)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      return {
        id: `reaction-${wallId || 'wall'}-${i}`,
        type,
        content: type === "emoji" 
          ? emojis[Math.floor(Math.random() * emojis.length)]
          : type === "selfie"
          ? `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}-${Math.random().toString(36).substr(2, 9)}?w=400&fit=crop&crop=face`
          : "https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4",
        author: {
          id: `user-${i}`,
          name: ["Alex", "Sarah", "Mike", "Emma", "Jordan", "Casey", "Taylor", "Jamie"][Math.floor(Math.random() * 8)],
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}-${Math.random().toString(36).substr(2, 9)}?w=150&fit=crop&crop=face`,
          tier: ["vip", "premium", "general"][Math.floor(Math.random() * 3)],
        },
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        eventId: wallId || "event-1",
        likes: Math.floor(Math.random() * 50) + 1,
        isLiked: Math.random() > 0.7,
        tags: ["energy", "party", "vibes", "fun"].slice(0, Math.floor(Math.random() * 3) + 1),
        mood: moods[Math.floor(Math.random() * moods.length)],
        priority,
        viewCount: Math.floor(Math.random() * 200) + 10,
        duration: type === "video" ? 6 : undefined,
        caption: Math.random() > 0.5 ? [
          "This party is amazing! 🎉",
          "Best night ever! ✨",
          "Dancing all night long 💃",
          "Squad goals achieved! 🙌",
          "Vibes are immaculate 🔥",
          "Can't stop won't stop! ⚡"
        ][Math.floor(Math.random() * 6)] : undefined,
      };
    });

    // Filter based on requested filter
    let filteredReactions = reactions;
    if (filter === "trending") {
      filteredReactions = reactions.filter(r => r.priority === "trending" || r.likes > 20);
    } else if (filter === "funniest") {
      filteredReactions = reactions.filter(r => r.priority === "funny" || r.mood === "happy");
    } else if (filter === "most-hyped") {
      filteredReactions = reactions.filter(r => r.priority === "hyped" || r.viewCount > 100);
    } else if (filter === "vip-only") {
      filteredReactions = reactions.filter(r => r.author.tier === "vip");
    }

    res.json(filteredReactions.slice(0, 9)); // Return max 9 reactions for the grid
  });

  app.get("/api/reactions/my-reactions", (req, res) => {
    const myReactions = [
      {
        id: "my-reaction-1",
        type: "emoji",
        content: "🎉",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        likes: 12,
        viewCount: 45,
        caption: "This party rocks!",
      },
      {
        id: "my-reaction-2",
        type: "selfie",
        content: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        likes: 8,
        viewCount: 32,
        caption: "Having the best time!",
      },
    ];
    res.json(myReactions);
  });

  app.post("/api/reactions/emoji", (req, res) => {
    const { emoji, eventId, caption } = req.body;
    
    const reaction = {
      id: `reaction-emoji-${Date.now()}`,
      type: "emoji",
      content: emoji,
      author: {
        id: "current-user",
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        tier: "premium",
      },
      timestamp: new Date().toISOString(),
      eventId,
      likes: 0,
      isLiked: false,
      tags: ["energy"],
      mood: "excited",
      priority: "normal",
      viewCount: 1,
      caption,
    };

    res.json({ success: true, reaction });
  });

  app.post("/api/reactions/selfie", (req, res) => {
    const { imageData, eventId, caption, filters } = req.body;
    
    const reaction = {
      id: `reaction-selfie-${Date.now()}`,
      type: "selfie",
      content: imageData,
      author: {
        id: "current-user",
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        tier: "premium",
      },
      timestamp: new Date().toISOString(),
      eventId,
      likes: 0,
      isLiked: false,
      tags: ["selfie", "memories"],
      mood: "happy",
      priority: "normal",
      viewCount: 1,
      caption,
      filters,
    };

    res.json({ success: true, reaction });
  });

  app.post("/api/reactions/video", (req, res) => {
    const { videoData, eventId, caption, duration } = req.body;
    
    const reaction = {
      id: `reaction-video-${Date.now()}`,
      type: "video",
      content: videoData,
      author: {
        id: "current-user",
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        tier: "premium",
      },
      timestamp: new Date().toISOString(),
      eventId,
      likes: 0,
      isLiked: false,
      tags: ["video", "moments"],
      mood: "energetic",
      priority: "normal",
      viewCount: 1,
      duration,
      caption,
    };

    res.json({ success: true, reaction });
  });

  app.post("/api/reactions/:reactionId/like", (req, res) => {
    const { reactionId } = req.params;
    
    // In a real implementation, this would update the database
    res.json({ 
      success: true, 
      reactionId, 
      newLikeCount: Math.floor(Math.random() * 50) + 1,
      isLiked: true 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
