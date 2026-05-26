export const ADMIN_DATA_CHANGED = "admin-data-changed";

export function notifyAdminDataChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_DATA_CHANGED));
  sessionStorage.setItem("admin-data-version", String(Date.now()));
}

export function readAdminDataVersion() {
  if (typeof window === "undefined") return "0";
  return sessionStorage.getItem("admin-data-version") || "0";
}
