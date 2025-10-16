import { useState, useCallback } from "react";
import { Achievement } from "../types";
import {
  ACHIEVEMENTS_LIST,
  ACHIEVEMENT_ANIMATION_DURATION,
} from "../constants";
import { useToast } from "@/hooks/use-toast";

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    // Initialize with some unlocked achievements for demo
    return ACHIEVEMENTS_LIST.map((achievement, index) => ({
      ...achievement,
      unlocked: index < 2,
    }));
  });
  const [animationTriggers, setAnimationTriggers] = useState(new Set<string>());
  const { toast } = useToast();

  const unlockAchievement = useCallback(
    (achievementId: string) => {
      setAchievements((prev) => {
        const achievement = prev.find((a) => a.id === achievementId);

        if (achievement && !achievement.unlocked) {
          setAnimationTriggers((prevTriggers) => {
            const newSet = new Set(prevTriggers);
            newSet.add(achievementId);
            return newSet;
          });

          toast({
            title: "Achievement Unlocked!",
            description: `${achievement.name} - ${achievement.description}`,
          });

          // Remove animation trigger after delay
          setTimeout(() => {
            setAnimationTriggers((prevTriggers) => {
              const newSet = new Set(prevTriggers);
              newSet.delete(achievementId);
              return newSet;
            });
          }, ACHIEVEMENT_ANIMATION_DURATION);

          return prev.map((a) =>
            a.id === achievementId ? { ...a, unlocked: true } : a
          );
        }

        return prev;
      });
    },
    [toast]
  );

  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const progressPercentage = Math.round(
    (unlockedCount / achievements.length) * 100
  );

  return {
    achievements,
    animationTriggers,
    unlockAchievement,
    totalPoints,
    unlockedCount,
    progressPercentage,
  };
}
