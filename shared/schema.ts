import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Existing core tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  subscriptionTier: text("subscription_tier").default("free"), // free, premium, enterprise
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(), // "public_event" or "private_planning"
  category: text("category").notNull(),
  venue: text("venue").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  price: text("price"),
  currency: text("currency").default("USD"),
  maxCapacity: text("max_capacity").notNull(),
  image: text("image"),
  tags: text("tags"),
  bankAccountHolder: text("bank_account_holder"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  routingNumber: text("routing_number"),
  accountType: text("account_type"),
  hostId: integer("host_id").notNull(),
  isPrivate: boolean("is_private").default(false),
  status: text("status").default("planning"), // planning, active, completed
  
  // Event planning fields for private events
  budget: text("budget"),
  guestCount: text("guest_count"),
  specialRequests: text("special_requests"),
  dietaryRestrictions: text("dietary_restrictions"),
  theme: text("theme"),
  musicPreferences: text("music_preferences"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Drink items for event planning
export const drinkItems = pgTable("drink_items", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "alcoholic", "non-alcoholic", "cocktail", "beer", "wine"
  quantity: text("quantity"),
  estimatedCost: integer("estimated_cost"),
  assignedTo: integer("assigned_to"), // who's bringing this
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  quantity: integer("quantity").default(1),
  assignedTo: integer("assigned_to"),
  isConfirmed: boolean("is_confirmed").default(false),
  estimatedCost: integer("estimated_cost"),
  actualCost: integer("actual_cost"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").default("guest"),
  rsvpStatus: text("rsvp_status").default("pending"),
  dietaryRestrictions: text("dietary_restrictions").array(),
  plusOnes: integer("plus_ones").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  location: text("location"),
  priceRange: text("price_range"),
  rating: integer("rating"),
  verified: boolean("verified").default(false),
  subscriptionTier: text("subscription_tier").default("basic"), // basic, featured, premium
  createdAt: timestamp("created_at").defaultNow(),
});

// Next-Gen Revolutionary AI Features
export const aiThemeGenerations = pgTable("ai_theme_generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id"),
  vibeDescription: text("vibe_description").notNull(),
  generatedTheme: text("generated_theme").notNull(), // JSON object
  colorPalette: text("color_palette").array(),
  fontSuggestions: text("font_suggestions").array(),
  menuSuggestions: text("menu_suggestions").array(),
  musicPlaylist: text("music_playlist"), // JSON with songs
  decorSuggestions: text("decor_suggestions"), // JSON with shopping links
  isApplied: boolean("is_applied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestProfiles = pgTable("guest_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  age: integer("age"),
  interests: text("interests").array(),
  personality: text("personality"), // JSON with traits
  musicPreferences: text("music_preferences").array(),
  foodPreferences: text("food_preferences").array(),
  socialStyle: text("social_style"), // extrovert, introvert, ambivert
  vibeCompatibility: text("vibe_compatibility"), // JSON with compatibility scores
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestMatchmaking = pgTable("guest_matchmaking", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  guestId1: integer("guest_id_1").notNull(),
  guestId2: integer("guest_id_2").notNull(),
  compatibilityScore: integer("compatibility_score"), // 1-100
  suggestedActivities: text("suggested_activities").array(),
  icebreakers: text("icebreakers").array(),
  seatingPreference: text("seating_preference"), // near, avoid, neutral
  createdAt: timestamp("created_at").defaultNow(),
});

export const arPreviews = pgTable("ar_previews", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), // furniture, lighting, decor
  arModelUrl: text("ar_model_url"), // 3D model for AR
  purchaseLink: text("purchase_link"),
  price: integer("price"), // in cents
  vendor: text("vendor"),
  placementData: text("placement_data"), // JSON with AR placement info
  userRating: integer("user_rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
});

export const vibeBotInteractions = pgTable("vibebot_interactions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  messageType: text("message_type").notNull(), // reminder, suggestion, answer, nudge
  botMessage: text("bot_message").notNull(),
  userResponse: text("user_response"),
  actionTaken: text("action_taken"),
  isResolved: boolean("is_resolved").default(false),
  priority: text("priority").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialGifting = pgTable("social_gifting", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  giftTitle: text("gift_title").notNull(),
  giftDescription: text("gift_description"),
  targetAmount: integer("target_amount"), // in cents
  currentAmount: integer("current_amount").default(0),
  contributorIds: integer("contributor_ids").array(),
  giftLink: text("gift_link"), // Amazon/Etsy link
  isCompleted: boolean("is_completed").default(false),
  recipientMessage: text("recipient_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recipeGenerator = pgTable("recipe_generator", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull(),
  recipeName: text("recipe_name").notNull(),
  ingredients: text("ingredients").array(),
  instructions: text("instructions").array(),
  prepTime: integer("prep_time"), // in minutes
  servings: integer("servings"),
  difficulty: text("difficulty"), // easy, medium, hard
  shoppingList: text("shopping_list").array(),
  cookingSchedule: text("cooking_schedule"), // JSON with timeline
  nutritionInfo: text("nutrition_info"), // JSON
  createdAt: timestamp("created_at").defaultNow(),
});

export const livePolls = pgTable("live_polls", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  createdById: integer("created_by_id").notNull(),
  question: text("question").notNull(),
  options: text("options").array(),
  pollType: text("poll_type").default("multiple_choice"), // multiple_choice, rating, open_text
  isActive: boolean("is_active").default(true),
  responses: text("responses"), // JSON with responses
  results: text("results"), // JSON with vote counts
  createdAt: timestamp("created_at").defaultNow(),
});

export const sustainabilityTracking = pgTable("sustainability_tracking", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  carbonFootprint: integer("carbon_footprint"), // CO2 in grams
  wasteEstimate: integer("waste_estimate"), // in grams
  localVendorsUsed: integer("local_vendors_used"),
  sustainableChoices: text("sustainable_choices").array(),
  improvementSuggestions: text("improvement_suggestions").array(),
  ecoScore: integer("eco_score"), // 1-100
  offsetOptions: text("offset_options"), // JSON with carbon offset suggestions
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRecaps = pgTable("event_recaps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  photos: text("photos").array(),
  highlights: text("highlights").array(),
  guestContributions: text("guest_contributions"), // JSON
  statistics: text("statistics"), // JSON with event stats
  videoUrl: text("video_url"),
  webPageUrl: text("web_page_url"),
  isPublic: boolean("is_public").default(false),
  shareableLink: text("shareable_link"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiCompanion = pgTable("ai_companion", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").default("VibeBot"),
  personality: text("personality"), // JSON with AI personality traits
  learningData: text("learning_data"), // JSON with user preferences
  hostingStyle: text("hosting_style"), // casual, formal, creative, etc.
  preferredVendors: integer("preferred_vendors").array(),
  aestheticPreferences: text("aesthetic_preferences"), // JSON
  conversationHistory: text("conversation_history"), // JSON
  evolutionLevel: integer("evolution_level").default(1), // AI grows smarter
  specializations: text("specializations").array(), // areas of expertise
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const businessAds = pgTable("business_ads", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  serviceTitle: text("service_title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // entertainment, food, drinks, etc.
  websiteUrl: text("website_url"),
  contactEmail: text("contact_email"),
  imageUrl: text("image_url"),
  status: text("status").default("pending"), // pending, approved, rejected
  adTier: text("ad_tier").default("basic"), // basic, featured, sponsored
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  clickCount: integer("click_count").default(0),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for next-gen features
export const insertAIThemeGenerationSchema = createInsertSchema(aiThemeGenerations).omit({
  id: true,
  createdAt: true,
});

export const insertGuestProfileSchema = createInsertSchema(guestProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertGuestMatchmakingSchema = createInsertSchema(guestMatchmaking).omit({
  id: true,
  createdAt: true,
});

export const insertARPreviewSchema = createInsertSchema(arPreviews).omit({
  id: true,
  createdAt: true,
});

export const insertVibeBotInteractionSchema = createInsertSchema(vibeBotInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertSocialGiftingSchema = createInsertSchema(socialGifting).omit({
  id: true,
  createdAt: true,
});

export const insertRecipeGeneratorSchema = createInsertSchema(recipeGenerator).omit({
  id: true,
  createdAt: true,
});

export const insertLivePollSchema = createInsertSchema(livePolls).omit({
  id: true,
  createdAt: true,
});

export const insertSustainabilityTrackingSchema = createInsertSchema(sustainabilityTracking).omit({
  id: true,
  createdAt: true,
});

export const insertEventRecapSchema = createInsertSchema(eventRecaps).omit({
  id: true,
  createdAt: true,
});

export const insertAICompanionSchema = createInsertSchema(aiCompanion).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Core schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  hostId: true, // Will be set by the server
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertDrinkItemSchema = createInsertSchema(drinkItems).omit({
  id: true,
  createdAt: true,
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({
  id: true,
  createdAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

// Types for next-gen features
export type InsertAIThemeGeneration = z.infer<typeof insertAIThemeGenerationSchema>;
export type AIThemeGeneration = typeof aiThemeGenerations.$inferSelect;

export type InsertGuestProfile = z.infer<typeof insertGuestProfileSchema>;
export type GuestProfile = typeof guestProfiles.$inferSelect;

export type InsertGuestMatchmaking = z.infer<typeof insertGuestMatchmakingSchema>;
export type GuestMatchmaking = typeof guestMatchmaking.$inferSelect;

export type InsertARPreview = z.infer<typeof insertARPreviewSchema>;
export type ARPreview = typeof arPreviews.$inferSelect;

export type InsertVibeBotInteraction = z.infer<typeof insertVibeBotInteractionSchema>;
export type VibeBotInteraction = typeof vibeBotInteractions.$inferSelect;

export type InsertSocialGifting = z.infer<typeof insertSocialGiftingSchema>;
export type SocialGifting = typeof socialGifting.$inferSelect;

export type InsertRecipeGenerator = z.infer<typeof insertRecipeGeneratorSchema>;
export type RecipeGenerator = typeof recipeGenerator.$inferSelect;

export type InsertLivePoll = z.infer<typeof insertLivePollSchema>;
export type LivePoll = typeof livePolls.$inferSelect;

export type InsertSustainabilityTracking = z.infer<typeof insertSustainabilityTrackingSchema>;
export type SustainabilityTracking = typeof sustainabilityTracking.$inferSelect;

export type InsertEventRecap = z.infer<typeof insertEventRecapSchema>;
export type EventRecap = typeof eventRecaps.$inferSelect;

export type InsertAICompanion = z.infer<typeof insertAICompanionSchema>;
export type AICompanion = typeof aiCompanion.$inferSelect;

// Core types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// VibeInvite types (using in-memory data for now)
export interface Invitation {
  id: string;
  hostId: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  theme: string;
  inviteType: 'static' | 'animated' | '3d' | 'video';
  isNFTEnabled: boolean;
  isPremium: boolean;
  status: 'draft' | 'sent' | 'active' | 'ended';
  viewCount: number;
  shareCount: number;
  allowPlusGuests: boolean;
  enableEmojiReactions: boolean;
  enableGuestPolls: boolean;
  customQuestions: any[];
  createdAt: string;
}

export interface RSVPResponse {
  id: string;
  invitationId: string;
  guestName: string;
  guestEmail: string;
  response: 'yes' | 'no' | 'maybe';
  plusGuests: number;
  dietaryNeeds: string;
  songRequest: string;
  arrivalTime: string;
  emoji: string;
  comment: string;
  createdAt: string;
}

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

export type InsertDrinkItem = z.infer<typeof insertDrinkItemSchema>;
export type DrinkItem = typeof drinkItems.$inferSelect;

export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type EventParticipant = typeof eventParticipants.$inferSelect;

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;