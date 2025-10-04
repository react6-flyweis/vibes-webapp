import React, { lazy } from "react";
import { Switch, Route } from "wouter";
import { Layout } from "@/components/layout";

// Lazy-loaded pages (code-splitting)
const NotFound = lazy(() => import("@/pages/not-found"));
const SimpleHome = lazy(() => import("@/pages/simple-home"));
const HomePage = lazy(() => import("@/pages/home"));
const ModernHome = lazy(() => import("@/pages/modern-home"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const EventPlanning = lazy(() => import("@/pages/event-planning"));
const EnhancedEventPage = lazy(() => import("@/pages/enhanced-event"));
const BusinessPromotionPage = lazy(() => import("@/pages/business-promotion"));
const VendorOnboarding = lazy(() => import("@/pages/vendor-onboarding"));
const VendorMarketplace = lazy(() => import("@/pages/vendor-marketplace"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const PremiumDashboard = lazy(() => import("@/pages/premium-dashboard"));
const VendorDashboard = lazy(() => import("@/pages/vendor-dashboard"));
const CorporateDashboard = lazy(() => import("@/pages/corporate-dashboard"));
const StaffingMarketplace = lazy(() => import("@/pages/staffing-marketplace"));
const EnhancedStaffingMarketplace = lazy(
  () => import("@/pages/enhanced-staffing-marketplace")
);
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
const VibesCardStudioNew = lazy(() => import("@/pages/vibescard-studio-new"));
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

function DashboardRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={ModernHome} />
        <Route path="/home" component={ModernHome} />
        {/* <Route path="/home" component={HomePage} /> */}
        <Route path="/events/:id" component={EnhancedEventPage} />
        <Route path="/enhanced-event" component={EnhancedEventPage} />
        <Route path="/enhanced-event/:id" component={EnhancedEventPage} />
        <Route path="/ai-party-designer" component={AIPartyDesigner} />
        <Route path="/ar-space-planner" component={ARSpacePlanner} />
        <Route path="/livestream-companion" component={LivestreamCompanion} />
        <Route path="/ai-vibe-analyzer" component={AIVibeAnalyzer} />
        <Route
          path="/sustainability-tracker"
          component={SustainabilityTracker}
        />
        <Route path="/host-achievements" component={HostAchievements} />
        <Route path="/smart-scheduling" component={SmartScheduling} />
        <Route path="/live-music-voting" component={LiveMusicVoting} />
        <Route path="/nightclub-experience" component={NightclubExperience} />
        <Route
          path="/interactive-drink-payment"
          component={InteractiveDrinkPayment}
        />
        <Route path="/drink-payment" component={InteractiveDrinkPayment} />
        <Route path="/vendor-payment-setup" component={VendorPaymentSetup} />
        <Route path="/vendor-payments" component={VendorPaymentSetup} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/premium-dashboard" component={PremiumDashboard} />
        <Route path="/vendor-dashboard" component={VendorDashboard} />
        <Route path="/corporate" component={CorporateDashboard} />
        <Route path="/vendor-onboarding" component={VendorOnboarding} />
        <Route path="/vendors" component={VendorMarketplace} />
        <Route path="/vendor-marketplace" component={VendorMarketplace} />
        <Route path="/ai-theme-generator" component={AIThemeGenerator} />
        <Route path="/guest-matchmaking" component={GuestMatchmaking} />
        <Route path="/social-groups" component={SocialGroups} />
        <Route
          path="/virtual-meeting-platform"
          component={VirtualMeetingPlatform}
        />
        <Route path="/seat-tracker" component={InteractiveSeatTracker} />
        <Route
          path="/interactive-seat-tracker"
          component={InteractiveSeatTracker}
        />
        <Route path="/party-hall-decorator" component={PartyHallDecorator} />
        <Route path="/decorator" component={PartyHallDecorator} />
        <Route path="/venue-showcase" component={NaturalVenueShowcase} />
        <Route
          path="/natural-venue-showcase"
          component={NaturalVenueShowcase}
        />
        <Route path="/social-design-studio" component={SocialDesignStudio} />
        <Route path="/design-studio" component={SocialDesignStudio} />
        <Route path="/vibe-invite-system" component={VibeInviteSystem} />
        <Route
          path="/complete-invite-workflow"
          component={CompleteInviteWorkflow}
        />
        <Route path="/evite-templates" component={EviteTemplates} />
        <Route path="/invites" component={VibeInviteSystem} />
        <Route path="/e-invitations" component={VibeInviteSystem} />
        <Route path="/vibeledger-dashboard" component={VibeLedgerDashboard} />
        <Route path="/ar-preview" component={ARPreview} />
        <Route path="/vibebot-assistant" component={VibeBotAssistant} />
        <Route path="/business-promotion" component={BusinessPromotionPage} />
        <Route path="/vibe-curator" component={VibeCurator} />
        <Route path="/virtual-party-twin" component={VirtualPartyTwin} />
        <Route path="/adaptive-environment" component={AdaptiveEnvironment} />
        <Route path="/vibe-verified-guests" component={VibeVerifiedGuests} />
        <Route path="/demo" component={DemoFeatures} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/test-checkout" component={TestCheckout} />
        <Route path="/payment-test" component={SimplePaymentTest} />
        <Route path="/payment-debug" component={PaymentDebug} />
        <Route path="/stripe-test" component={StripeTest} />
        <Route path="/working-payment" component={WorkingPayment} />
        <Route path="/premium" component={PremiumPage} />
        <Route path="/dj-booth" component={EnhancedDJBooth} />
        <Route path="/adaptive-music" component={AdaptiveMusicEngine} />
        <Route path="/ai-video-memory" component={AIVideoMemory} />
        <Route path="/smart-contract-escrow" component={SmartContractEscrow} />
        <Route path="/nft-guest-passes" component={NFTGuestPasses} />
        <Route path="/global-marketplace" component={GlobalPartyMarketplace} />
        <Route path="/event-dao" component={EventDAO} />
        <Route path="/ai-vibe-modeling" component={AIVibeModeling} />
        <Route path="/token-gated-vip" component={TokenGatedVIP} />
        <Route path="/ar-vr-immersive" component={ARVRImmersive} />
        <Route path="/sustainability-badges" component={SustainabilityBadges} />
        <Route path="/vendor-liquidity" component={VendorLiquidity} />
        <Route path="/branded-micro-events" component={BrandedMicroEvents} />
        <Route path="/venue-integration" component={VenueIntegration} />
        <Route path="/event-discovery" component={EventDiscovery} />
        <Route path="/find-events" component={FindAndBookEvents} />
        <Route path="/unique-parties" component={UniquePartyExperiences} />
        <Route path="/create-event" component={CreateEvent} />
        <Route path="/event-planning/:eventId" component={EventPlanning} />
        <Route path="/events/:eventId" component={EventDetail} />
        <Route path="/events/booking/:eventId" component={PartyBooking} />
        <Route path="/tickets" component={TicketManagement} />
        <Route path="/digital-twins" component={DigitalTwinSystem} />
        <Route
          path="/staffing-marketplace"
          component={EnhancedStaffingMarketplace}
        />
        <Route path="/catering-marketplace" component={CateringMarketplace} />
        <Route path="/vibe-mall" component={VibeMall} />
        <Route path="/pro-host-control" component={ProHostControlPanel} />
        <Route path="/party-quest" component={PartyQuestGamified} />
        <Route path="/corporate-dashboard" component={CorporateDashboard} />
        <Route path="/loyalty-rewards" component={LoyaltyRewards} />
        <Route path="/professional-tools" component={ProfessionalTools} />
        <Route path="/playful-discovery" component={PlayfulEventDiscovery} />
        <Route
          path="/event-soundtrack-generator"
          component={EventSoundtrackGenerator}
        />
        <Route
          path="/event-verification-badges"
          component={EventVerificationBadges}
        />
        <Route
          path="/social-story-templates"
          component={SocialStoryTemplates}
        />
        <Route
          path="/interactive-mood-visualizer"
          component={InteractiveMoodVisualizer}
        />
        <Route
          path="/gamified-attendance-rewards"
          component={GamifiedAttendanceRewards}
        />
        <Route
          path="/voice-activated-assistant"
          component={VoiceActivatedAssistant}
        />
        <Route
          path="/interactive-live-vibes-invite"
          component={InteractiveLiveVibesInvite}
        />
        <Route
          path="/invite/:invitationId"
          component={InteractiveLiveVibesInvite}
        />
        <Route
          path="/complete-invite-workflow"
          component={CompleteInviteWorkflow}
        />
        <Route path="/vibescard-studio" component={VibesCardStudioNew} />
        <Route
          path="/interactive-design-generator"
          component={InteractiveDesignGenerator}
        />
        <Route path="/ecosystem-dashboard" component={EcosystemDashboard} />
        <Route path="/enterprise-suite" component={EnterpriseSuite} />
        <Route path="/system-overview" component={SystemOverview} />
        <Route path="/vibe-control" component={VibeControl} />
        <Route path="/ar-party-overlays" component={ARPartyOverlays} />
        <Route
          path="/ai-personalized-recommendations"
          component={AIPersonalizedRecommendations}
        />
        <Route path="/ai-party-media-suite" component={AIPartyMediaSuite} />
        <Route path="/global-vibe-passport" component={GlobalVibePassport} />
        <Route
          path="/collaborative-design-sharing"
          component={CollaborativeDesignSharing}
        />
        <Route path="/immersive-party-cam" component={ImmersivePartyCam} />
        <Route path="/in-event-commerce" component={InEventCommerce} />
        <Route path="/cultural-dna-layer" component={CulturalDNALayer} />
        <Route path="/ai-dj-companion" component={AIDJCompanion} />
        <Route path="/dj-companion" component={AIDJCompanion} />
        <Route path="/smart-drink-concierge" component={SmartDrinkConcierge} />
        <Route path="/drink-concierge" component={SmartDrinkConcierge} />
        <Route path="/vibemix" component={AIDJCompanion} />
        <Route path="/partycast-live" component={PartyCastLive} />
        <Route path="/partycast" component={PartyCastLive} />
        <Route path="/livestream" component={PartyCastLive} />
        <Route path="/smart-entry" component={SmartEntryIdentity} />
        <Route path="/smart-entry-identity" component={SmartEntryIdentity} />
        <Route path="/entry-system" component={SmartEntryIdentity} />
        <Route path="/access-control" component={SmartEntryIdentity} />
        <Route
          path="/system-interconnection"
          component={SystemInterconnection}
        />
        <Route path="/live-reaction-walls" component={LiveReactionWalls} />
        <Route path="/reaction-walls" component={LiveReactionWalls} />
        <Route path="/payment-test" component={PaymentTest} />

        {/* Legacy Routes */}
        <Route path="/login" component={SimpleLoginPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/get-started" component={GetStarted} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={DashboardRouter} />
      <Route path="/:rest*" component={DashboardRouter} />
    </Switch>
  );
}

export default Router;
