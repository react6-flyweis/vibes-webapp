/**
 * Canvas utility functions
 */

/**
 * Sets up canvas with proper DPI scaling
 */
export function setupCanvas(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.scale(dpr, dpr);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  return ctx;
}

/**
 * Gets pointer position relative to canvas
 */
export function getCanvasPosition(
  canvas: HTMLCanvasElement,
  event: PointerEvent
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Draws a line on canvas
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  width: number
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

/**
 * Clears the entire canvas
 */
export function clearCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): void {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
}

/**
 * Exports canvas as data URL
 */
export function exportCanvasAsDataURL(
  canvas: HTMLCanvasElement,
  format: string = "image/png"
): string {
  const rect = canvas.getBoundingClientRect();
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = rect.width;
  exportCanvas.height = rect.height;
  const ectx = exportCanvas.getContext("2d");

  if (ectx) {
    ectx.drawImage(canvas, 0, 0, rect.width, rect.height);
  }

  return exportCanvas.toDataURL(format);
}

/**
 * Restores canvas from data URL
 */
export function restoreCanvasFromDataURL(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  dataUrl: string
): void {
  const rect = canvas.getBoundingClientRect();
  const img = new Image();

  img.onload = () => {
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
  };

  img.src = dataUrl;
}

/**
 * Creates a snapshot of the current canvas state
 */
export function createCanvasSnapshot(canvas: HTMLCanvasElement): string {
  const rect = canvas.getBoundingClientRect();
  const tmp = document.createElement("canvas");
  tmp.width = rect.width;
  tmp.height = rect.height;
  const tctx = tmp.getContext("2d");

  if (!tctx) return "";

  tctx.drawImage(canvas, 0, 0, rect.width, rect.height);

  try {
    return tmp.toDataURL("image/png");
  } catch (e) {
    return "";
  }
}
