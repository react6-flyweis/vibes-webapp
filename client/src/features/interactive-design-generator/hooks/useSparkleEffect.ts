import { useEffect, useRef } from "react";
import { createRandomSparkle, cleanupSparkles } from "../utils/color-utils";
import { SPARKLE_INTERVAL, SPARKLE_ANIMATION_DURATION } from "../constants";

export function useSparkleEffect() {
  const sparkleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    sparkleIntervalRef.current = setInterval(() => {
      createRandomSparkle(SPARKLE_ANIMATION_DURATION);
    }, SPARKLE_INTERVAL);

    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
      }
      cleanupSparkles();
    };
  }, []);

  return null;
}
