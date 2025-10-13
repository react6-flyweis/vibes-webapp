import { useEffect, useRef, useState } from "react";

export default function useStageSize(
  canvasRef: React.RefObject<HTMLElement>,
  selectedPlatform: any
) {
  const [stageSize, setStageSize] = useState({ width: 800, height: 450 });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const resize = () => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.max(300, Math.floor(rect.width));

      // parse aspect ratio like "16:9" or fallback to 16/9
      let aspect = 16 / 9;
      try {
        if (
          selectedPlatform?.aspectRatio &&
          typeof selectedPlatform.aspectRatio === "string"
        ) {
          const parts = selectedPlatform.aspectRatio.split(":");
          if (parts.length === 2) {
            const a = parseFloat(parts[0]) || 16;
            const b = parseFloat(parts[1]) || 9;
            aspect = a / b;
          }
        }
      } catch (e) {
        aspect = 16 / 9;
      }

      // make the canvas square (user requested lower height and square)
      const height = 350;
      if (mounted.current) setStageSize({ width, height });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      mounted.current = false;
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, selectedPlatform]);

  return stageSize;
}
