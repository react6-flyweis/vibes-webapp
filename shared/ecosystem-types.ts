// Comprehensive party ecosystem types for interconnected features
export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  category: string;
  tags: string[];
  hostId: string;
  attendees: PartyGuest[];
  budget: EventBudget;
  vibesCard?: VibesCardData;
  nftPasses?: NFTPass[];
  playlist?: MusicPlaylist;
  vendors: EventVendor[];
  livestream?: LivestreamData;
  arExperience?: ARExperience;
  escrowContracts?: EscrowContract[];
  sustainability?: SustainabilityData;
  status: 'planning' | 'active' | 'completed';
}

export interface PartyGuest {
  id: string;
  email: string;
  name: string;
  rsvpStatus: 'pending' | 'attending' | 'declined';
  preferences: GuestPreferences;
  nftPass?: NFTPass;
  loyaltyPoints: number;
  achievements: Achievement[];
  socialConnections: string[];
  moodHistory: MoodEntry[];
}

export interface GuestPreferences {
  musicGenres: string[];
  dietaryRestrictions: string[];
  accessibility: string[];
  socialInterests: string[];
  experienceLevel: 'casual' | 'enthusiast' | 'expert';
}

export interface VibesCardData {
  id: string;
  eventId: string;
  design: CanvasElement[];
  style: CardStyle;
  socialExports: SocialExport[];
  collaborators: string[];
  vendorBranding: VendorBranding[];
  nftMinted: boolean;
  interactionStats: InteractionStats;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | '3d' | 'animation' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  content: any;
  style: any;
  animation?: AnimationConfig;
  interactive?: boolean;
  touchResponsive?: boolean;
  tiltResponsive?: boolean;
}

export interface AnimationConfig {
  type: 'float' | 'bounce' | 'spin' | 'pulse' | 'swing' | 'wobble' | 'confetti';
  speed: 'slow' | 'normal' | 'fast';
  direction?: 'up' | 'down' | 'left' | 'right' | 'circular';
  particleCount?: number;
  depth?: number;
  perspective?: number;
}

export interface SocialExport {
  platform: string;
  format: string;
  dimensions: string;
  downloadUrl: string;
  optimizations: string[];
  shareCount: number;
  engagement: number;
}

export interface VendorBranding {
  vendorId: string;
  logoUrl: string;
  brandColors: string[];
  placement: 'corner' | 'footer' | 'watermark';
  partnership: 'sponsored' | 'featured' | 'premium';
}

export interface MusicPlaylist {
  id: string;
  eventId: string;
  tracks: MusicTrack[];
  djRequests: DJRequest[];
  crowdAnalysis: CrowdMood;
  aiRecommendations: TrackRecommendation[];
  liveVoting: boolean;
  sharedWithGuests: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  mood: string;
  energy: number;
  votes: number;
  playedAt?: string;
}

export interface DJRequest {
  id: string;
  trackId: string;
  requesterName: string;
  message?: string;
  votes: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'played' | 'declined';
}

export interface NFTPass {
  id: string;
  eventId: string;
  guestId: string;
  tokenId: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  perks: NFTPerk[];
  achievements: Achievement[];
  transferable: boolean;
  marketValue: number;
  experienceLevel: number;
}

export interface NFTPerk {
  id: string;
  name: string;
  description: string;
  type: 'access' | 'discount' | 'exclusive' | 'priority';
  value: string;
  active: boolean;
}

export interface EventVendor {
  id: string;
  name: string;
  category: string;
  services: VendorService[];
  rating: number;
  pricing: VendorPricing;
  availability: string[];
  sustainability: SustainabilityRating;
  partnerships: VendorPartnership[];
}

export interface VendorService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  requirements: string[];
  capacity: number;
}

export interface VendorPricing {
  baseRate: number;
  currency: string;
  pricePerGuest?: number;
  minimumOrder?: number;
  discounts: PricingDiscount[];
}

export interface PricingDiscount {
  type: 'bulk' | 'early-bird' | 'loyalty' | 'partnership';
  percentage: number;
  conditions: string[];
}

export interface LivestreamData {
  id: string;
  eventId: string;
  streamUrl: string;
  viewerCount: number;
  chatEnabled: boolean;
  moderators: string[];
  highlights: StreamHighlight[];
  interactions: StreamInteraction[];
  quality: 'HD' | '4K' | 'VR';
}

export interface StreamHighlight {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  clipUrl: string;
  reactions: number;
}

export interface StreamInteraction {
  id: string;
  guestId: string;
  type: 'chat' | 'reaction' | 'poll' | 'request';
  content: string;
  timestamp: number;
  visibility: 'public' | 'moderator' | 'host';
}

export interface ARExperience {
  id: string;
  eventId: string;
  type: 'venue-tour' | 'interactive-decor' | 'guest-games' | 'photo-booth';
  assets: ARAsset[];
  interactions: ARInteraction[];
  analytics: ARAnalytics;
  compatibility: DeviceCompatibility;
}

export interface ARAsset {
  id: string;
  name: string;
  type: '3d-model' | 'animation' | 'effect' | 'filter';
  fileUrl: string;
  fileSize: string;
  triggers: ARTrigger[];
}

export interface ARTrigger {
  type: 'marker' | 'face' | 'hand' | 'space' | 'audio';
  sensitivity: number;
  actions: string[];
}

export interface EscrowContract {
  id: string;
  eventId: string;
  vendorId: string;
  amount: number;
  currency: string;
  milestones: ContractMilestone[];
  status: 'pending' | 'active' | 'completed' | 'disputed';
  blockchainTx: string;
}

