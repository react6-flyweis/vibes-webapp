import { useState, useEffect } from "react";
import { MoodType } from "../types";
import { MOOD_PALETTES } from "../constants";
import { adjustPaletteIntensity } from "../utils/color-utils";

export function useMoodPalette(initialMood: MoodType = "energetic") {
  const [currentMood, setCurrentMood] = useState<MoodType>(initialMood);
  const [moodIntensity, setMoodIntensity] = useState([70]);
  const [colorPalette, setColorPalette] = useState<string[]>([]);

  const generateMoodPalette = () => {
    const basePalette = MOOD_PALETTES[currentMood] || MOOD_PALETTES.energetic;
    const intensity = moodIntensity[0] / 100;
    const adjustedPalette = adjustPaletteIntensity(basePalette, intensity);
    setColorPalette(adjustedPalette);
  };

  useEffect(() => {
    generateMoodPalette();
  }, [currentMood, moodIntensity]);

  return {
    currentMood,
    setCurrentMood,
    moodIntensity,
    setMoodIntensity,
    colorPalette,
    generateMoodPalette,
  };
}
