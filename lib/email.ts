import { Resend } from "resend";
import type { Order } from "./database.types";
import {
  orderConfirmationHtml,
  adminNewOrderHtml,
  shippingConfirmationHtml,
} from "@/emails/templates";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY manquant.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.FROM_EMAIL ?? "commandes@tibaduizaeli.com";
const ADMIN = process.env.ADMIN_EMAIL ?? "tibaduizaelipro@gmail.com";
const SITE = process.env.SITE_NAME ?? "Elisabeth Tibaduiza Manosalva";

/** Formate un montant en centimes → "45,00 €" */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

/** Formate une date ISO → "28 juin 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Email de confirmation au client après paiement confirmé.
 * Anti-doublon : à appeler uniquement si customer_email_sent_at IS NULL.
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  try {
    await resend.emails.send({
      from: `${SITE} <${FROM}>`,
      to: order.customer_email,
      subject: `Confirmation de votre précommande — ${SITE}`,
      html: orderConfirmationHtml(order),
    });
  } catch (err) {
    // Une erreur email ne doit jamais bloquer une commande payée
    console.error("[email] Erreur confirmation client", order.order_number, err);
  }
}

/**
 * Email de notification admin après paiement confirmé.
 * Anti-doublon : à appeler uniquement si admin_email_sent_at IS NULL.
 */
export async function sendAdminNewOrderEmail(order: Order): Promise<void> {
  try {
    await resend.emails.send({
      from: `${SITE} <${FROM}>`,
      to: ADMIN,
      subject: `Nouvelle précommande — ${order.order_number}`,
      html: adminNewOrderHtml(order),
    });
  } catch (err) {
    console.error("[email] Erreur notification admin", order.order_number, err);
  }
}

/**
 * Email d'expédition au client quand order_status passe à "shipped".
 * Anti-doublon : à appeler uniquement si shipping_email_sent_at IS NULL.
 */
export async function sendShippingConfirmationEmail(order: Order): Promise<void> {
  try {
    await resend.emails.send({
      from: `${SITE} <${FROM}>`,
      to: order.customer_email,
      subject: `Votre livre est en route ! — ${order.order_number}`,
      html: shippingConfirmationHtml(order),
    });
  } catch (err) {
    console.error("[email] Erreur expédition", order.order_number, err);
  }
}
