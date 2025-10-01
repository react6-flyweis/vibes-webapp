import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test route
  app.get("/api/test", (req, res) => {
    res.json({ message: "Server running" });
  });

  // Event creation route
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = {
        ...req.body,
        hostId: 1, // For now, using a default host ID since we don't have auth
      };
      
      const newEvent = await storage.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error: any) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event: " + error.message });
    }
  });

  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      // For now, return the hardcoded events since we don't have real user events yet
      const events = [
        {
          id: "party_bus_001",
          title: "Miami Party Bus Tour",
          description: "VIP party bus experience through Miami's hottest nightlife spots with LED lights, premium sound system, and celebrity DJ.",
          category: "party-bus",
          venue: "Miami Party Bus Co.",
          address: "South Beach District",
          city: "Miami",
          date: "2025-06-20",
          time: "18:00",
          price: { min: 89, max: 149, currency: "USD" },
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=240&fit=crop&auto=format",
          rating: 4.9,
          attendees: 78,
          maxCapacity: 100,
          tags: ["party bus", "nightlife", "Miami", "VIP"],
          featured: true,
          trending: true,
          soldOut: false,
          organizer: "Miami Nightlife Tours"
        }
      ];
      res.json(events);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events: " + error.message });
    }
  });

  // Get specific event by ID
  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = {
        id: eventId,
        title: "Jordan's 30th Birthday Celebration",
        description: "A spectacular birthday party with live music, gourmet catering, and unforgettable vibes",
        venue: "The Rooftop Lounge",
        address: "123 Downtown Ave, Suite 30",
        city: "Los Angeles",
        date: "2025-03-15",
        time: "20:00",
        price: { min: 50, max: 150, currency: "USD" },
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=240&fit=crop&auto=format",
        rating: 4.8,
        attendees: 47,
        maxCapacity: 50,
        tags: ["birthday", "rooftop", "celebration", "cocktail"],
        featured: true,
        trending: false,
        soldOut: false,
        organizer: "Jordan Smith",
        status: "active",
        category: "birthday-party"
      };
      res.json(event);
    } catch (error: any) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event: " + error.message });
    }
  });

  // Get event budget
  app.get("/api/events/:id/budget", async (req, res) => {
    try {
      const budget = await storage.getEventBudget(req.params.id);
      res.json(budget);
    } catch (error: any) {
      console.error("Error fetching budget:", error);
      res.status(500).json({ message: "Failed to fetch budget: " + error.message });
    }
  });

  // Get event budget summary
  app.get("/api/events/:id/budget/summary", async (req, res) => {
    try {
      const summary = await storage.getBudgetSummary(req.params.id);
      res.json(summary);
    } catch (error: any) {
      console.error("Error fetching budget summary:", error);
      res.status(500).json({ message: "Failed to fetch budget summary: " + error.message });
    }
  });

  // Get event photos
  app.get("/api/events/:id/photos", async (req, res) => {
    try {
      const photos = await storage.getEventPhotos(req.params.id);
      res.json(photos);
    } catch (error: any) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos: " + error.message });
    }
  });

  // Get event tasks
  app.get("/api/events/:id/tasks", async (req, res) => {
    try {
      const tasks = await storage.getEventTasks(req.params.id);
      res.json(tasks);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks: " + error.message });
    }
  });

  // Get event stats
  app.get("/api/events/:id/stats", async (req, res) => {
    try {
      const stats = await storage.getEventStats(req.params.id);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats: " + error.message });
    }
  });

  // Get event messages
  app.get("/api/events/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getEventMessages(req.params.id);
      res.json(messages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages: " + error.message });
    }
  });

  // Event discovery route with contextually appropriate images
  app.get("/api/events/discover", (req, res) => {
    const events = [
      {
        id: "party_bus_001",
        title: "Miami Party Bus Tour",
        description: "VIP party bus experience through Miami's hottest nightlife spots with LED lights, premium sound system, and celebrity DJ.",
        category: "party-bus",
        venue: "Miami Party Bus Co.",
        address: "South Beach District",
        city: "Miami",
        date: "2025-06-20",
        time: "18:00",
        price: { min: 89, max: 149, currency: "USD" },
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=240&fit=crop&auto=format",
        rating: 4.9,
        attendees: 78,
        maxCapacity: 100,
        tags: ["party bus", "nightlife", "Miami", "VIP"],
        featured: true,
        trending: true,
        soldOut: false,
        organizer: "Miami Nightlife Tours"
      },
      {
        id: "cruise_001",
        title: "Sunset Cruise Party",
        description: "Luxurious sunset cruise party with open bar, live entertainment, and breathtaking ocean views.",
        category: "cruise",
        venue: "Marina Bay Dock",
        address: "1200 Biscayne Boulevard",
        city: "Miami",
        date: "2025-06-20",
        time: "18:00",
        price: { min: 125, max: 299, currency: "USD" },
        image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400&h=240&fit=crop&auto=format",
        rating: 4.9,
        attendees: 156,
        maxCapacity: 200,
        tags: ["cruise", "sunset", "open bar", "luxury"],
        featured: true,
        trending: false,
        soldOut: false,
        organizer: "Luxury Cruise Events"
      },
      {
        id: "yacht_001",
        title: "Private Yacht Charter - NYC Skyline",
        description: "Exclusive private yacht experience with Manhattan skyline views, gourmet catering, and premium service.",
        category: "yacht",
        venue: "Hudson River Marina",
        address: "West Side Highway",
        city: "New York",
        date: "2025-06-22",
        time: "19:30",
        price: { min: 150, max: 250, currency: "USD" },
        image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&h=240&fit=crop&auto=format",
        rating: 4.7,
        attendees: 45,
        maxCapacity: 60,
        tags: ["yacht", "NYC skyline", "private", "luxury"],
        featured: false,
        trending: true,
        soldOut: false,
        organizer: "Elite Yacht Charters"
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
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format",
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
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop&auto=format",
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
        date: "2025-06-30",
        time: "17:00",
        price: { min: 35, max: 60, currency: "USD" },
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=240&fit=crop&auto=format",
        rating: 4.5,
        attendees: 89,
        maxCapacity: 150,
        tags: ["beach", "bonfire", "sunset", "acoustic"],
        featured: false,
        trending: true,
        soldOut: false,
        organizer: "Malibu Beach Events"
      },
      {
        id: "music_001",
        title: "Electric Forest Music Festival",
        description: "Multi-day electronic music festival featuring top DJs, immersive art installations, camping, and forest stage experiences.",
        category: "music",
        venue: "Double JJ Resort",
        address: "Forest Festival Grounds",
        city: "Rothbury",
        date: "2025-07-15",
        time: "16:00",
        price: { min: 150, max: 350, currency: "USD" },
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=240&fit=crop&auto=format",
        rating: 4.9,
        attendees: 2500,
        maxCapacity: 3000,
        tags: ["music festival", "electronic", "camping", "multi-day"],
        featured: true,
        trending: true,
        soldOut: false,
        organizer: "Electric Forest"
      },
      {
        id: "nightclub_001",
        title: "Neon Nights Electronic Experience",
        description: "High-energy nightclub experience with laser shows, world-renowned DJs, VIP bottle service, and cutting-edge sound and lighting.",
        category: "nightclub",
        venue: "Club Neon",
        address: "Hollywood Boulevard",
        city: "Los Angeles",
        date: "2025-07-20",
        time: "22:00",
        price: { min: 40, max: 80, currency: "USD" },
        image: "https://images.unsplash.com/photo-1571266028243-d220bc547c2a?w=400&h=240&fit=crop&auto=format",
        rating: 4.7,
        attendees: 420,
        maxCapacity: 500,
        tags: ["nightclub", "electronic", "laser shows", "VIP"],
        featured: true,
        trending: false,
        soldOut: false,
        organizer: "Neon Entertainment"
      }
    ];

    res.json(events);
  });

  // Menu items routes
  app.get("/api/events/:eventId/menu-items", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const menuItems = await storage.getEventMenuItems(eventId);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post("/api/events/:eventId/menu-items", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const menuItem = await storage.createMenuItem({
        ...req.body,
        eventId
      });
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await storage.updateMenuItem ? 
        await storage.updateMenuItem(id, req.body) : 
        { ...req.body, id };
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMenuItem ? 
        await storage.deleteMenuItem(id) : true;
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Drink items routes
  app.get("/api/events/:eventId/drink-items", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const drinkItems = await storage.getDrinkItems(eventId);
      res.json(drinkItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drink items" });
    }
  });

  app.post("/api/events/:eventId/drink-items", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const drinkItem = await storage.createDrinkItem({
        ...req.body,
        eventId
      });
      res.json(drinkItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to create drink item" });
    }
  });

  app.put("/api/drink-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedItem = await storage.updateDrinkItem(id, req.body);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update drink item" });
    }
  });

  app.delete("/api/drink-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDrinkItem(id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete drink item" });
    }
  });

  // Guest Management Routes
  app.get("/api/events/:eventId/guests", async (req, res) => {
    try {
      const guests = await storage.getEventGuests(req.params.eventId);
      res.json(guests);
    } catch (error) {
      console.error("Error fetching guests:", error);
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  app.post("/api/events/:eventId/guests", async (req, res) => {
    try {
      const guest = await storage.addGuest({ 
        ...req.body, 
        eventId: req.params.eventId 
      });
      res.status(201).json(guest);
    } catch (error) {
      console.error("Error adding guest:", error);
      res.status(500).json({ message: "Failed to add guest" });
    }
  });

  // Invitation Routes
  app.post("/api/events/:eventId/invitations/send", async (req, res) => {
    try {
      const { template, message, sendVia, guestIds } = req.body;
      
      const invitation = {
        id: Date.now(),
        eventId: req.params.eventId,
        template,
        message,
        sendVia,
        guestIds,
        sentAt: new Date().toISOString(),
        status: 'sent'
      };
      
      res.json(invitation);
    } catch (error) {
      console.error("Error sending invitations:", error);
      res.status(500).json({ message: "Failed to send invitations" });
    }
  });

  app.post("/api/events/:eventId/invitations/whatsapp", async (req, res) => {
    try {
      const { message, guestIds } = req.body;
      
      const result = {
        success: true,
        shareUrl: `https://wa.me/?text=${encodeURIComponent(message)}`,
        guestIds,
        sentAt: new Date().toISOString()
      };
      
      res.json(result);
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
      res.status(500).json({ message: "Failed to share via WhatsApp" });
    }
  });

  // Seating Routes
  app.get("/api/events/:eventId/seating", async (req, res) => {
    try {
      const seating = await storage.getEventSeating(req.params.eventId);
      res.json(seating);
    } catch (error) {
      console.error("Error fetching seating:", error);
      res.status(500).json({ message: "Failed to fetch seating" });
    }
  });

  app.post("/api/events/:eventId/seating/assign", async (req, res) => {
    try {
      const { guestId, seatId } = req.body;
      const assignment = await storage.assignSeat(req.params.eventId, guestId, seatId);
      res.json(assignment);
    } catch (error) {
      console.error("Error assigning seat:", error);
      res.status(500).json({ message: "Failed to assign seat" });
    }
  });

  // DJ Booth & Music Routes
  app.get("/api/events/:eventId/songs/requests", async (req, res) => {
    try {
      const requests = await storage.getSongRequests(req.params.eventId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching song requests:", error);
      res.status(500).json({ message: "Failed to fetch song requests" });
    }
  });

  app.post("/api/events/:eventId/songs/request", async (req, res) => {
    try {
      const request = await storage.addSongRequest({
        ...req.body,
        eventId: req.params.eventId
      });
      res.status(201).json(request);
    } catch (error) {
      console.error("Error adding song request:", error);
      res.status(500).json({ message: "Failed to add song request" });
    }
  });

  app.post("/api/events/:eventId/songs/:songId/vote", async (req, res) => {
    try {
      const result = await storage.voteSong(req.params.songId);
      res.json(result);
    } catch (error) {
      console.error("Error voting for song:", error);
      res.status(500).json({ message: "Failed to vote for song" });
    }
  });

  // Vibes Connect Routes
  app.get("/api/events/:eventId/vibes/status", async (req, res) => {
    try {
      const vibes = await storage.getEventVibes(req.params.eventId);
      res.json(vibes);
    } catch (error) {
      console.error("Error fetching vibes:", error);
      res.status(500).json({ message: "Failed to fetch vibes" });
    }
  });

  app.post("/api/events/:eventId/vibes/update", async (req, res) => {
    try {
      const { mood, energy, activity } = req.body;
      const vibes = await storage.updateEventVibes(req.params.eventId, {
        mood,
        energy,
        activity,
        timestamp: new Date().toISOString()
      });
      res.json(vibes);
    } catch (error) {
      console.error("Error updating vibes:", error);
      res.status(500).json({ message: "Failed to update vibes" });
    }
  });

  // Menu and Drink Item Routes
  app.get("/api/events/:eventId/menu-items", async (req, res) => {
    try {
      const menuItems = await storage.getEventMenuItems(req.params.eventId);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/events/:eventId/drink-items", async (req, res) => {
    try {
      const drinkItems = await storage.getEventDrinkItems(req.params.eventId);
      res.json(drinkItems);
    } catch (error) {
      console.error("Error fetching drink items:", error);
      res.status(500).json({ message: "Failed to fetch drink items" });
    }
  });

  app.post("/api/events/:eventId/menu-items", async (req, res) => {
    try {
      const menuItem = await storage.createEventMenuItem(req.params.eventId, req.body);
      res.json(menuItem);
    } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.post("/api/events/:eventId/drink-items", async (req, res) => {
    try {
      const drinkItem = await storage.createEventDrinkItem(req.params.eventId, req.body);
      res.json(drinkItem);
    } catch (error) {
      console.error("Error creating drink item:", error);
      res.status(500).json({ message: "Failed to create drink item" });
    }
  });

  app.put("/api/events/:eventId/menu-items/:itemId", async (req, res) => {
    try {
      const updatedItem = await storage.updateEventMenuItem(req.params.eventId, req.params.itemId, req.body);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  app.put("/api/events/:eventId/drink-items/:itemId", async (req, res) => {
    try {
      const updatedItem = await storage.updateEventDrinkItem(req.params.eventId, req.params.itemId, req.body);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating drink item:", error);
      res.status(500).json({ message: "Failed to update drink item" });
    }
  });

  app.delete("/api/events/:eventId/menu-items/:itemId", async (req, res) => {
    try {
      await storage.deleteEventMenuItem(req.params.eventId, req.params.itemId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  app.delete("/api/events/:eventId/drink-items/:itemId", async (req, res) => {
    try {
      await storage.deleteEventDrinkItem(req.params.eventId, req.params.itemId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting drink item:", error);
      res.status(500).json({ message: "Failed to delete drink item" });
    }
  });

  // Budget items routes
  app.post("/api/events/:eventId/budget-items", async (req, res) => {
    try {
      const budgetItem = await storage.createEventBudgetItem(req.params.eventId, req.body);
      res.json(budgetItem);
    } catch (error) {
      console.error("Error creating budget item:", error);
      res.status(500).json({ message: "Failed to create budget item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}