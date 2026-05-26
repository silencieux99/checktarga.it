import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, verifyAdmin } from "@/lib/firebase-admin";
import { firestoreApiErrorResponse } from "@/lib/firestore-index-error";

export const runtime = "nodejs";

function isPaidStatus(status: string) {
  return ["paid", "complete", "succeeded", "completed"].includes(status.toLowerCase());
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token mancante" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accesso non autorizzato" }, { status: 403 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database non disponibile" }, { status: 503 });
    }

    const ordersSnap = await db.collection("orders").orderBy("createdAt", "desc").limit(2000).get();
    const clientsMap = new Map<
      string,
      {
        email: string;
        totalOrders: number;
        totalSpent: number;
        successfulOrders: number;
        firstOrderDate: number;
        lastOrderDate: number;
        status: "active" | "inactive";
      }
    >();

    ordersSnap.forEach((doc) => {
      const order = doc.data();
      if (order.source === "account_credit") return;
      if (order.site && order.site !== "checktarga.it") return;
      if (!order.customerEmail) return;

      const email = String(order.customerEmail).toLowerCase();
      const orderAmount = Number(order.amount || 0);
      const orderDate = Number(order.createdAt || 0);
      const successful = isPaidStatus(String(order.status || ""));

      if (!clientsMap.has(email)) {
        clientsMap.set(email, {
          email,
          totalOrders: 0,
          totalSpent: 0,
          successfulOrders: 0,
          firstOrderDate: orderDate,
          lastOrderDate: orderDate,
          status: "inactive",
        });
      }

      const client = clientsMap.get(email)!;
      client.totalOrders += 1;
      if (successful) {
        client.successfulOrders += 1;
        client.totalSpent += orderAmount;
      }
      if (orderDate < client.firstOrderDate) client.firstOrderDate = orderDate;
      if (orderDate > client.lastOrderDate) client.lastOrderDate = orderDate;
    });

    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const clients = Array.from(clientsMap.values()).map((client) => ({
      ...client,
      totalSpent: client.totalSpent / 100,
      status: client.lastOrderDate > ninetyDaysAgo ? "active" : "inactive",
    }));

    clients.sort((a, b) => b.lastOrderDate - a.lastOrderDate);

    const totalClients = clients.length;
    const activeClients = clients.filter((client) => client.status === "active").length;
    const returningClients = clients.filter((client) => client.totalOrders > 1).length;
    const totalSpent = clients.reduce((sum, client) => sum + client.totalSpent, 0);

    return NextResponse.json({
      success: true,
      clients: clients.slice(0, 500),
      stats: {
        totalClients,
        activeClients,
        returningClients,
        avgLifetimeValue: totalClients > 0 ? totalSpent / totalClients : 0,
      },
    });
  } catch (error) {
    return firestoreApiErrorResponse(error, "[admin/clients]");
  }
}
