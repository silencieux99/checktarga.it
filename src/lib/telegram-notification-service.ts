interface TelegramNotificationData {
  orderId: string;
  productName: string;
  amount: number;
  customerEmail: string;
  sku: string;
  creditsAdded?: number;
  newAccount?: boolean;
  connectedUser?: boolean;
  currency?: string;
  country?: string;
}

async function getTodayStats(): Promise<{ totalRevenue: number; totalOrders: number }> {
  try {
    const { getAdminDb } = await import("./firebase-admin");
    const db = getAdminDb();
    if (!db) return { totalRevenue: 0, totalOrders: 0 };

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startTimestamp = startOfDay.getTime();

    const ordersSnapshot = await db
      .collection("orders")
      .where("paidAt", ">=", startTimestamp)
      .get();

    let totalRevenue = 0;
    let totalOrders = 0;

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      if ((data.status === "COMPLETE" || data.status === "paid") && data.amount) {
        totalRevenue += data.amount;
        totalOrders++;
      }
    });

    return { totalRevenue, totalOrders };
  } catch {
    return { totalRevenue: 0, totalOrders: 0 };
  }
}

export async function sendTelegramOrderNotification(
  data: TelegramNotificationData
): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("[Telegram] Token o chat ID non configurati");
      return;
    }

    const { totalRevenue, totalOrders } = await getTodayStats();
    const amountFormatted = (data.amount / 100).toFixed(2);
    const totalRevenueFormatted = (totalRevenue / 100).toFixed(2);
    const accountType = data.newAccount
      ? "NUOVO CLIENTE"
      : data.connectedUser
        ? "CLIENTE ESISTENTE"
        : "OSPITE";

    const message = `
🇮🇹 CheckTarga.it: €${amountFormatted}

${accountType}
${data.productName}

CLIENTE: ${data.customerEmail}
${data.creditsAdded ? `CREDITI: +${data.creditsAdded}` : ""}

━━━━━━━━━━━━━━━━━━━━
TOTALE GIORNO
Ricavi: €${totalRevenueFormatted}
Ordini: ${totalOrders}
━━━━━━━━━━━━━━━━━━━━

${new Date().toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}
    `.trim();

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Telegram] Errore API:", errorData);
    }
  } catch (error) {
    console.error("[Telegram] Errore invio notifica:", error);
  }
}

export async function sendTelegramErrorNotification(
  error: string,
  context?: string
): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return;

    const message = `🚨 ERRORE CheckTarga\n\n${context ? `${context}\n` : ""}${error}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
  } catch {
    // ignore
  }
}
