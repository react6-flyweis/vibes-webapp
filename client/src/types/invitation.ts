export interface InvitationEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  hostName: string;
  hostAvatar: string;
  coverImage: string;
  category:
    | "birthday"
    | "wedding"
    | "corporate"
    | "party"
    | "cultural"
    | "nightclub";
  capacity: number;
  ticketPrice?: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  dresscode?: string;
  ageRestriction?: number;
  amenities: string[];
  culturalTheme?: string;
  vibesTags: string[];
  sustainabilityScore?: number;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  category:
    | "classic"
    | "modern"
    | "cultural"
    | "ar-enhanced"
    | "nft-exclusive"
    | "interactive";
  thumbnail: string;
  previewImages: string[];
  features: string[];
  isPremium: boolean;
  culturalRegion?: string;
  arElements?: string[];
  nftIntegration?: boolean;
  interactiveFeatures?: string[];
  musicIntegration?: boolean;
  gamificationLevel?: "basic" | "medium" | "advanced";
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  tier?: "vip" | "premium" | "general";
  dietary?: string[];
  plusOnes?: number;
  rsvpStatus?: "pending" | "accepted" | "declined" | "maybe";
  accessLevel?: "full" | "limited" | "preview";
  nftPassId?: string;
  loyaltyPoints?: number;
}

export interface InvitationPreview {
  template: InvitationTemplate;
  event: InvitationEvent;
  customizations: {
    colors: string[];
    fonts: string[];
    animations: boolean;
    musicPreview?: string;
    arExperience?: boolean;
    nftPassPreview?: boolean;
    gamificationElements?: boolean;
    culturalElements?: string[];
    sustainabilityBadges?: boolean;
  };
}

export type StepType =
  | "event"
  | "template"
  | "customize"
  | "guests"
  | "preview"
  | "send";
