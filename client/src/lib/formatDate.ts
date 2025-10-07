export type DateInput = Date | string | number | null | undefined;

// Format a date into a friendly readable string, e.g. "Saturday, October 4, 2025"
export function formatDate(date: DateInput): string {
  if (!date) return "Date TBD";

  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format a Date into the compact UTC string used for calendar feeds: YYYYMMDDTHHMMSSZ
export function formatDateForCalendar(date: DateInput): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const min = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());

  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
}
