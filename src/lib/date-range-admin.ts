const TIMEZONE = "Europe/Rome";

export function getTodayLocal(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

export function dateStrLocal(ts: number): string {
  return new Date(ts).toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

export function startOfDayLocal(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const isDST = isRomeDST(y, m - 1, d);
  const offsetHours = isDST ? 2 : 1;
  return Date.UTC(y, m - 1, d, -offsetHours, 0, 0);
}

export function endOfDayLocal(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const isDST = isRomeDST(y, m - 1, d);
  const offsetHours = isDST ? 2 : 1;
  return Date.UTC(y, m - 1, d, 24 - offsetHours, 59, 59, 999);
}

function isRomeDST(year: number, month: number, day: number): boolean {
  const lastSunMar = 31 - new Date(Date.UTC(year, 2, 31)).getUTCDay();
  const lastSunOct = 31 - new Date(Date.UTC(year, 9, 31)).getUTCDay();
  const marChange = Date.UTC(year, 2, lastSunMar, 1, 0, 0);
  const octChange = Date.UTC(year, 9, lastSunOct, 1, 0, 0);
  const d = Date.UTC(year, month, day, 12, 0, 0);
  return d >= marChange && d < octChange;
}

export function getDaysBetween(startDate: string, endDate: string): string[] {
  const out: string[] = [];
  const start = new Date(startDate + "T12:00:00.000Z");
  const end = new Date(endDate + "T12:00:00.000Z");
  const cur = new Date(start);
  while (cur <= end) {
    const y = cur.getUTCFullYear();
    const m = String(cur.getUTCMonth() + 1).padStart(2, "0");
    const d = String(cur.getUTCDate()).padStart(2, "0");
    out.push(`${y}-${m}-${d}`);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

export type PeriodPreset = "today" | "last_7_days" | "last_30_days";

export interface DateRange {
  from: number;
  to: number;
  startDate: string;
  endDate: string;
  period: PeriodPreset | "custom";
}

export function getRangeForPreset(preset: PeriodPreset): DateRange {
  const now = Date.now();
  const today = getTodayLocal();
  const midnight = startOfDayLocal(today);
  const dayMs = 24 * 3600 * 1000;

  switch (preset) {
    case "today":
      return { from: midnight, to: now, startDate: today, endDate: today, period: "today" };
    case "last_7_days": {
      const from = now - 7 * dayMs;
      return {
        from,
        to: now,
        startDate: dateStrLocal(from),
        endDate: today,
        period: "last_7_days",
      };
    }
    case "last_30_days": {
      const from = now - 30 * dayMs;
      return {
        from,
        to: now,
        startDate: dateStrLocal(from),
        endDate: today,
        period: "last_30_days",
      };
    }
    default:
      return { from: midnight, to: now, startDate: today, endDate: today, period: "today" };
  }
}

export function getRangeForCustom(startDate: string, endDate: string): DateRange {
  return {
    from: startOfDayLocal(startDate),
    to: endOfDayLocal(endDate),
    startDate,
    endDate,
    period: "custom",
  };
}