export interface ContractMilestone {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  completed: boolean;
  approvedBy: string[];
  releasedAt?: string;
}

export interface SustainabilityData {
  id: string;
  eventId: string;
  carbonFootprint: number;
  wasteReduction: number;
  localSourcing: number;
  renewableEnergy: number;
  badges: SustainabilityBadge[];
  certifications: string[];
  improvements: SustainabilityAction[];
}

export interface SustainabilityBadge {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  earned: boolean;
  earnedAt?: string;
  impact: string;
}

export interface SustainabilityAction {
  id: string;
  action: string;
  impact: string;
  cost: number;
  implemented: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface MoodEntry {
  id: string;
  guestId: string;
  eventId: string;
  mood: string;
  intensity: number;
  timestamp: string;
  context: string;
  influences: string[];
}

export interface CrowdMood {
  eventId: string;
  overallMood: string;
  energy: number;
  engagement: number;
  trends: MoodTrend[];
  recommendations: string[];
}

export interface MoodTrend {
  time: string;
  mood: string;
  intensity: number;
  triggers: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  requirements: string[];
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'discount' | 'exclusive' | 'upgrade' | 'access';
  category: string;
  availability: number;
  expiry?: string;
}

export interface EventBudget {
  id: string;
  eventId: string;
  totalBudget: number;
  allocated: BudgetCategory[];
  spent: number;
  remaining: number;
  currency: string;
  escrowAllocated: number;
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  vendors: string[];
  priority: 'low' | 'medium' | 'high';
}

// System Integration Events
export interface SystemEvent {
  id: string;
  type: 'guest-joined' | 'rsvp-changed' | 'payment-completed' | 'vendor-booked' | 
        'nft-minted' | 'mood-updated' | 'stream-started' | 'achievement-earned';
  eventId: string;
  guestId?: string;
  vendorId?: string;
  data: any;
  timestamp: string;
  processed: boolean;
  relatedSystems: string[];
}

// Cross-system communication interfaces
export interface SystemCommunication {
  sendSystemEvent(event: SystemEvent): Promise<void>;
  subscribeToEvents(eventTypes: string[], callback: (event: SystemEvent) => void): void;
  updateGuestProfile(guestId: string, updates: Partial<PartyGuest>): Promise<void>;
  syncEventData(eventId: string): Promise<EventData>;
  triggerRecommendations(eventId: string, context: string): Promise<any[]>;
}

// Device and platform compatibility
export interface DeviceCompatibility {
  ios: boolean;
  android: boolean;
  web: boolean;
  ar: boolean;
  vr: boolean;
  minSpecs: DeviceSpecs;
}

export interface DeviceSpecs {
  ram: number;
  storage: number;
  camera: boolean;
  accelerometer: boolean;
  gyroscope: boolean;
}

// Analytics and insights
export interface EventAnalytics {
  eventId: string;
  guestEngagement: EngagementMetrics;
  vendorPerformance: VendorMetrics;
  financialMetrics: FinancialMetrics;
  socialMetrics: SocialMetrics;
  sustainabilityMetrics: SustainabilityMetrics;
  recommendations: AnalyticsRecommendation[];
}

export interface EngagementMetrics {
  totalGuests: number;
  activeGuests: number;
  averageSessionTime: number;
  interactionRate: number;
  satisfactionScore: number;
  npsScore: number;
}

export interface VendorMetrics {
  totalVendors: number;
  averageRating: number;
  onTimeDelivery: number;
  costEfficiency: number;
  rebookingRate: number;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalCosts: number;
  profitMargin: number;
  escrowUtilization: number;
  paymentSuccessRate: number;
}

export interface SocialMetrics {
  sharesGenerated: number;
  socialReach: number;
  hashtagUsage: number;
  userGeneratedContent: number;
  viralityScore: number;
}

export interface SustainabilityMetrics {
  carbonSaved: number;
  wasteReduced: number;
  localSourcingRate: number;
  sustainabilityScore: number;
  certificationLevel: string;
}

export interface AnalyticsRecommendation {
  id: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impact: string;
  effort: string;
  implementable: boolean;
}

// Real-time system state
export interface SystemState {
  events: { [eventId: string]: EventData };
  guests: { [guestId: string]: PartyGuest };
  vendors: { [vendorId: string]: EventVendor };
  activeStreams: { [streamId: string]: LivestreamData };
  pendingTransactions: { [txId: string]: EscrowContract };
  systemHealth: SystemHealth;
}

export interface SystemHealth {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  blockchain: 'healthy' | 'degraded' | 'down';
  streaming: 'healthy' | 'degraded' | 'down';
  ar: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
}

// Feature integration mappings
export interface FeatureIntegration {
  vibesCardToEvent: (cardId: string) => Promise<EventData>;
  eventToNFTPass: (eventId: string, guestId: string) => Promise<NFTPerk[]>;
  playlistToMood: (playlistId: string) => Promise<CrowdMood>;
  vendorToEscrow: (vendorId: string, eventId: string) => Promise<EscrowContract>;
  guestToRecommendations: (guestId: string) => Promise<any[]>;
  sustainabilityToRewards: (eventId: string) => Promise<LoyaltyReward[]>;
  arToSocial: (experienceId: string) => Promise<SocialExport[]>;
  streamToAnalytics: (streamId: string) => Promise<EventAnalytics>;
}