import { useEffect, useState } from "react";

// A hook that builds an image cache for given elements and stage size.
export default function useImageCache(
  elements: any[],
  stageSize: { width: number; height: number }
) {
  const [imageCache, setImageCache] = useState<
    Record<string, HTMLImageElement | null>
  >({});

  useEffect(() => {
    const srcs = new Set<string>();
    elements.forEach((el: any) => {
      if (el.type === "image") {
        const s = el.src || el.content;
        if (s) srcs.add(s);
      }
      if (el.type === "background") {
        if (el.style?.backgroundImage) srcs.add(el.style.backgroundImage);
        if (
          el.style?.background &&
          String(el.style.background).trim().startsWith("linear-gradient")
        )
          srcs.add("__grad__" + el.style.background);
      }
    });

    srcs.forEach((src) => {
      if (!src || imageCache[src]) return;

      if (src.startsWith("__grad__")) {
        const gradCss = src.replace("__grad__", "");
        const inner = (function () {
          const start = gradCss.indexOf("(");
          const end = gradCss.lastIndexOf(")");
          if (start >= 0 && end > start)
            return gradCss.substring(start + 1, end).trim();
          return gradCss;
        })();
        const canvas = document.createElement("canvas");
        const w = Math.max(300, stageSize.width);
        const h = Math.max(300, stageSize.width);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          let dirToken: string | null = null;
          let stopsStr = inner;
          const firstComma = inner.indexOf(",");
          if (firstComma !== -1) {
            const possibleDir = inner.substring(0, firstComma).trim();
            if (/^to\b/i.test(possibleDir) || /deg$/.test(possibleDir)) {
              dirToken = possibleDir;
              stopsStr = inner.substring(firstComma + 1).trim();
            }
          }

          const stops: string[] = [];
          let buf = "";
          let depth = 0;
          for (let i = 0; i < stopsStr.length; i++) {
            const ch = stopsStr[i];
            if (ch === "(") depth++;
            if (ch === ")") depth = Math.max(0, depth - 1);
            if (ch === "," && depth === 0) {
              stops.push(buf.trim());
              buf = "";
            } else {
              buf += ch;
            }
          }
          if (buf.trim()) stops.push(buf.trim());

          type Stop = { color: string; pos: number | null };
          const parsed: Stop[] = stops.map((s) => {
            const m = s.match(/(.+?)\s+([0-9]*\.?[0-9]+)%$/);
            if (m)
              return {
                color: m[1].trim(),
                pos: Math.max(0, Math.min(100, parseFloat(m[2]))) / 100,
              };
            return { color: s.trim(), pos: null };
          });

          const filled: Stop[] = parsed.map((p) => ({ ...p }));
          const n = filled.length;
          if (n === 1) {
            filled[0].pos = 0;
          } else {
            if (filled[0].pos == null) filled[0].pos = 0;
            if (filled[n - 1].pos == null) filled[n - 1].pos = 1;
            let i = 0;
            while (i < n) {
              if (filled[i].pos != null) {
                i++;
                continue;
              }
              let j = i + 1;
              while (j < n && filled[j].pos == null) j++;
              const startPos = filled[i - 1].pos ?? 0;
              const endPos = filled[j].pos ?? 1;
              const gap = j - i + 1;
              for (let k = i; k < j; k++) {
                const t = (k - (i - 1)) / gap;
                filled[k].pos = startPos + t * (endPos - startPos);
              }
              i = j;
            }
          }

          let x0 = 0,
            y0 = 0,
            x1 = w,
            y1 = 0;
          if (dirToken) {
            if (/to\s+bottom/i.test(dirToken)) {
              x0 = 0;
              y0 = 0;
              x1 = 0;
              y1 = h;
            }
            if (/to\s+top/i.test(dirToken)) {
              x0 = 0;
              y0 = h;
              x1 = 0;
              y1 = 0;
            }
            if (/to\s+left/i.test(dirToken)) {
              x0 = w;
              y0 = 0;
              x1 = 0;
              y1 = 0;
            }
            if (/to\s+right/i.test(dirToken)) {
              x0 = 0;
              y0 = 0;
              x1 = w;
              y1 = 0;
            }
            const degMatch = dirToken.match(/([0-9.]+)deg/);
            if (degMatch) {
              const deg = parseFloat(degMatch[1]) * (Math.PI / 180);
              const cx = w / 2,
                cy = h / 2;
              const dx = Math.cos(deg),
                dy = Math.sin(deg);
              x0 = cx - dx * w;
              y0 = cy - dy * h;
              x1 = cx + dx * w;
              y1 = cy + dy * h;
            }
          }

          const g = ctx.createLinearGradient(x0, y0, x1, y1);
          filled.forEach((s) => {
            if (s.pos == null) return;
            let colorVal = s.color.replace(/\s+[0-9]*\.?[0-9]+%$/, "").trim();
            try {
              g.addColorStop(s.pos, colorVal);
            } catch (err) {
              const colorOnly = colorVal.split(" ")[0];
              try {
                g.addColorStop(s.pos, colorOnly);
              } catch (e) {
                /* ignore */
              }
            }
          });
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }

        const img = new window.Image();
        img.src = canvas.toDataURL();
        img.onload = () => setImageCache((prev) => ({ ...prev, [src]: img }));
        img.onerror = () => setImageCache((prev) => ({ ...prev, [src]: null }));
        return;
      }

      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => setImageCache((prev) => ({ ...prev, [src]: img }));
      img.onerror = () => setImageCache((prev) => ({ ...prev, [src]: null }));
    });
  }, [elements, stageSize.width]);

  return imageCache;
}
