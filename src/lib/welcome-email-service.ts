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

interface WelcomeEmailData {
  productName: string;
  creditsAdded: number;
  totalCredits: number;
  amount: number;
  password?: string;
  newAccount?: boolean;
}

export async function sendWelcomeEmail(
  email: string,
  paymentData: WelcomeEmailData
): Promise<boolean> {
  if (!process.env.EMAIL_USER && !process.env.GMAIL_USER) {
    console.warn("[Email] SMTP non configurato, email benvenuto ignorata");
    return false;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://checktarga.it";
  const subject = paymentData.newAccount
    ? `Benvenuto su ${SITE.name} — il tuo account è attivo`
    : `Conferma acquisto — ${SITE.name}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
    <h1 style="color:#0f766e;margin-bottom:16px;">Benvenuto su ${SITE.name}</h1>
    <p style="color:#4b5563;line-height:1.6;">
      Il tuo acquisto <strong>${paymentData.productName}</strong> è stato confermato.
      Hai ricevuto <strong>${paymentData.creditsAdded} crediti</strong> report.
    </p>
    <div style="background:#f0fdfa;padding:20px;border-radius:8px;margin:20px 0;">
      <p><strong>Importo:</strong> ${paymentData.amount.toFixed(2)} €</p>
      <p><strong>Crediti totali:</strong> ${paymentData.totalCredits}</p>
    </div>
    ${
      paymentData.newAccount && paymentData.password
        ? `
    <div style="background:#fef3c7;padding:20px;border-radius:8px;margin:20px 0;">
      <h3 style="margin-top:0;color:#92400e;">I tuoi accessi</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${paymentData.password}</p>
      <p style="font-size:12px;color:#92400e;">Conserva queste credenziali in un luogo sicuro.</p>
    </div>`
        : ""
    }
    <div style="text-align:center;margin-top:32px;">
      <a href="${siteUrl}/account" style="background:#0f766e;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
        Vai all'area personale
      </a>
    </div>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: {
      name: SITE.name,
      address: process.env.EMAIL_USER || process.env.GMAIL_USER || SITE.supportEmail,
    },
    to: email,
    subject,
    html: htmlContent,
    text: `Benvenuto su ${SITE.name}. Crediti aggiunti: ${paymentData.creditsAdded}. Accedi su ${siteUrl}/account`,
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
      console.error("[Email] Errore invio benvenuto:", error);
    }
  }

  return false;
}
