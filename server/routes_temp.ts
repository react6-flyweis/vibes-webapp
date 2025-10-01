import { 
  users, events, menuItems, eventParticipants, vendors,
  type User, type InsertUser,
  type Event, type InsertEvent,
  type MenuItem, type InsertMenuItem,
  type EventParticipant, type InsertEventParticipant,
  type Vendor, type InsertVendor
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  getUserEvents(userId: number): Promise<Event[]>;
  
  // Menu item methods
  getEventMenuItems(eventId: number): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Participant methods
  getEventParticipants(eventId: number): Promise<EventParticipant[]>;
  addEventParticipant(participant: InsertEventParticipant): Promise<EventParticipant>;
  
  // Vendor methods
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  
  // Booking methods
  getBookableEvent(eventId: string): Promise<any>;
  createEventBooking(bookingData: any): Promise<any>;
  getEventSeating(eventId: string): Promise<any>;
  validatePromoCode(code: string, eventId: string): Promise<any>;
  createEventBookingWithFees(bookingData: any): Promise<any>;
  getBookingHistoryWithFees(): Promise<any[]>;
  
  // Election methods
  createElection(election: any): Promise<any>;
  getAllElections(): Promise<any[]>;
  updateElection(id: number, updates: any): Promise<any>;
  castVote(vote: any): Promise<any>;
  incrementElectionVoteCount(id: number): Promise<void>;
  getElectionResults(id: number): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getUserEvents(userId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.hostId, userId));
  }

  async getEventMenuItems(eventId: number): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.eventId, eventId));
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db
      .insert(menuItems)
      .values({ ...insertItem, claimedById: null, status: "pending" })
      .returning();
    return item;
  }

  async claimMenuItem(itemId: number, userId: number): Promise<MenuItem | undefined> {
    const [updatedItem] = await db
      .update(menuItems)
      .set({ claimedById: userId, status: "claimed" })
      .where(eq(menuItems.id, itemId))
      .returning();
    return updatedItem || undefined;
  }

  async getMenuItemsByCategory(eventId: number, category: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(and(eq(menuItems.eventId, eventId), eq(menuItems.category, category)));
  }

  async getEventParticipants(eventId: number): Promise<EventParticipant[]> {
    return await db.select().from(eventParticipants).where(eq(eventParticipants.eventId, eventId));
  }

  async addEventParticipant(insertParticipant: InsertEventParticipant): Promise<EventParticipant> {
    const [participant] = await db
      .insert(eventParticipants)
      .values(insertParticipant)
      .returning();
    return participant;
  }

  async updateParticipantStatus(eventId: number, userId: number, status: string): Promise<EventParticipant | undefined> {
    const [updated] = await db
      .update(eventParticipants)
      .set({ status })
      .where(and(eq(eventParticipants.eventId, eventId), eq(eventParticipants.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async getEventStats(eventId: number): Promise<{
    confirmedCount: number;
    totalItems: number;
    itemsByCategory: Record<string, { completed: number; total: number }>;
  }> {
    const participants = await this.getEventParticipants(eventId);
    const items = await this.getEventMenuItems(eventId);
    
    const confirmedCount = participants.filter(p => p.status === "confirmed").length;
    const totalItems = items.length;
    
    const itemsByCategory: Record<string, { completed: number; total: number }> = {};
    
    for (const item of items) {
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = { completed: 0, total: 0 };
      }
      itemsByCategory[item.category].total++;
      if (item.status === "claimed") {
        itemsByCategory[item.category].completed++;
      }
    }

    return { confirmedCount, totalItems, itemsByCategory };
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const [vendor] = await db
      .insert(vendors)
      .values(insertVendor)
      .returning();
    return vendor;
  }

  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors);
  }

  async getVendorsByCategory(category: string): Promise<Vendor[]> {
    return await db
      .select()
      .from(vendors)
      .where(eq(vendors.categories, [category]));
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  // Task methods
  async getEventTasks(eventId: number): Promise<EventTask[]> {
    return await db.select().from(eventTasks).where(eq(eventTasks.eventId, eventId)).orderBy(desc(eventTasks.createdAt));
  }

  async createTask(insertTask: InsertEventTask): Promise<EventTask> {
    const [task] = await db.insert(eventTasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<EventTask>): Promise<EventTask | undefined> {
    const [task] = await db.update(eventTasks).set(updates).where(eq(eventTasks.id, id)).returning();
    return task || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(eventTasks).where(eq(eventTasks.id, id));
    return result.rowCount > 0;
  }

  // Message/Chat methods
  async getEventMessages(eventId: number, threadTopic?: string): Promise<EventMessage[]> {
    let query = db.select().from(eventMessages).where(eq(eventMessages.eventId, eventId));
    if (threadTopic) {
      query = query.where(eq(eventMessages.threadTopic, threadTopic));
    }
    return await query.orderBy(eventMessages.createdAt);
  }

  async createMessage(insertMessage: InsertEventMessage): Promise<EventMessage> {
    const [message] = await db.insert(eventMessages).values(insertMessage).returning();
    return message;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(eventMessages).where(eq(eventMessages.id, id));
    return result.rowCount > 0;
  }

  // Budget methods
  async getEventBudget(eventId: number): Promise<EventBudget[]> {
    return await db.select().from(eventBudget).where(eq(eventBudget.eventId, eventId)).orderBy(desc(eventBudget.createdAt));
  }

  async createBudgetItem(insertItem: InsertEventBudget): Promise<EventBudget> {
    const [item] = await db.insert(eventBudget).values(insertItem).returning();
    return item;
  }

  async updateBudgetItem(id: number, updates: Partial<EventBudget>): Promise<EventBudget | undefined> {
    const [item] = await db.update(eventBudget).set(updates).where(eq(eventBudget.id, id)).returning();
    return item || undefined;
  }

  async deleteBudgetItem(id: number): Promise<boolean> {
    const result = await db.delete(eventBudget).where(eq(eventBudget.id, id));
    return result.rowCount > 0;
  }

  async getBudgetSummary(eventId: number): Promise<{
    totalEstimated: number;
    totalActual: number;
    byCategory: Record<string, { estimated: number; actual: number }>;
  }> {
    const budgetItems = await this.getEventBudget(eventId);
    const summary = {
      totalEstimated: 0,
      totalActual: 0,
      byCategory: {} as Record<string, { estimated: number; actual: number }>
    };

    budgetItems.forEach(item => {
      summary.totalEstimated += item.estimatedCost || 0;
      summary.totalActual += item.actualCost || 0;
      
      if (!summary.byCategory[item.category]) {
        summary.byCategory[item.category] = { estimated: 0, actual: 0 };
      }
      summary.byCategory[item.category].estimated += item.estimatedCost || 0;
      summary.byCategory[item.category].actual += item.actualCost || 0;
    });

    return summary;
  }

  // Photo methods
  async getEventPhotos(eventId: number, photoType?: string): Promise<EventPhoto[]> {
    let query = db.select().from(eventPhotos).where(eq(eventPhotos.eventId, eventId));
    if (photoType) {
      query = query.where(eq(eventPhotos.photoType, photoType));
    }
    return await query.orderBy(desc(eventPhotos.createdAt));
  }

  async createPhoto(insertPhoto: InsertEventPhoto): Promise<EventPhoto> {
    const [photo] = await db.insert(eventPhotos).values(insertPhoto).returning();
    return photo;
  }

  async deletePhoto(id: number): Promise<boolean> {
    const result = await db.delete(eventPhotos).where(eq(eventPhotos.id, id));
    return result.rowCount > 0;
  }

  // Event Vendor methods
  async getEventVendors(eventId: number): Promise<EventVendor[]> {
    return await db.select().from(eventVendors).where(eq(eventVendors.eventId, eventId)).orderBy(desc(eventVendors.createdAt));
  }

  async addEventVendor(insertEventVendor: InsertEventVendor): Promise<EventVendor> {
    const [eventVendor] = await db.insert(eventVendors).values(insertEventVendor).returning();
    return eventVendor;
  }

  async updateEventVendor(id: number, updates: Partial<EventVendor>): Promise<EventVendor | undefined> {
    const [eventVendor] = await db.update(eventVendors).set(updates).where(eq(eventVendors.id, id)).returning();
    return eventVendor || undefined;
  }

  // VibeCard Invitation System
  private invitations = new Map<string, any>();

  async createInvitation(invitation: any): Promise<any> {
    this.invitations.set(invitation.id, invitation);
    return invitation;
  }

  async getInvitation(id: string): Promise<any> {
    return this.invitations.get(id);
  }

  async updateInvitation(id: string, data: any): Promise<any> {
    this.invitations.set(id, data);
    return data;
  }

  // Booking methods implementation
  async getBookableEvent(eventId: string): Promise<any> {
    const event = await db.select().from(events).where(eq(events.id, parseInt(eventId)));
    if (event.length === 0) {
      throw new Error("Event not found");
    }
    
    return {
      ...event[0],
      ticketTypes: [
        {
          id: "general",
          name: "General Admission",
          price: 50,
          maxQuantity: 10,
          available: 100
        },
        {
          id: "vip",
          name: "VIP Experience",
          price: 120,
          maxQuantity: 4,
          available: 25
        },
        {
          id: "premium",
          name: "Premium Package",
          price: 200,
          maxQuantity: 2,
          available: 10
        }
      ]
    };
  }

  async createEventBooking(bookingData: any): Promise<any> {
    const booking = {
      id: `booking_${Date.now()}`,
      ...bookingData,
      status: "confirmed",
      bookingDate: new Date().toISOString(),
      totalAmount: this.calculateBookingTotal(bookingData),
      confirmationCode: this.generateConfirmationCode(),
      tickets: bookingData.tickets.map((ticket: any) => ({
        ...ticket,
        ticketNumbers: this.generateTicketNumbers(ticket.quantity)
      }))
    };
    return booking;
  }

  async getEventSeating(eventId: string): Promise<any> {
    return {
      eventId,
      layout: "theater",
      sections: [
        {
          id: "main_floor",
          name: "Main Floor",
          type: "standing",
          capacity: 150,
          available: 142
        },
        {
          id: "premium_tables",
          name: "Premium Tables",
          type: "table",
          capacity: 60,
          available: 45
        },
        {
          id: "vip_front",
          name: "VIP Front Row",
          type: "reserved",
          capacity: 20,
          available: 18
        }
      ],
      occupiedSeats: ["A1", "A2", "B5", "B6", "C10"]
    };
  }

  async validatePromoCode(code: string, eventId: string): Promise<any> {
    const validCodes = {
      "SAVE20": { discount: 20, type: "percentage" },
      "EARLYBIRD": { discount: 15, type: "percentage" },
      "STUDENT": { discount: 10, type: "percentage" },
      "VIP25": { discount: 25, type: "percentage" }
    };

    if (!(code in validCodes)) {
      throw new Error("Invalid promo code");
    }

    return validCodes[code as keyof typeof validCodes];
  }

  async createEventBookingWithFees(bookingData: any): Promise<any> {
    const basePrice = bookingData.ticketPrice * bookingData.quantity;
    const platformFee = Math.round(basePrice * 0.07 * 100) / 100; // 7% platform fee
    const total = Math.round((basePrice + platformFee) * 100) / 100;

    return {
      id: `booking_${Date.now()}`,
      eventId: bookingData.eventId,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      tickets: bookingData.quantity,
      ticketType: bookingData.ticketType,
      basePrice: basePrice,
      platformFee: platformFee,
      total: total,
      status: "confirmed",
      confirmationCode: this.generateConfirmationCode(),
      bookingDate: new Date().toISOString(),
      ticketNumbers: this.generateTicketNumbers(bookingData.quantity),
      paymentStatus: "completed"
    };
  }

  async getBookingHistoryWithFees(): Promise<any[]> {
    return [
      {
        id: "booking_001",
        eventId: "1",
        eventTitle: "Jazz Night at Blue Note",
        eventDate: "2025-01-15",
        eventTime: "20:00",
        eventVenue: "Blue Note Jazz Club",
        ticketType: "General Admission",
        quantity: 2,
        basePrice: 80,
        platformFee: 5.60,
        totalAmount: 85.60,
        status: "confirmed",
        confirmationCode: "JZ2025001",
        bookingDate: "2024-12-20",
        ticketNumbers: ["JZ001", "JZ002"],
        customerName: "John Doe",
        customerEmail: "john@example.com",
        paymentStatus: "completed"
      },
      {
        id: "booking_002",
        eventId: "2",
        eventTitle: "Tech Startup Mixer",
        eventDate: "2024-12-10",
        eventTime: "18:00",
        eventVenue: "Innovation Hub",
        ticketType: "Early Bird",
        quantity: 1,
        basePrice: 25,
        platformFee: 1.75,
        totalAmount: 26.75,
        status: "confirmed",
        confirmationCode: "TS2024002",
        bookingDate: "2024-11-25",
        ticketNumbers: ["TS001"],
        customerName: "John Doe",
        customerEmail: "john@example.com",
        paymentStatus: "completed"
      }
    ];
  }

  async cancelBooking(bookingId: string): Promise<any> {
    // Mock booking cancellation
    return {
      id: bookingId,
      status: "cancelled",
      refundAmount: 85.60,
      refundMethod: "original_payment_method",
      refundProcessingTime: "3-5 business days"
    };
  }

  async updateUserContact(contactInfo: { email?: string; phone?: string }): Promise<any> {
    // Mock contact update
    return {
      email: contactInfo.email,
      phone: contactInfo.phone,
      updatedAt: new Date().toISOString()
    };
  }

  private calculateBookingTotal(bookingData: any): number {
    let total = 0;
    bookingData.tickets.forEach((ticket: any) => {
      total += ticket.price * ticket.quantity;
    });
    // Add 7% platform fee
    const platformFee = total * 0.07;
    return Math.round((total + platformFee) * 100) / 100;
  }

  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'VBE-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateTicketNumbers(quantity: number): string[] {
    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticketNumber = `T${Date.now()}${i.toString().padStart(3, '0')}`;
      tickets.push(ticketNumber);
    }
    return tickets;
  }

  // Election methods (placeholder implementations)
  async createElection(election: any): Promise<any> {
    return { id: Date.now(), ...election };
  }

  async getAllElections(): Promise<any[]> {
    return [];
  }

  async updateElection(id: number, updates: any): Promise<any> {
    return { id, ...updates };
  }

  async castVote(vote: any): Promise<any> {
    return vote;
  }

  async incrementElectionVoteCount(id: number): Promise<void> {
    // Implementation placeholder
  }

  async getElectionResults(id: number): Promise<any> {
    return { id, results: [] };
  }
}

export const storage = new DatabaseStorage();
