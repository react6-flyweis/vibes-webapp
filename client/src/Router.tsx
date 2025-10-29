import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router";
import { Layout } from "@/components/layout";
import { AppShell } from "./components/app-shell";
import { useAuthStore } from "./store/auth-store";

// Lazy-loaded pages (code-splitting)
const NotFound = lazy(() => import("@/pages/not-found"));
// const SimpleHome = lazy(() => import("@/pages/simple-home"));
// const HomePage = lazy(() => import("@/pages/home"));
const ModernHome = lazy(() => import("@/pages/modern-home"));
// const Dashboard = lazy(() => import("@/pages/dashboard"));
const EventPlanning = lazy(() => import("@/pages/event-planning"));
const EventPlanningAuth = lazy(() => import("@/pages/event-planning-auth"));
const EnhancedEventPage = lazy(() => import("@/pages/enhanced-event"));
const BusinessPromotionPage = lazy(() => import("@/pages/business-promotion"));
const VendorOnboarding = lazy(() => import("@/pages/vendor-onboarding"));
const VendorOnboardingPortal = lazy(
  () => import("@/pages/vendor-onboarding-portal")
);
const VendorMarketplace = lazy(() => import("@/pages/vendor-marketplace"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const PremiumDashboard = lazy(() => import("@/pages/premium-dashboard"));
const VendorDashboard = lazy(() => import("@/pages/vendor-dashboard"));
const CorporateDashboard = lazy(() => import("@/pages/corporate-dashboard"));
const StaffingMarketplace = lazy(() => import("@/pages/staffing-marketplace"));
const CateringMarketplace = lazy(() => import("@/pages/catering-marketplace"));
const AIThemeGenerator = lazy(() => import("@/pages/ai-theme-generator"));
const AIPartyDesigner = lazy(() => import("@/pages/ai-party-designer"));
const ARSpacePlanner = lazy(() => import("@/pages/ar-space-planner"));
const LivestreamCompanion = lazy(() => import("@/pages/livestream-companion"));
const AIVibeAnalyzer = lazy(() => import("@/pages/ai-vibe-analyzer"));
const SustainabilityTracker = lazy(
  () => import("@/pages/sustainability-tracker")
);
const HostAchievements = lazy(() => import("@/pages/host-achievements"));
const SmartScheduling = lazy(() => import("@/pages/smart-scheduling"));
const LiveMusicVoting = lazy(() => import("@/pages/live-music-voting"));
const NightclubExperience = lazy(() => import("@/pages/nightclub-experience"));
const InteractiveDrinkPayment = lazy(
  () => import("@/pages/interactive-drink-payment")
);
const VendorPaymentSetup = lazy(() => import("@/pages/vendor-payment-setup"));
const VibeMall = lazy(() => import("@/pages/vibe-mall"));
const ProHostControlPanel = lazy(
  () => import("@/pages/pro-host-control-panel")
);
const PartyQuestGamified = lazy(() => import("@/pages/party-quest-gamified"));
const GuestMatchmaking = lazy(() => import("@/pages/guest-matchmaking"));
const ARPreview = lazy(() => import("@/pages/ar-preview"));
const VibeBotAssistant = lazy(() => import("@/pages/vibebot-assistant"));
const SimpleLoginPage = lazy(() => import("@/pages/simple-login"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const Login = lazy(() => import("@/pages/auth/login"));
const Signup = lazy(() => import("@/pages/auth/signup"));
const VibeCurator = lazy(() => import("@/pages/vibe-curator"));
const VirtualPartyTwin = lazy(() => import("@/pages/virtual-party-twin"));
const AdaptiveEnvironment = lazy(() => import("@/pages/adaptive-environment"));
const VirtualMeetingPlatform = lazy(
  () => import("@/pages/virtual-meeting-platform")
);
const VibeVerifiedGuests = lazy(() => import("@/pages/vibe-verified-guests"));
const DemoFeatures = lazy(() => import("@/pages/demo-features"));
const Checkout = lazy(() => import("@/pages/checkout"));
const TestCheckout = lazy(() => import("@/pages/test-checkout"));
const SimplePaymentTest = lazy(() => import("@/pages/simple-payment-test"));
const PaymentDebug = lazy(() => import("@/pages/payment-debug"));
const StripeTest = lazy(() => import("@/pages/stripe-test"));
const WorkingPayment = lazy(() => import("@/pages/working-payment"));
const PremiumPage = lazy(() => import("@/pages/premium"));
const VibeControl = lazy(() => import("@/pages/vibe-control"));
const AIVideoMemory = lazy(() => import("@/pages/ai-video-memory-fixed"));
const ARPartyOverlays = lazy(() => import("@/pages/ar-party-overlays"));
const AIPersonalizedRecommendations = lazy(
  () => import("@/pages/ai-personalized-recommendations")
);
const StaffingsPage = lazy(() => import("@/pages/staffings"));
const Caterings = lazy(() => import("@/pages/caterings"));
const SmartContractEscrow = lazy(() => import("@/pages/smart-contract-escrow"));
const EnhancedDJBooth = lazy(() => import("@/pages/enhanced-dj-booth"));
const AdaptiveMusicEngine = lazy(() => import("@/pages/adaptive-music-engine"));
const NFTGuestPasses = lazy(() => import("@/pages/nft-guest-passes"));
const GlobalPartyMarketplace = lazy(
  () => import("@/pages/global-party-marketplace")
);
const EventDAO = lazy(() => import("@/pages/event-dao"));
const AIPartyMediaSuite = lazy(() => import("@/pages/ai-party-media-suite"));
const AIVibeModeling = lazy(() => import("@/pages/ai-vibe-modeling"));
const TokenGatedVIP = lazy(() => import("@/pages/token-gated-vip"));
const ARVRImmersive = lazy(() => import("@/pages/ar-vr-immersive"));
const SustainabilityBadges = lazy(
  () => import("@/pages/sustainability-badges")
);
const VendorLiquidity = lazy(() => import("@/pages/vendor-liquidity"));
const BrandedMicroEvents = lazy(() => import("@/pages/branded-micro-events"));
const VenueIntegration = lazy(() => import("@/pages/venue-integration"));
const EventDiscovery = lazy(() => import("@/pages/event-discovery"));
const EventBooking = lazy(() => import("@/pages/event-booking"));
const FindAndBookEvents = lazy(() => import("@/pages/find-and-book-events"));
const UniquePartyExperiences = lazy(
  () => import("@/pages/unique-party-experiences")
);
const PartyBooking = lazy(() => import("@/pages/party-booking"));
const EventDetail = lazy(() => import("@/pages/event-detail"));
const CreateEvent = lazy(() => import("@/pages/create-event"));
const LoyaltyRewards = lazy(() => import("@/pages/loyalty-rewards"));
const ProfessionalTools = lazy(() => import("@/pages/professional-tools"));
const PlayfulEventDiscovery = lazy(
  () => import("@/pages/playful-event-discovery")
);
const EventSoundtrackGenerator = lazy(
  () => import("@/pages/event-soundtrack-generator")
);
const EventVerificationBadges = lazy(
  () => import("@/pages/event-verification-badges")
);
const SocialStoryTemplates = lazy(
  () => import("@/pages/social-story-templates")
);
const InteractiveMoodVisualizer = lazy(
  () => import("@/pages/interactive-mood-visualizer")
);
const GamifiedAttendanceRewards = lazy(
  () => import("@/pages/gamified-attendance-rewards")
);
const VoiceActivatedAssistant = lazy(
  () => import("@/pages/voice-activated-assistant")
);
const InteractiveLiveVibesInvite = lazy(
  () => import("@/pages/interactive-live-vibes-invite")
);
const VibesCardStudio = lazy(() => import("@/pages/vibescard-studio"));
const VibesCardEdit = lazy(() => import("@/pages/vibescard-edit"));
const VibeLedgerDashboard = lazy(() => import("@/pages/vibeledger-dashboard"));
const InteractiveDesignGenerator = lazy(
  () => import("@/pages/interactive-design-generator")
);
const EcosystemDashboard = lazy(() => import("@/pages/ecosystem-dashboard"));
const EnterpriseSuite = lazy(() => import("@/pages/enterprise-suite"));
const SystemOverview = lazy(() => import("@/pages/system-overview"));
const SocialGroups = lazy(() => import("@/pages/social-groups"));
const InteractiveSeatTracker = lazy(
  () => import("@/pages/interactive-seat-tracker")
);
const PartyHallDecorator = lazy(() => import("@/pages/party-hall-decorator"));
const NaturalVenueShowcase = lazy(
  () => import("@/pages/natural-venue-showcase")
);
const SocialDesignStudio = lazy(() => import("@/pages/social-design-studio"));
const VibeInviteSystem = lazy(() => import("@/pages/vibe-invite-system"));
const CompleteInviteWorkflow = lazy(
  () => import("@/pages/complete-invite-workflow")
);
const EviteTemplates = lazy(() => import("@/pages/evite-templates"));
const GlobalVibePassport = lazy(() => import("@/pages/global-vibe-passport"));
const CollaborativeDesignSharing = lazy(
  () => import("@/pages/collaborative-design-sharing")
);
const ImmersivePartyCam = lazy(() => import("@/pages/immersive-party-cam"));
const InEventCommerce = lazy(() => import("@/pages/in-event-commerce"));
const CulturalDNALayer = lazy(() => import("@/pages/cultural-dna-layer"));
const TicketManagement = lazy(() => import("@/pages/ticket-management"));
const DigitalTwinSystem = lazy(() => import("@/pages/digital-twin-system"));
const AIDJCompanion = lazy(() => import("@/pages/ai-dj-companion"));
const SmartDrinkConcierge = lazy(() => import("@/pages/smart-drink-concierge"));
const PartyCastLive = lazy(() => import("@/pages/partycast-live"));
const SmartEntryIdentity = lazy(() => import("@/pages/smart-entry-identity"));
const SystemInterconnection = lazy(
  () => import("@/pages/system-interconnection")
);
const LiveReactionWalls = lazy(() => import("@/pages/live-reaction-walls"));
const PaymentTest = lazy(() => import("@/pages/payment-test"));
const GetStarted = lazy(() => import("./pages/auth/get-started"));
const VibesBusiness = lazy(() => import("@/pages/vibes-business"));
const VendorCRM = lazy(() => import("@/pages/vendor-crm"));
const VibesLaunchFund = lazy(() => import("@/pages/vibes-launchfund"));
const VendorMigration = lazy(() => import("@/pages/vendor-migration"));
const FinancialDashboard = lazy(() => import("@/pages/financial-dashboard"));
const SecurityTrustDashboard = lazy(
  () => import("@/pages/security-trust-dashboard")
);
const BackersDashboard = lazy(() => import("@/pages/backers-dashboard"));
const FinancialDashboard_DashboardTab = lazy(
  () => import("@/pages/financial-dashboard/DashboardTab")
);
const FinancialDashboard_EscrowTab = lazy(
  () => import("@/pages/financial-dashboard/EscrowTab")
);
const FinancialDashboard_PayoutsTab = lazy(
  () => import("@/pages/financial-dashboard/PayoutsTab")
);
const FinancialDashboard_ProcessingTab = lazy(
  () => import("@/pages/financial-dashboard/ProcessingTab")
);
const FinancialDashboard_TipsTab = lazy(
  () => import("@/pages/financial-dashboard/TipsTab")
);
const FinancialDashboard_RefundsTab = lazy(
  () => import("@/pages/financial-dashboard/RefundsTab")
);

function DashboardRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <Routes>
        <Route path="/plan-event/" element={<EventPlanningAuth />} />
        <Route path="/plan-event/:id" element={<EnhancedEventPage />} />
        <Route path="/ai-party-designer" element={<AIPartyDesigner />} />
        <Route path="/ar-space-planner" element={<ARSpacePlanner />} />
        <Route path="/livestream-companion" element={<LivestreamCompanion />} />
        <Route path="/ai-vibe-analyzer" element={<AIVibeAnalyzer />} />
        <Route
          path="/sustainability-tracker"
          element={<SustainabilityTracker />}
        />
        <Route path="/host-achievements" element={<HostAchievements />} />
        <Route path="/smart-scheduling" element={<SmartScheduling />} />
        <Route path="/live-music-voting" element={<LiveMusicVoting />} />
        <Route path="/nightclub-experience" element={<NightclubExperience />} />
        <Route
          path="/interactive-drink-payment"
          element={<InteractiveDrinkPayment />}
        />
        <Route path="/drink-payment" element={<InteractiveDrinkPayment />} />
        <Route path="/vendor-payment-setup" element={<VendorPaymentSetup />} />
        <Route path="/vendor-payments" element={<VendorPaymentSetup />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/premium-dashboard/*" element={<PremiumDashboard />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/corporate" element={<CorporateDashboard />} />
        <Route path="/vendor-onboarding" element={<VendorOnboarding />} />
        <Route
          path="/vendor-onboarding-portal"
          element={<VendorOnboardingPortal />}
        />
        <Route path="/vendors" element={<VendorMarketplace />} />
        <Route path="/vendor-marketplace" element={<VendorMarketplace />} />
        <Route path="/ai-theme-generator" element={<AIThemeGenerator />} />
        <Route path="/guest-matchmaking" element={<GuestMatchmaking />} />
        <Route path="/social-groups" element={<SocialGroups />} />
        <Route
          path="/virtual-meeting-platform"
          element={<VirtualMeetingPlatform />}
        />
        <Route path="/seat-tracker" element={<InteractiveSeatTracker />} />
        <Route
          path="/interactive-seat-tracker"
          element={<InteractiveSeatTracker />}
        />
        <Route path="/party-hall-decorator" element={<PartyHallDecorator />} />
        <Route path="/decorator" element={<PartyHallDecorator />} />
        <Route path="/venue-showcase" element={<NaturalVenueShowcase />} />
        <Route
          path="/natural-venue-showcase"
          element={<NaturalVenueShowcase />}
        />
        <Route path="/social-design-studio" element={<SocialDesignStudio />} />
        <Route path="/design-studio" element={<SocialDesignStudio />} />
        <Route path="/vibe-invite-system" element={<VibeInviteSystem />} />
        <Route
          path="/complete-invite-workflow"
          element={<CompleteInviteWorkflow />}
        />
        <Route path="/evite-templates" element={<EviteTemplates />} />
        <Route path="/invites" element={<VibeInviteSystem />} />
        <Route path="/e-invitations" element={<VibeInviteSystem />} />
        <Route path="/vibeledger-dashboard" element={<VibeLedgerDashboard />} />
        <Route path="/ar-preview" element={<ARPreview />} />
        <Route path="/vibebot-assistant" element={<VibeBotAssistant />} />
        <Route path="/business-promotion" element={<BusinessPromotionPage />} />
        <Route path="/vibe-curator" element={<VibeCurator />} />
        <Route path="/virtual-party-twin" element={<VirtualPartyTwin />} />
        <Route path="/adaptive-environment" element={<AdaptiveEnvironment />} />
        <Route path="/vibe-verified-guests" element={<VibeVerifiedGuests />} />
        <Route path="/demo" element={<DemoFeatures />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/test-checkout" element={<TestCheckout />} />
        <Route path="/payment-test" element={<SimplePaymentTest />} />
        <Route path="/payment-debug" element={<PaymentDebug />} />
        <Route path="/stripe-test" element={<StripeTest />} />
        <Route path="/working-payment" element={<WorkingPayment />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/dj-booth" element={<EnhancedDJBooth />} />
        <Route path="/adaptive-music" element={<AdaptiveMusicEngine />} />
        <Route path="/ai-video-memory" element={<AIVideoMemory />} />
        <Route
          path="/smart-contract-escrow"
          element={<SmartContractEscrow />}
        />
        <Route path="/nft-guest-passes" element={<NFTGuestPasses />} />
        <Route
          path="/global-marketplace"
          element={<GlobalPartyMarketplace />}
        />
        <Route path="/event-dao" element={<EventDAO />} />
        <Route path="/ai-vibe-modeling" element={<AIVibeModeling />} />
        <Route path="/token-gated-vip" element={<TokenGatedVIP />} />
        <Route path="/ar-vr-immersive" element={<ARVRImmersive />} />
        <Route
          path="/sustainability-badges"
          element={<SustainabilityBadges />}
        />
        <Route path="/vendor-liquidity" element={<VendorLiquidity />} />
        <Route path="/branded-micro-events" element={<BrandedMicroEvents />} />
        <Route path="/venue-integration" element={<VenueIntegration />} />
        <Route path="/event-discovery" element={<EventDiscovery />} />
        <Route path="/find-events" element={<FindAndBookEvents />} />
        <Route path="/unique-parties" element={<UniquePartyExperiences />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event-planning/:eventId" element={<EventPlanning />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/events/booking/:eventId" element={<EventBooking />} />
        <Route path="/tickets" element={<TicketManagement />} />
        <Route path="/digital-twins" element={<DigitalTwinSystem />} />
        <Route path="/staffing-marketplace" element={<StaffingMarketplace />} />
        <Route path="/catering-marketplace" element={<CateringMarketplace />} />
        <Route path="/vibe-mall" element={<VibeMall />} />
        <Route path="/pro-host-control" element={<ProHostControlPanel />} />
        <Route path="/party-quest" element={<PartyQuestGamified />} />
        <Route path="/corporate-dashboard/*" element={<CorporateDashboard />} />
        <Route path="/loyalty-rewards" element={<LoyaltyRewards />} />
        <Route path="/professional-tools" element={<ProfessionalTools />} />
        <Route path="/playful-discovery" element={<PlayfulEventDiscovery />} />
        <Route
          path="/event-soundtrack-generator"
          element={<EventSoundtrackGenerator />}
        />
        <Route
          path="/event-verification-badges"
          element={<EventVerificationBadges />}
        />
        <Route
          path="/social-story-templates"
          element={<SocialStoryTemplates />}
        />
        <Route
          path="/interactive-mood-visualizer"
          element={<InteractiveMoodVisualizer />}
        />
        <Route
          path="/gamified-attendance-rewards"
          element={<GamifiedAttendanceRewards />}
        />
        <Route
          path="/voice-activated-assistant"
          element={<VoiceActivatedAssistant />}
        />
        <Route
          path="/interactive-live-vibes-invite"
          element={<InteractiveLiveVibesInvite />}
        />
        <Route
          path="/invite/:invitationId"
          element={<InteractiveLiveVibesInvite />}
        />
        <Route
          path="/complete-invite-workflow"
          element={<CompleteInviteWorkflow />}
        />
        <Route path="/vibescard-studio" element={<VibesCardStudio />} />
        <Route path="/vibescard-studio/:id" element={<VibesCardEdit />} />
        <Route
          path="/interactive-design-generator"
          element={<InteractiveDesignGenerator />}
        />
        <Route path="/ecosystem-dashboard" element={<EcosystemDashboard />} />
        <Route path="/enterprise-suite" element={<EnterpriseSuite />} />
        <Route path="/system-overview" element={<SystemOverview />} />
        <Route path="/vibe-control" element={<VibeControl />} />
        <Route path="/ar-party-overlays" element={<ARPartyOverlays />} />
        <Route
          path="/ai-personalized-recommendations"
          element={<AIPersonalizedRecommendations />}
        />
        <Route path="/ai-party-media-suite" element={<AIPartyMediaSuite />} />
        <Route path="/global-vibe-passport" element={<GlobalVibePassport />} />
        <Route
          path="/collaborative-design-sharing"
          element={<CollaborativeDesignSharing />}
        />
        <Route path="/immersive-party-cam" element={<ImmersivePartyCam />} />
        <Route path="/in-event-commerce" element={<InEventCommerce />} />
        <Route path="/cultural-dna-layer" element={<CulturalDNALayer />} />
        <Route path="/ai-dj-companion" element={<AIDJCompanion />} />
        <Route path="/dj-companion" element={<AIDJCompanion />} />
        <Route
          path="/smart-drink-concierge"
          element={<SmartDrinkConcierge />}
        />
        <Route path="/drink-concierge" element={<SmartDrinkConcierge />} />
        <Route path="/vibemix" element={<AIDJCompanion />} />
        <Route path="/partycast-live" element={<PartyCastLive />} />
        <Route path="/partycast" element={<PartyCastLive />} />
        <Route path="/livestream" element={<PartyCastLive />} />
        <Route path="/smart-entry" element={<SmartEntryIdentity />} />
        <Route path="/smart-entry-identity" element={<SmartEntryIdentity />} />
        <Route path="/entry-system" element={<SmartEntryIdentity />} />
        <Route path="/access-control" element={<SmartEntryIdentity />} />
        <Route
          path="/system-interconnection"
          element={<SystemInterconnection />}
        />
        <Route path="/live-reaction-walls" element={<LiveReactionWalls />} />
        <Route path="/reaction-walls" element={<LiveReactionWalls />} />
        <Route path="/payment-test" element={<PaymentTest />} />
        <Route path="/vendor-migration" element={<VendorMigration />} />
        <Route path="/vibes-business" element={<VibesBusiness />} />
        <Route path="/crm-dashboard" element={<VendorCRM />} />
        <Route path="staffings" element={<StaffingsPage />} />
        <Route path="caterings" element={<Caterings />} />
        <Route path="/vibes-fund/*" element={<VibesLaunchFund />} />
        <Route path="/financial-management/*" element={<FinancialDashboard />}>
          <Route index element={<FinancialDashboard_DashboardTab />} />
          <Route path="escrow" element={<FinancialDashboard_EscrowTab />} />
          <Route path="payouts" element={<FinancialDashboard_PayoutsTab />} />
          <Route
            path="processing"
            element={<FinancialDashboard_ProcessingTab />}
          />
          <Route path="tips" element={<FinancialDashboard_TipsTab />} />
          <Route path="refunds" element={<FinancialDashboard_RefundsTab />} />
        </Route>

        <Route path="/security-trust/*" element={<SecurityTrustDashboard />} />
        <Route path="/backer-experience/*" element={<BackersDashboard />} />

        {/* Legacy Routes */}
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function Router() {
  return (
    <Routes>
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <AppShell>
            <ModernHome />
          </AppShell>
        }
      />
      <Route path="*" element={<DashboardRouter />} />
    </Routes>
  );
}

export default Router;
