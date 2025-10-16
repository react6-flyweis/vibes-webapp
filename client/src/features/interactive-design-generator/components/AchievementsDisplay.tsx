import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, TrendingUp } from "lucide-react";
import { Achievement } from "../types";

interface AchievementsDisplayProps {
  achievements: Achievement[];
  animationTriggers: Set<string>;
  totalPoints: number;
  unlockedCount: number;
  progressPercentage: number;
}

export function AchievementsDisplay({
  achievements,
  animationTriggers,
  totalPoints,
  unlockedCount,
  progressPercentage,
}: AchievementsDisplayProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`transition-all ${
              achievement.unlocked
                ? "bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800"
                : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            } ${
              animationTriggers.has(achievement.id)
                ? "animate-pulse scale-105"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div
                  className={`text-2xl ${
                    achievement.unlocked ? "" : "grayscale opacity-50"
                  }`}
                >
                  {achievement.icon}
                </div>
                <div>
                  <p
                    className={
                      achievement.unlocked
                        ? "text-yellow-800 dark:text-yellow-200"
                        : "text-gray-500"
                    }
                  >
                    {achievement.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Trophy
                      className={`h-4 w-4 ${
                        achievement.unlocked
                          ? "text-yellow-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="text-sm">{achievement.points} points</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <Badge variant="default" className="mt-2 bg-yellow-600">
                  <Award className="h-3 w-3 mr-1" />
                  Unlocked
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Total Progress</span>
                <span className="text-sm text-gray-600">
                  {unlockedCount} / {achievements.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {totalPoints}
                </p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {unlockedCount}
                </p>
                <p className="text-sm text-gray-600">Unlocked</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {progressPercentage}%
                </p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
