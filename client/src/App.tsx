import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { InstallPrompt } from "@/components/InstallPrompt";

import NotFound from "@/pages/not-found";
import SimpleHome from "@/pages/simple-home";
import HomePage from "@/pages/home";
import ModernHome from "@/pages/modern-home";
import Dashboard from "@/pages/dashboard";
import EventPlanning from "@/pages/event-planning";
import EnhancedEventPage from "@/pages/enhanced-event";
import BusinessPromotionPage from "@/pages/business-promotion";
import VendorOnboarding from "@/pages/vendor-onboarding";
import VendorMarketplace from "@/pages/vendor-marketplace";
import PricingPage from "@/pages/pricing";
import PremiumDashboard from "@/pages/premium-dashboard";
import VendorDashboard from "@/pages/vendor-dashboard";
import CorporateDashboard from "@/pages/corporate-dashboard";
import StaffingMarketplace from "@/pages/staffing-marketplace";
import EnhancedStaffingMarketplace from "@/pages/enhanced-staffing-marketplace";
import CateringMarketplace from "@/pages/catering-marketplace";
import AIThemeGenerator from "@/pages/ai-theme-generator";
import AIPartyDesigner from "@/pages/ai-party-designer";
import ARSpacePlanner from "@/pages/ar-space-planner";
import LivestreamCompanion from "@/pages/livestream-companion";
import AIVibeAnalyzer from "@/pages/ai-vibe-analyzer";
import SustainabilityTracker from "@/pages/sustainability-tracker";
import HostAchievements from "@/pages/host-achievements";
import SmartScheduling from "@/pages/smart-scheduling";
import LiveMusicVoting from "@/pages/live-music-voting";
import NightclubExperience from "@/pages/nightclub-experience";
import InteractiveDrinkPayment from "@/pages/interactive-drink-payment";
import VendorPaymentSetup from "@/pages/vendor-payment-setup";
import VibeMall from "@/pages/vibe-mall";
import ProHostControlPanel from "@/pages/pro-host-control-panel";
import PartyQuestGamified from "@/pages/party-quest-gamified";
import GuestMatchmaking from "@/pages/guest-matchmaking";
import ARPreview from "@/pages/ar-preview";
import VibeBotAssistant from "@/pages/vibebot-assistant";
import SimpleLoginPage from "@/pages/simple-login";
import ProfilePage from "@/pages/profile";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import VibeCurator from "@/pages/vibe-curator";
import VirtualPartyTwin from "@/pages/virtual-party-twin";
import AdaptiveEnvironment from "@/pages/adaptive-environment";
import VirtualMeetingPlatform from "@/pages/virtual-meeting-platform";
import VibeVerifiedGuests from "@/pages/vibe-verified-guests";
import DemoFeatures from "@/pages/demo-features";
import Checkout from "@/pages/checkout";
import TestCheckout from "@/pages/test-checkout";
import SimplePaymentTest from "@/pages/simple-payment-test";
import PaymentDebug from "@/pages/payment-debug";
import StripeTest from "@/pages/stripe-test";
import WorkingPayment from "@/pages/working-payment";
import PremiumPage from "@/pages/premium";
import VibeControl from "@/pages/vibe-control";
import AIVideoMemory from "@/pages/ai-video-memory-fixed";
import ARPartyOverlays from "@/pages/ar-party-overlays";
import AIPersonalizedRecommendations from "@/pages/ai-personalized-recommendations";
import SmartContractEscrow from "@/pages/smart-contract-escrow";
import EnhancedDJBooth from "@/pages/enhanced-dj-booth";
import AdaptiveMusicEngine from "@/pages/adaptive-music-engine";
import NFTGuestPasses from "@/pages/nft-guest-passes";
import GlobalPartyMarketplace from "@/pages/global-party-marketplace";
import EventDAO from "@/pages/event-dao";
import AIPartyMediaSuite from "@/pages/ai-party-media-suite";
import AIVibeModeling from "@/pages/ai-vibe-modeling";
import TokenGatedVIP from "@/pages/token-gated-vip";
import ARVRImmersive from "@/pages/ar-vr-immersive";
import SustainabilityBadges from "@/pages/sustainability-badges";
import VendorLiquidity from "@/pages/vendor-liquidity";
import BrandedMicroEvents from "@/pages/branded-micro-events";
import VenueIntegration from "@/pages/venue-integration";
import EventDiscovery from "@/pages/event-discovery";
import EventBooking from "@/pages/event-booking";
import FindAndBookEvents from "@/pages/find-and-book-events";
import UniquePartyExperiences from "@/pages/unique-party-experiences";
import PartyBooking from "@/pages/party-booking";
import EventDetail from "@/pages/event-detail";
import CreateEvent from "@/pages/create-event";
import LoyaltyRewards from "@/pages/loyalty-rewards";
import ProfessionalTools from "@/pages/professional-tools";
import PlayfulEventDiscovery from "@/pages/playful-event-discovery";
import EventSoundtrackGenerator from "@/pages/event-soundtrack-generator";
import EventVerificationBadges from "@/pages/event-verification-badges";
import SocialStoryTemplates from "@/pages/social-story-templates";
import InteractiveMoodVisualizer from "@/pages/interactive-mood-visualizer";
import GamifiedAttendanceRewards from "@/pages/gamified-attendance-rewards";
import VoiceActivatedAssistant from "@/pages/voice-activated-assistant";
import InteractiveLiveVibesInvite from "@/pages/interactive-live-vibes-invite";
import VibesCardStudio from "@/pages/vibescard-studio";
import VibesCardStudioNew from "@/pages/vibescard-studio-new";
import VibeLedgerDashboard from "@/pages/vibeledger-dashboard";
import InteractiveDesignGenerator from "@/pages/interactive-design-generator";
import EcosystemDashboard from "@/pages/ecosystem-dashboard";
import EnterpriseSuite from "@/pages/enterprise-suite";
import SystemOverview from "@/pages/system-overview";
import SocialGroups from "@/pages/social-groups";
import InteractiveSeatTracker from "@/pages/interactive-seat-tracker";
import PartyHallDecorator from "@/pages/party-hall-decorator";
import NaturalVenueShowcase from "@/pages/natural-venue-showcase";
import SocialDesignStudio from "@/pages/social-design-studio";
import VibeInviteSystem from "@/pages/vibe-invite-system";
import CompleteInviteWorkflow from "@/pages/complete-invite-workflow";
import EviteTemplates from "@/pages/evite-templates";
import GlobalVibePassport from "@/pages/global-vibe-passport";
import CollaborativeDesignSharing from "@/pages/collaborative-design-sharing";
import ImmersivePartyCam from "@/pages/immersive-party-cam";
import InEventCommerce from "@/pages/in-event-commerce";
import CulturalDNALayer from "@/pages/cultural-dna-layer";
import TicketManagement from "@/pages/ticket-management";
import DigitalTwinSystem from "@/pages/digital-twin-system";
import AIDJCompanion from "@/pages/ai-dj-companion";
import SmartDrinkConcierge from "@/pages/smart-drink-concierge";
import PartyCastLive from "@/pages/partycast-live";
import SmartEntryIdentity from "@/pages/smart-entry-identity";
import SystemInterconnection from "@/pages/system-interconnection";
import LiveReactionWalls from "@/pages/live-reaction-walls";
import PaymentTest from "@/pages/payment-test";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={ModernHome} />
        <Route path="/home" component={HomePage} />
        <Route path="/events/:id" component={EnhancedEventPage} />
        <Route path="/enhanced-event" component={EnhancedEventPage} />
        <Route path="/enhanced-event/:id" component={EnhancedEventPage} />
        <Route path="/ai-party-designer" component={AIPartyDesigner} />
        <Route path="/ar-space-planner" component={ARSpacePlanner} />
        <Route path="/livestream-companion" component={LivestreamCompanion} />
        <Route path="/ai-vibe-analyzer" component={AIVibeAnalyzer} />
        <Route path="/sustainability-tracker" component={SustainabilityTracker} />
        <Route path="/host-achievements" component={HostAchievements} />
        <Route path="/smart-scheduling" component={SmartScheduling} />
        <Route path="/live-music-voting" component={LiveMusicVoting} />
        <Route path="/nightclub-experience" component={NightclubExperience} />
        <Route path="/interactive-drink-payment" component={InteractiveDrinkPayment} />
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
        <Route path="/virtual-meeting-platform" component={VirtualMeetingPlatform} />
        <Route path="/seat-tracker" component={InteractiveSeatTracker} />
        <Route path="/interactive-seat-tracker" component={InteractiveSeatTracker} />
        <Route path="/party-hall-decorator" component={PartyHallDecorator} />
        <Route path="/decorator" component={PartyHallDecorator} />
        <Route path="/venue-showcase" component={NaturalVenueShowcase} />
        <Route path="/natural-venue-showcase" component={NaturalVenueShowcase} />
        <Route path="/social-design-studio" component={SocialDesignStudio} />
        <Route path="/design-studio" component={SocialDesignStudio} />
        <Route path="/vibe-invite-system" component={VibeInviteSystem} />
        <Route path="/complete-invite-workflow" component={CompleteInviteWorkflow} />
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
        <Route path="/staffing-marketplace" component={EnhancedStaffingMarketplace} />
        <Route path="/catering-marketplace" component={CateringMarketplace} />
        <Route path="/vibe-mall" component={VibeMall} />
        <Route path="/pro-host-control" component={ProHostControlPanel} />
        <Route path="/party-quest" component={PartyQuestGamified} />
        <Route path="/corporate-dashboard" component={CorporateDashboard} />
        <Route path="/loyalty-rewards" component={LoyaltyRewards} />
        <Route path="/professional-tools" component={ProfessionalTools} />
        <Route path="/playful-discovery" component={PlayfulEventDiscovery} />
        <Route path="/event-soundtrack-generator" component={EventSoundtrackGenerator} />
        <Route path="/event-verification-badges" component={EventVerificationBadges} />
        <Route path="/social-story-templates" component={SocialStoryTemplates} />
        <Route path="/interactive-mood-visualizer" component={InteractiveMoodVisualizer} />
        <Route path="/gamified-attendance-rewards" component={GamifiedAttendanceRewards} />
        <Route path="/voice-activated-assistant" component={VoiceActivatedAssistant} />
        <Route path="/interactive-live-vibes-invite" component={InteractiveLiveVibesInvite} />
        <Route path="/invite/:invitationId" component={InteractiveLiveVibesInvite} />
        <Route path="/complete-invite-workflow" component={CompleteInviteWorkflow} />
        <Route path="/vibescard-studio" component={VibesCardStudioNew} />
        <Route path="/interactive-design-generator" component={InteractiveDesignGenerator} />
        <Route path="/ecosystem-dashboard" component={EcosystemDashboard} />
        <Route path="/enterprise-suite" component={EnterpriseSuite} />
        <Route path="/system-overview" component={SystemOverview} />
        <Route path="/vibe-control" component={VibeControl} />
        <Route path="/ar-party-overlays" component={ARPartyOverlays} />
        <Route path="/ai-personalized-recommendations" component={AIPersonalizedRecommendations} />
        <Route path="/ai-party-media-suite" component={AIPartyMediaSuite} />
        <Route path="/global-vibe-passport" component={GlobalVibePassport} />
        <Route path="/collaborative-design-sharing" component={CollaborativeDesignSharing} />
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
        <Route path="/system-interconnection" component={SystemInterconnection} />
        <Route path="/live-reaction-walls" component={LiveReactionWalls} />
        <Route path="/reaction-walls" component={LiveReactionWalls} />
        <Route path="/payment-test" component={PaymentTest} />
        
        {/* Authentication Routes */}
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/signup" component={Signup} />
        <Route path="/signin" component={Login} />
        <Route path="/register" component={Signup} />
        
        {/* Legacy Routes */}
        <Route path="/login" component={SimpleLoginPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <InstallPrompt />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
