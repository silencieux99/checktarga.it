import nodemailer from "nodemailer";
import { SITE } from "./pricing";

const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || process.env.EMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

interface OrderConfirmationData {
  email: string;
  orderId: string;
  productName: string;
  amount: string;
  sku: string;
  credits: number;
  totalCredits: number;
  password?: string;
  newAccount?: boolean;
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationData
): Promise<boolean> {
  if (!process.env.EMAIL_USER && !process.env.GMAIL_USER) {
    console.warn("[Email] SMTP non configurato, email conferma ignorata");
    return false;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://checktarga.it";
  const subject = `Conferma ordine #${data.orderId.slice(0, 8)} — ${SITE.name}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
    <h1 style="color:#0f766e;">Ordine confermato</h1>
    <p style="color:#4b5563;">Grazie per il tuo acquisto su ${SITE.name}.</p>
    <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;">
      <p><strong>Ordine:</strong> #${data.orderId.slice(0, 12)}</p>
      <p><strong>Prodotto:</strong> ${data.productName}</p>
      <p><strong>Importo:</strong> ${data.amount} €</p>
      <p><strong>Crediti aggiunti:</strong> ${data.credits}</p>
      <p><strong>Saldo crediti:</strong> ${data.totalCredits}</p>
    </div>
    ${
      data.newAccount && data.password
        ? `
    <div style="background:#dbeafe;padding:20px;border-radius:8px;margin:20px 0;">
      <h3 style="margin-top:0;color:#1e40af;">Accesso area personale</h3>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Password:</strong> ${data.password}</p>
    </div>`
        : ""
    }
    <div style="text-align:center;margin-top:32px;">
      <a href="${siteUrl}/account" style="background:#0f766e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
        Genera il tuo report
      </a>
    </div>
    <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
      Assistenza: ${SITE.supportEmail}
    </p>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: {
      name: SITE.name,
      address: process.env.EMAIL_USER || process.env.GMAIL_USER || SITE.supportEmail,
    },
    to: data.email,
    subject,
    html: htmlContent,
    text: `Ordine confermato su ${SITE.name}. Crediti: +${data.credits}. Totale: ${data.totalCredits}.`,
  };

  try {
    await smtpTransporter.sendMail(mailOptions);
    return true;
  } catch {
    try {
      if (process.env.GMAIL_USER || process.env.EMAIL_USER) {
        await gmailTransporter.sendMail(mailOptions);
        return true;
      }
    } catch (error) {
      console.error("[Email] Errore invio conferma:", error);
    }
  }

  return false;
}
