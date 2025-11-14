import nodemailer from "nodemailer";
import { ENV, smtpConfigured } from "../env";
import { getSiteSettings } from "./siteSettingsService";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!smtpConfigured) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: ENV.smtp.host,
      port: ENV.smtp.port ?? 587,
      secure: ENV.smtp.secure ?? false,
      auth: ENV.smtp.user && ENV.smtp.pass ? { user: ENV.smtp.user, pass: ENV.smtp.pass } : undefined,
    });
  }
  return transporter;
}

export type OrderNotificationPayload = {
  status: "success" | "failed";
  orderNumber?: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  errorMessage?: string;
};

function formatAmount(amount: number) {
  return `${(amount / 100).toFixed(2)} TL`;
}

export async function sendOrderNotification(payload: OrderNotificationPayload) {
  const transporterInstance = getTransporter();
  if (!transporterInstance) {
    console.warn("SMTP configuration missing; skipping email notification");
    return;
  }

  const settings = await getSiteSettings();
  const recipient = settings.notificationEmail || settings.contactEmail || ENV.smtp.user;
  if (!recipient) {
    console.warn("No notification email configured; skipping email notification");
    return;
  }

  const subject =
    payload.status === "success"
      ? `[Premium Candles] Yeni Sipariş Onayı - ${payload.orderNumber ?? ""}`
      : `[Premium Candles] Ödeme Başarısız`;

  const html = payload.status === "success"
    ? `<p>Merhaba,</p>
       <p>Yeni bir sipariş başarıyla oluşturuldu.</p>
       <ul>
         <li><strong>Sipariş Numarası:</strong> ${payload.orderNumber ?? "-"}</li>
         <li><strong>Tutar:</strong> ${formatAmount(payload.totalAmount)}</li>
         <li><strong>Müşteri:</strong> ${payload.customerName} (${payload.customerEmail})</li>
       </ul>
       <p>Detayları yönetici panelinden görüntüleyebilirsiniz.</p>`
    : `<p>Merhaba,</p>
       <p>Bir ödeme denemesi başarısız oldu.</p>
       <ul>
         <li><strong>Müşteri:</strong> ${payload.customerName} (${payload.customerEmail})</li>
         <li><strong>Tutar:</strong> ${formatAmount(payload.totalAmount)}</li>
         <li><strong>Hata:</strong> ${payload.errorMessage ?? "Bilinmiyor"}</li>
       </ul>
       <p>İlgili kullanıcı ile iletişime geçmeniz önerilir.</p>`;

  await transporterInstance.sendMail({
    from: ENV.smtp.user ?? recipient,
    to: recipient,
    subject,
    html,
  });
}
