export type MoodType =
  | "energetic"
  | "calm"
  | "creative"
  | "professional"
  | "romantic"
  | "mysterious"
  | "playful"
  | "elegant";

export type DesignStyle =
  | "modern"
  | "vintage"
  | "minimalist"
  | "artistic"
  | "corporate"
  | "whimsical";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  points: number;
}

export interface OnboardingStep {
  title: string;
  description: string;
  action: string;
}

export interface Collaborator {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

export interface DesignElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  properties: Record<string, any>;
}

export interface SharedContent {
  id: number;
  type: "story" | "palette" | "design";
  content: string;
  mood: MoodType;
  style: DesignStyle;
  colorPalette?: string[];
  sharedAt: string;
  sharedBy: string;
  timestamp?: string;
}

export interface GroupMember {
  name?: string;
  email?: string;
  rsvpStatus?: string;
  avatar?: string;
}

export interface EventContext {
  title?: string;
  date?: string;
  location?: string;
  [key: string]: any;
}

export interface SparklePosition {
  x: number;
  y: number;
}

export type SparkleEffectType =
  | "share"
  | "achievement"
  | "collaboration"
  | "mood";

export interface CanvasState {
  isDrawing: boolean;
  brushColor: string;
  brushSize: number;
  undoStack: string[];
  redoStack: string[];
}

export interface StoryGenerationRequest {
  prompt: string;
  mood: MoodType;
  style: DesignStyle;
  colorPalette: string[];
  eventId?: number;
  groupContext?: boolean;
}

export interface StoryGenerationResponse {
  story: string;
  imageUrl?: string;
}
