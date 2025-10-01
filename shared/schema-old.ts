import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  subscriptionTier: text("subscription_tier").default("free"), // free, premium, enterprise
  subscriptionExpiry: timestamp("subscription_expiry"),
  isVendor: boolean("is_vendor").default(false),
  vendorTier: text("vendor_tier"), // basic, featured, premium
  companyName: text("company_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  maxAttendees: integer("max_attendees").notNull().default(30),
  hostId: integer("host_id").notNull(),
  eventType: text("event_type").default("birthday"),
  theme: text("theme"),
  dressCode: text("dress_code"),
  isPrivate: boolean("is_private").default(false),
  budget: integer("budget"),
  musicPlaylistUrl: text("music_playlist_url"),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // drinks, food, entertainment, decorations
  imageUrl: text("image_url"),
  contributorId: integer("contributor_id").notNull(),
  claimedById: integer("claimed_by_id"),
  status: text("status").notNull().default("pending"), // pending, claimed
});

export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, yes, no, maybe
  notes: text("notes"), // allergies, plus-ones, special requests
  invitedAt: timestamp("invited_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  businessLogo: text("business_logo"),
  businessDescription: text("business_description").notNull(),
  websiteUrl: text("website_url"),
  businessEmail: text("business_email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  socialMediaHandles: text("social_media_handles"), // JSON string
  categories: text("categories").array().notNull(), // Array of category IDs
  serviceLocation: text("service_location").notNull(),
  serviceRadius: integer("service_radius"), // in miles
  willingToTravel: boolean("willing_to_travel").default(false),
  serviceDays: text("service_days").array().notNull(), // weekdays, weekends, holidays
  minimumBookingFee: integer("minimum_booking_fee").notNull(), // in cents
  priceRangeMin: integer("price_range_min").notNull(), // in cents
  priceRangeMax: integer("price_range_max").notNull(), // in cents
  depositRequired: boolean("deposit_required").default(false),
  paymentMethods: text("payment_methods").array().notNull(),
  portfolioImages: text("portfolio_images").array(), // Array of image URLs
  promoVideo: text("promo_video"),
  reviewsLink: text("reviews_link"),
  testimonials: text("testimonials"),
  calendarIntegration: text("calendar_integration"), // google, outlook, ical
  isVerified: boolean("is_verified").default(false),
  businessLicense: text("business_license"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  claimedById: true,
  status: true,
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({
  id: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  isVerified: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type EventParticipant = typeof eventParticipants.$inferSelect;

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

// New tables for enhanced features
export const eventTasks = pgTable("event_tasks", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  assignedToId: integer("assigned_to_id"),
  createdById: integer("created_by_id").notNull(),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  priority: text("priority").default("medium"), // low, medium, high
  category: text("category").default("general"), // general, decor, food, entertainment, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventMessages = pgTable("event_messages", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // text, image, gif, link
  threadTopic: text("thread_topic"), // decor, games, food, etc.
  replyToId: integer("reply_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventBudget = pgTable("event_budget", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  category: text("category").notNull(), // food, drinks, entertainment, rentals, decorations
  itemName: text("item_name").notNull(),
  estimatedCost: integer("estimated_cost"), // in cents
  actualCost: integer("actual_cost"), // in cents
  paidById: integer("paid_by_id"),
  receiptUrl: text("receipt_url"),
  vendorId: integer("vendor_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventPhotos = pgTable("event_photos", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  uploadedById: integer("uploaded_by_id").notNull(),
  photoUrl: text("photo_url").notNull(),
  caption: text("caption"),
  photoType: text("photo_type").default("planning"), // planning, inspiration, event, post-event
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventVendors = pgTable("event_vendors", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  vendorId: integer("vendor_id").notNull(),
  status: text("status").default("interested"), // interested, booked, confirmed, cancelled
  contractUrl: text("contract_url"),
  totalCost: integer("total_cost"), // in cents
  depositPaid: integer("deposit_paid"), // in cents
  notes: text("notes"),
  bookedAt: timestamp("booked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new tables
export const insertEventTaskSchema = createInsertSchema(eventTasks).omit({
  id: true,
  createdAt: true,
});

export const insertEventMessageSchema = createInsertSchema(eventMessages).omit({
  id: true,
  createdAt: true,
});

export const insertEventBudgetSchema = createInsertSchema(eventBudget).omit({
  id: true,
  createdAt: true,
});

export const insertEventPhotoSchema = createInsertSchema(eventPhotos).omit({
  id: true,
  createdAt: true,
});

export const insertEventVendorSchema = createInsertSchema(eventVendors).omit({
  id: true,
  createdAt: true,
});

// Types for new tables
export type InsertEventTask = z.infer<typeof insertEventTaskSchema>;
export type EventTask = typeof eventTasks.$inferSelect;

export type InsertEventMessage = z.infer<typeof insertEventMessageSchema>;
export type EventMessage = typeof eventMessages.$inferSelect;

export type InsertEventBudget = z.infer<typeof insertEventBudgetSchema>;
export type EventBudget = typeof eventBudget.$inferSelect;

export type InsertEventPhoto = z.infer<typeof insertEventPhotoSchema>;
export type EventPhoto = typeof eventPhotos.$inferSelect;

export type InsertEventVendor = z.infer<typeof insertEventVendorSchema>;
export type EventVendor = typeof eventVendors.$inferSelect;

// Premium feature tables
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  plan: text("plan").notNull(), // free, premium, enterprise
  status: text("status").notNull(), // active, cancelled, expired
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  amount: integer("amount"), // in cents
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiSuggestions = pgTable("ai_suggestions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  category: text("category").notNull(),
  suggestion: text("suggestion").notNull(),
  confidence: integer("confidence"), // 1-100
  reasoning: text("reasoning"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventAnalytics = pgTable("event_analytics", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  metric: text("metric").notNull(), // views, rsvps, contributions, etc
  value: integer("value").notNull(),
  date: timestamp("date").defaultNow(),
});

export const vendorListings = pgTable("vendor_listings", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price"), // in cents
  tier: text("tier").default("basic"), // basic, featured, premium
  isActive: boolean("is_active").default(true),
  featuredUntil: timestamp("featured_until"),
  views: integer("views").default(0),
  leads: integer("leads").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventThemes = pgTable("event_themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isPremium: boolean("is_premium").default(false),
  colors: text("colors").array(), // JSON array of colors
  fonts: text("fonts").array(),
  templates: text("templates"), // JSON template config
  createdAt: timestamp("created_at").defaultNow(),
});

export const corporateAccounts = pgTable("corporate_accounts", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  adminUserId: integer("admin_user_id").notNull(),
  plan: text("plan").notNull(), // starter, professional, enterprise
  maxEvents: integer("max_events").default(10),
  maxSeats: integer("max_seats").default(50),
  customBranding: boolean("custom_branding").default(false),
  whiteLabel: boolean("white_label").default(false),
  apiAccess: boolean("api_access").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new tables
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertAISuggestionSchema = createInsertSchema(aiSuggestions).omit({
  id: true,
  createdAt: true,
});

export const insertEventAnalyticsSchema = createInsertSchema(eventAnalytics).omit({
  id: true,
});

export const insertVendorListingSchema = createInsertSchema(vendorListings).omit({
  id: true,
  createdAt: true,
});

export const insertEventThemeSchema = createInsertSchema(eventThemes).omit({
  id: true,
  createdAt: true,
});

export const insertCorporateAccountSchema = createInsertSchema(corporateAccounts).omit({
  id: true,
  createdAt: true,
});

// Types for new tables
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertAISuggestion = z.infer<typeof insertAISuggestionSchema>;
export type AISuggestion = typeof aiSuggestions.$inferSelect;

export type InsertEventAnalytics = z.infer<typeof insertEventAnalyticsSchema>;
export type EventAnalytics = typeof eventAnalytics.$inferSelect;

export type InsertVendorListing = z.infer<typeof insertVendorListingSchema>;
export type VendorListing = typeof vendorListings.$inferSelect;

export type InsertEventTheme = z.infer<typeof insertEventThemeSchema>;
export type EventTheme = typeof eventThemes.$inferSelect;

export type InsertCorporateAccount = z.infer<typeof insertCorporateAccountSchema>;
export type CorporateAccount = typeof corporateAccounts.$inferSelect;

// Next-Gen AI Features
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

export const arDecorations = pgTable("ar_decorations", {
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

export const vibeBotInteractions = pgTable("vibe_bot_interactions", {
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

export const socialGifts = pgTable("social_gifts", {
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

export const menuRecipes = pgTable("menu_recipes", {
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

export const aiCompanions = pgTable("ai_companions", {
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

export const insertARDecorationSchema = createInsertSchema(arDecorations).omit({
  id: true,
  createdAt: true,
});

export const insertVibeBotInteractionSchema = createInsertSchema(vibeBotInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertSocialGiftSchema = createInsertSchema(socialGifts).omit({
  id: true,
  createdAt: true,
});

export const insertMenuRecipeSchema = createInsertSchema(menuRecipes).omit({
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

export const insertAICompanionSchema = createInsertSchema(aiCompanions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for next-gen features
export type InsertAIThemeGeneration = z.infer<typeof insertAIThemeGenerationSchema>;
export type AIThemeGeneration = typeof aiThemeGenerations.$inferSelect;

export type InsertGuestProfile = z.infer<typeof insertGuestProfileSchema>;
export type GuestProfile = typeof guestProfiles.$inferSelect;

export type InsertGuestMatchmaking = z.infer<typeof insertGuestMatchmakingSchema>;
export type GuestMatchmaking = typeof guestMatchmaking.$inferSelect;

export type InsertARDecoration = z.infer<typeof insertARDecorationSchema>;
export type ARDecoration = typeof arDecorations.$inferSelect;

export type InsertVibeBotInteraction = z.infer<typeof insertVibeBotInteractionSchema>;
export type VibeBotInteraction = typeof vibeBotInteractions.$inferSelect;

export type InsertSocialGift = z.infer<typeof insertSocialGiftSchema>;
export type SocialGift = typeof socialGifts.$inferSelect;

export type InsertMenuRecipe = z.infer<typeof insertMenuRecipeSchema>;
export type MenuRecipe = typeof menuRecipes.$inferSelect;

export type InsertLivePoll = z.infer<typeof insertLivePollSchema>;
export type LivePoll = typeof livePolls.$inferSelect;

export type InsertSustainabilityTracking = z.infer<typeof insertSustainabilityTrackingSchema>;
export type SustainabilityTracking = typeof sustainabilityTracking.$inferSelect;

export type InsertEventRecap = z.infer<typeof insertEventRecapSchema>;
export type EventRecap = typeof eventRecaps.$inferSelect;

export type InsertAICompanion = z.infer<typeof insertAICompanionSchema>;
export type AICompanion = typeof aiCompanions.$inferSelect;
  socialStyle: text("social_style"), // networker, quiet, mixer, etc
  vibePreferences: text("vibe_preferences").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestMatchmaking = pgTable("guest_matchmaking", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  guestId1: integer("guest_id_1").notNull(),
  guestId2: integer("guest_id_2").notNull(),
  matchScore: integer("match_score"), // 1-100
  matchReasons: text("match_reasons").array(),
  seatingGroup: text("seating_group"),
  icebreakerSuggestion: text("icebreaker_suggestion"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const arPreviews = pgTable("ar_previews", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  itemType: text("item_type").notNull(), // decoration, furniture, layout
  itemId: text("item_id"), // reference to vendor item
  previewData: text("preview_data"), // JSON with 3D model data
  spacePhoto: text("space_photo"), // base64 image of user's space
  overlayResult: text("overlay_result"), // processed AR result
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vibeBotInteractions = pgTable("vibebot_interactions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  queryType: text("query_type").notNull(), // reminder, suggestion, question, vendor_help
  userMessage: text("user_message"),
  botResponse: text("bot_response"),
  actionTaken: text("action_taken"), // reminded_guest, suggested_vendor, etc
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialGifting = pgTable("social_gifting", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  giftType: text("gift_type").notNull(), // group_gift, individual_gift, wish_list
  giftName: text("gift_name").notNull(),
  totalAmount: integer("total_amount"), // in cents
  contributedAmount: integer("contributed_amount").default(0),
  contributors: text("contributors").array(), // JSON array of user IDs and amounts
  recipientId: integer("recipient_id"),
  purchaseLink: text("purchase_link"),
  status: text("status").default("active"), // active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const recipeGenerator = pgTable("recipe_generator", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  dishName: text("dish_name").notNull(),
  recipeText: text("recipe_text"),
  ingredients: text("ingredients").array(),
  shoppingList: text("shopping_list").array(),
  cookingSchedule: text("cooking_schedule"), // JSON with timing
  servingSize: integer("serving_size"),
  prepTime: integer("prep_time"), // in minutes
  cookTime: integer("cook_time"), // in minutes
  difficulty: text("difficulty").default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const livePolls = pgTable("live_polls", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  createdById: integer("created_by_id").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  pollType: text("poll_type").default("multiple_choice"), // multiple_choice, rating, open_ended
  isActive: boolean("is_active").default(true),
  votes: text("votes"), // JSON with user votes
  gameType: text("game_type"), // trivia, charades, voting_game
  createdAt: timestamp("created_at").defaultNow(),
});

export const sustainabilityTracking = pgTable("sustainability_tracking", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  carbonFootprint: integer("carbon_footprint"), // estimated CO2 in grams
  wasteGenerated: integer("waste_generated"), // estimated waste in grams
  recyclingRate: integer("recycling_rate"), // percentage
  sustainableVendors: integer("sustainable_vendors"),
  greenAlternatives: text("green_alternatives").array(),
  sustainabilityScore: integer("sustainability_score"), // 1-100
  recommendations: text("recommendations").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRecaps = pgTable("event_recaps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  photoCollectionStatus: text("photo_collection_status").default("collecting"),
  collectedPhotos: text("collected_photos").array(),
  highlightMoments: text("highlight_moments").array(),
  guestContributions: text("guest_contributions"), // JSON summary
  recapVideoUrl: text("recap_video_url"),
  recapPageUrl: text("recap_page_url"),
  isPublic: boolean("is_public").default(false),
  viewCount: integer("view_count").default(0),
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiCompanion = pgTable("ai_companion", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companionName: text("companion_name").default("VibeBot"),
  personalityProfile: text("personality_profile"), // JSON with learned preferences
  hostingStyle: text("hosting_style"), // casual, formal, creative, etc
  favoriteVendors: text("favorite_vendors").array(),
  aestheticPreferences: text("aesthetic_preferences"), // JSON with color/style prefs
  eventHistory: text("event_history"), // JSON with past event insights
  learningLevel: integer("learning_level").default(1), // evolves with usage
  customizations: text("customizations"), // JSON with user customizations
  lastInteraction: timestamp("last_interaction"),
  createdAt: timestamp("created_at").defaultNow(),
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
