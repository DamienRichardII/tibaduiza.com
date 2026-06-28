import type { Order } from "@/lib/database.types";
import { formatPrice, formatDate } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tibaduizaeli.com";
const SUPPORT = process.env.SUPPORT_EMAIL ?? "tibaduizaelipro@gmail.com";

/** Styles communs inline */
const base = `
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #F8F7F5;
  color: #0b0b0b;
`;
const container = `
  max-width: 560px;
  margin: 0 auto;
  padding: 40px 24px;
`;
const heading = `
  font-size: 14px;
  font-weight: 400;
  margin: 0 0 32px 0;
  color: #0b0b0b;
  letter-spacing: 0.02em;
`;
const label = `
  font-size: 11px;
  font-weight: 400;
  color: #272525;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 4px 0;
`;
const value = `
  font-size: 13px;
  font-weight: 300;
  color: #0b0b0b;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;
const divider = `
  border: none;
  border-top: 1px solid rgba(0,0,0,0.1);
  margin: 24px 0;
`;
const badge = `
  display: inline-block;
  background-color: #720101;
  color: #fff;
  font-size: 10px;
  font-weight: 400;
  padding: 3px 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 28px;
`;
const footer = `
  font-size: 11px;
  font-weight: 300;
  color: #272525;
  line-height: 1.6;
  margin-top: 32px;
`;

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${base}">
  <div style="${container}">
    <p style="font-size:12px;font-weight:300;color:#272525;margin:0 0 40px 0;letter-spacing:0.04em;">
      Elisabeth Tibaduiza Manosalva
    </p>
    ${body}
    <hr style="${divider}">
    <p style="${footer}">
      Pour toute question : <a href="mailto:${SUPPORT}" style="color:#0b0b0b;">${SUPPORT}</a><br>
      <a href="${SITE_URL}" style="color:#272525;">${SITE_URL}</a>
    </p>
  </div>
</body>
</html>`;
}

/** Adresse de livraison formatée */
function shippingAddress(order: Order): string {
  if (order.delivery_mode === "main-propre") {
    return "Remise en main propre (Île-de-France) — les modalités vous seront communiquées par email.";
  }
  const lines = [
    `${order.shipping_first_name} ${order.shipping_last_name}`,
    order.shipping_address_line1,
    order.shipping_address_line2,
    `${order.shipping_postal_code} ${order.shipping_city}`,
    order.shipping_country,
  ]
    .filter(Boolean)
    .join("<br>");
  return lines;
}

// ─────────────────────────────────────────────────────────
// 1. Email de confirmation client
// ─────────────────────────────────────────────────────────
export function orderConfirmationHtml(order: Order): string {
  const body = `
    <h1 style="${heading}">Votre précommande est confirmée.</h1>
    <div style="${badge}">Précommande</div>

    <p style="font-size:13px;font-weight:300;color:#0b0b0b;line-height:1.7;margin:0 0 24px 0;">
      Merci ${order.customer_first_name}, votre paiement a bien été validé.
      Votre exemplaire de <em>Tierra de gigantes</em> est réservé.
    </p>

    <hr style="${divider}">

    <p style="${label}">Numéro de commande</p>
    <p style="${value}">${order.order_number}</p>

    <p style="${label}">Date</p>
    <p style="${value}">${formatDate(order.created_at)}</p>

    <p style="${label}">Produit</p>
    <p style="${value}">${order.product_name}<br>
      <span style="color:#272525;">Quantité : ${order.quantity} — ${formatPrice(order.total_amount)}</span>
    </p>

    <p style="${label}">Livraison</p>
    <p style="${value}">${shippingAddress(order)}</p>

    ${order.stripe_receipt_url ? `
    <p style="${label}">Reçu de paiement</p>
    <p style="${value}"><a href="${order.stripe_receipt_url}" style="color:#0b0b0b;">Voir le reçu Stripe</a></p>
    ` : ""}

    <hr style="${divider}">

    <p style="font-size:13px;font-weight:300;color:#272525;line-height:1.7;margin:0;">
      Les expéditions débuteront sous un mois, le temps de finaliser les précommandes et de lancer la production.
      Vous recevrez un email dès que votre livre sera expédié.
    </p>
  `;
  return wrap(body);
}

// ─────────────────────────────────────────────────────────
// 2. Email de notification admin
// ─────────────────────────────────────────────────────────
export function adminNewOrderHtml(order: Order): string {
  const body = `
    <h1 style="${heading}">Nouvelle précommande reçue.</h1>

    <p style="${label}">Commande</p>
    <p style="${value}">${order.order_number} — ${formatDate(order.created_at)}</p>

    <p style="${label}">Client</p>
    <p style="${value}">
      ${order.customer_first_name} ${order.customer_last_name}<br>
      ${order.customer_email}<br>
      ${order.customer_phone ?? "Téléphone non renseigné"}
    </p>

    <p style="${label}">Mode de livraison</p>
    <p style="${value}">${order.delivery_mode === "main-propre" ? "Remise en main propre (Île-de-France)" : "Livraison à domicile"}</p>

    <p style="${label}">Adresse</p>
    <p style="${value}">${shippingAddress(order)}</p>

    <hr style="${divider}">

    <p style="${label}">Produit</p>
    <p style="${value}">${order.product_name} × ${order.quantity}</p>

    <p style="${label}">Montant payé</p>
    <p style="${value}">${formatPrice(order.total_amount)} ${order.currency.toUpperCase()}</p>

    <p style="${label}">Statut paiement</p>
    <p style="${value}">${order.payment_status}</p>

    <p style="${label}">Statut commande</p>
    <p style="${value}">${order.order_status}</p>

    <hr style="${divider}">

    <p style="${label}">Stripe</p>
    <p style="${value}">
      Session : ${order.stripe_checkout_session_id ?? "—"}<br>
      PaymentIntent : ${order.stripe_payment_intent_id ?? "—"}
    </p>

    ${order.stripe_receipt_url ? `
    <p style="${value}"><a href="${order.stripe_receipt_url}" style="color:#0b0b0b;">Voir le reçu Stripe</a></p>
    ` : ""}
  `;
  return wrap(body);
}

// ─────────────────────────────────────────────────────────
// 3. Email d'expédition client
// ─────────────────────────────────────────────────────────
export function shippingConfirmationHtml(order: Order): string {
  const body = `
    <h1 style="${heading}">Votre livre est en route !</h1>

    <p style="font-size:13px;font-weight:300;color:#0b0b0b;line-height:1.7;margin:0 0 24px 0;">
      Bonjour ${order.customer_first_name}, votre exemplaire de <em>Tierra de gigantes</em> a été expédié.
    </p>

    <hr style="${divider}">

    <p style="${label}">Numéro de commande</p>
    <p style="${value}">${order.order_number}</p>

    ${order.carrier_name ? `
    <p style="${label}">Transporteur</p>
    <p style="${value}">${order.carrier_name}</p>
    ` : ""}

    ${order.tracking_number ? `
    <p style="${label}">Numéro de suivi</p>
    <p style="${value}">
      ${order.tracking_url
        ? `<a href="${order.tracking_url}" style="color:#0b0b0b;">${order.tracking_number}</a>`
        : order.tracking_number}
    </p>
    ` : ""}

    <p style="${label}">Adresse de livraison</p>
    <p style="${value}">${shippingAddress(order)}</p>

    <hr style="${divider}">

    <p style="font-size:13px;font-weight:300;color:#272525;line-height:1.7;margin:0;">
      Merci pour votre confiance. En cas de problème avec votre livraison, n'hésitez pas à nous contacter.
    </p>
  `;
  return wrap(body);
}
