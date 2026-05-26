export const PRESENCE_TIMEOUT_MS = 60_000;

export interface LiveVisitorSession {
  sessionId: string;
  lastActive: number;
  lastPath: string;
  country?: string;
}

export interface LivePageVisitors {
  path: string;
  count: number;
  visitors: LiveVisitorSession[];
}

export interface LivePresenceSnapshot {
  totalOnline: number;
  pages: LivePageVisitors[];
  sessions: LiveVisitorSession[];
}

export interface RecentVisitEvent {
  id: string;
  path: string;
  ts: number;
  sessionId?: string;
  country?: string;
  trafficSource?: string;
}

function isChecktargaSite(siteId: unknown) {
  return !siteId || siteId === "checktarga.it";
}

export function aggregateLivePresence(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>,
  now = Date.now()
): LivePresenceSnapshot {
  const pageMap = new Map<string, LivePageVisitors>();
  const sessions: LiveVisitorSession[] = [];

  docs.forEach((doc) => {
    const data = doc.data();
    if (!isChecktargaSite(data.siteId)) return;

    const lastActive = Number(data.lastActive || 0);
    if (!lastActive || now - lastActive > PRESENCE_TIMEOUT_MS) return;

    const lastPath = String(data.lastPath || "/");
    const session: LiveVisitorSession = {
      sessionId: doc.id,
      lastActive,
      lastPath,
      country: data.country ? String(data.country) : undefined,
    };

    sessions.push(session);

    if (!pageMap.has(lastPath)) {
      pageMap.set(lastPath, { path: lastPath, count: 0, visitors: [] });
    }

    const page = pageMap.get(lastPath)!;
    page.count += 1;
    page.visitors.push(session);
  });

  const pages = Array.from(pageMap.values()).sort((a, b) => b.count - a.count);

  return {
    totalOnline: sessions.length,
    pages,
    sessions,
  };
}

export function countryFlag(country?: string) {
  switch ((country || "").toUpperCase()) {
    case "IT":
      return "🇮🇹";
    case "FR":
      return "🇫🇷";
    case "ES":
      return "🇪🇸";
    case "DE":
      return "🇩🇪";
    case "GB":
    case "UK":
      return "🇬🇧";
    case "PT":
      return "🇵🇹";
    case "NL":
      return "🇳🇱";
    case "BE":
      return "🇧🇪";
    case "CH":
      return "🇨🇭";
    default:
      return "🌍";
  }
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/prezzi": "Prezzi",
  "/login": "Login",
  "/account": "Area personale",
  "/checkout": "Checkout",
  "/checkout/success": "Pagamento confermato",
  "/esempio-report": "Esempio report",
  "/blog": "Blog",
  "/privacy": "Privacy",
  "/termini": "Termini",
  "/note-legali": "Note legali",
};

export function getPageLabel(path: string) {
  const basePath = path.split("?")[0] || "/";
  if (PAGE_NAMES[basePath]) return PAGE_NAMES[basePath];
  if (basePath.startsWith("/informe/")) return "Report veicolo";
  if (basePath.startsWith("/admin")) return "Admin";
  return basePath;
}

export function formatTimeAgo(ts: number, now = Date.now()) {
  const seconds = Math.max(0, Math.floor((now - ts) / 1000));
  if (seconds < 5) return "adesso";
  if (seconds < 60) return `${seconds}s fa`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min fa`;
  return `${Math.floor(minutes / 60)} h fa`;
}
