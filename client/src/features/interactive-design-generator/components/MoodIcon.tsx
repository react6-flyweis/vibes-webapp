import { MoodType } from "../types";
import {
  Zap,
  Moon,
  Brush,
  Target,
  Heart,
  Eye,
  Star,
  Crown,
  Sparkles,
} from "lucide-react";

interface MoodIconProps {
  mood: MoodType;
  className?: string;
}

export function MoodIcon({ mood, className = "h-5 w-5" }: MoodIconProps) {
  const icons: Record<MoodType, JSX.Element> = {
    energetic: <Zap className={className} />,
    calm: <Moon className={className} />,
    creative: <Brush className={className} />,
    professional: <Target className={className} />,
    romantic: <Heart className={className} />,
    mysterious: <Eye className={className} />,
    playful: <Star className={className} />,
    elegant: <Crown className={className} />,
  };

  return icons[mood] || <Sparkles className={className} />;
}
