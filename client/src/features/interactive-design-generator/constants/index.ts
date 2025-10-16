import { MoodType, Achievement, OnboardingStep } from "../types";

export const MOOD_PALETTES: Record<MoodType, string[]> = {
  energetic: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  calm: ["#74B9FF", "#A29BFE", "#6C5CE7", "#81ECEC", "#00B894"],
  creative: ["#FD79A8", "#E84393", "#E17055", "#FDCB6E", "#F0932B"],
  professional: ["#2D3436", "#636E72", "#74B9FF", "#0984E3", "#00B894"],
  romantic: ["#FD79A8", "#FF7675", "#FDCB6E", "#E17055", "#A29BFE"],
  mysterious: ["#2D3436", "#636E72", "#6C5CE7", "#A29BFE", "#74B9FF"],
  playful: ["#FDCB6E", "#E17055", "#00B894", "#00CEC9", "#FF7675"],
  elegant: ["#2D3436", "#B2BEC3", "#DDD6FE", "#C7ECEE", "#FEF3C7"],
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: "first_design",
    name: "First Creation",
    description: "Created your first design",
    icon: "🎨",
    unlocked: false,
    points: 10,
  },
  {
    id: "palette_master",
    name: "Palette Master",
    description: "Generated 10 color palettes",
    icon: "🌈",
    unlocked: false,
    points: 25,
  },
  {
    id: "story_teller",
    name: "Story Teller",
    description: "Generated your first story",
    icon: "📖",
    unlocked: false,
    points: 15,
  },
  {
    id: "collaborator",
    name: "Team Player",
    description: "Collaborated with others",
    icon: "👥",
    unlocked: false,
    points: 20,
  },
  {
    id: "mood_explorer",
    name: "Mood Explorer",
    description: "Tried all mood types",
    icon: "🎭",
    unlocked: false,
    points: 30,
  },
  {
    id: "design_wizard",
    name: "Design Wizard",
    description: "Created 50 designs",
    icon: "🧙‍♂️",
    unlocked: false,
    points: 100,
  },
];

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to Interactive Design Studio",
    description:
      "Let's create something amazing together! First, tell us about your mood.",
    action: "mood",
  },
  {
    title: "Choose Your Style",
    description: "What design aesthetic speaks to you today?",
    action: "style",
  },
  {
    title: "Set Your Creative Intensity",
    description: "How bold do you want your designs to be?",
    action: "intensity",
  },
  {
    title: "Ready to Create!",
    description: "You're all set! Let's start designing.",
    action: "complete",
  },
];

export const MOOD_DESCRIPTIONS: Record<MoodType, string> = {
  energetic: "Vibrant and dynamic colors for high-energy designs",
  calm: "Soothing blues and greens for peaceful compositions",
  creative: "Bold and expressive colors for artistic projects",
  professional: "Clean and sophisticated tones for business use",
  romantic: "Warm and passionate colors for intimate designs",
  mysterious: "Deep and enigmatic shades for intrigue",
  playful: "Fun and cheerful colors for joyful creations",
  elegant: "Refined and graceful tones for luxury appeal",
};

export const DEFAULT_BRUSH_SIZE = 6;
export const MAX_UNDO_STACK_SIZE = 20;
export const SPARKLE_INTERVAL = 3000;
export const SPARKLE_ANIMATION_DURATION = 1000;
export const ACHIEVEMENT_ANIMATION_DURATION = 3000;
