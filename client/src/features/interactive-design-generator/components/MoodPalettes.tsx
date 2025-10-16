import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodType } from "../types";
import { MOOD_PALETTES, MOOD_DESCRIPTIONS } from "../constants";
import { MoodIcon } from "./MoodIcon";

interface MoodPalettesProps {
  currentMood: MoodType;
  onMoodSelect: (mood: MoodType) => void;
}

export function MoodPalettes({ currentMood, onMoodSelect }: MoodPalettesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(MOOD_PALETTES).map(([mood, colors]) => (
        <Card
          key={mood}
          className={`cursor-pointer transition-all hover:scale-105 ${
            currentMood === mood ? "ring-2 ring-purple-500" : ""
          }`}
          onClick={() => onMoodSelect(mood as MoodType)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              <MoodIcon mood={mood as MoodType} />
              {mood}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 mb-3">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-8 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {MOOD_DESCRIPTIONS[mood as MoodType]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
