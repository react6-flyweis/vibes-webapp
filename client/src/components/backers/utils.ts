export function copyFullLink(short: string) {
  const full =
    typeof window !== "undefined" ? window.location.origin + short : short;
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {
    return navigator.clipboard.writeText(full);
  }

  // fallback for older browsers
  return new Promise<void>((resolve) => {
    const el = document.createElement("textarea");
    el.value = full;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
    resolve();
  });
}

export function downloadQR(short: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='#fff' stroke='#000'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='14'>QR for ${short}</text></svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${short
    .replace(/[^a-z0-9_-]/gi, "")
    .replace(/^\//, "")}-qr.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
