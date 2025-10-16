import { SparkleEffectType } from "../types";

/**
 * Adjusts color brightness based on intensity
 */
export function adjustColorIntensity(color: string, intensity: number): string {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const adjustedR = Math.round(r * intensity + 255 * (1 - intensity));
  const adjustedG = Math.round(g * intensity + 255 * (1 - intensity));
  const adjustedB = Math.round(b * intensity + 255 * (1 - intensity));

  return `#${adjustedR.toString(16).padStart(2, "0")}${adjustedG
    .toString(16)
    .padStart(2, "0")}${adjustedB.toString(16).padStart(2, "0")}`;
}

/**
 * Adjusts an entire palette based on intensity
 */
export function adjustPaletteIntensity(
  palette: string[],
  intensity: number
): string[] {
  return palette.map((color) => adjustColorIntensity(color, intensity));
}

/**
 * Creates a sparkle effect element
 */
export function createSparkleElement(
  x: number | string,
  y: number | string,
  color: string,
  className: string = ""
): HTMLDivElement {
  const sparkle = document.createElement("div");
  sparkle.className = `fixed pointer-events-none z-50 w-2 h-2 rounded-full animate-ping ${className}`;
  sparkle.style.backgroundColor = color;
  sparkle.style.left = typeof x === "number" ? `${x}px` : x;
  sparkle.style.top = typeof y === "number" ? `${y}px` : y;
  return sparkle;
}

/**
 * Creates multiple sparkle effects across the screen
 */
export function createSparkleEffect(
  type: SparkleEffectType,
  count: number = 8,
  duration: number = 2000
): void {
  const colors: Record<SparkleEffectType, string> = {
    share: "bg-blue-400",
    achievement: "bg-yellow-400",
    collaboration: "bg-purple-400",
    mood: "bg-pink-400",
  };

  Array.from({ length: count }).forEach((_, index) => {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.className = `fixed pointer-events-none z-50 w-3 h-3 ${colors[type]} rounded-full animate-ping`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      document.body.appendChild(sparkle);

      setTimeout(() => {
        if (document.body.contains(sparkle)) {
          document.body.removeChild(sparkle);
        }
      }, duration);
    }, index * 150);
  });
}

/**
 * Creates a single sparkle at a random position
 */
export function createRandomSparkle(
  duration: number = 1000,
  color: string = "bg-yellow-400"
): void {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  const sparkle = document.createElement("div");
  sparkle.className = `fixed pointer-events-none z-50 w-2 h-2 ${color} rounded-full animate-ping`;
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  document.body.appendChild(sparkle);

  setTimeout(() => {
    if (document.body.contains(sparkle)) {
      document.body.removeChild(sparkle);
    }
  }, duration);
}

/**
 * Removes all sparkle elements from the DOM
 */
export function cleanupSparkles(): void {
  const sparkles = document.querySelectorAll(
    ".fixed.pointer-events-none.animate-ping"
  );
  sparkles.forEach((sparkle) => {
    if (document.body.contains(sparkle)) {
      document.body.removeChild(sparkle);
    }
  });
}
