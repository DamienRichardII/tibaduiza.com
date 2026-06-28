"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface OrderSummary {
  order_number: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  currency: string;
  customer_email: string;
  delivery_mode: string;
}

function SuccesContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/orders/${sessionId}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d.order ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const price =
    order ? (order.total_amount / 100).toFixed(2).replace(".", ",") + " €" : "45,00 €";

  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        minHeight:      "calc(100vh - 56px)",
        padding:        "40px clamp(16px, 5vw, 40px)",
        textAlign:      "center",
      }}
    >
      <div style={{ maxWidth: "440px" }}>
        {/* Icône */}
        <div
          style={{
            width:           "48px",
            height:          "48px",
            borderRadius:    "50%",
            backgroundColor: "rgba(114,1,1,0.08)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            margin:          "0 auto 28px",
            fontSize:        "20px",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize:     "14px",
            fontWeight:   300,
            color:        "var(--text)",
            marginBottom: "16px",
            letterSpacing: "0.01em",
          }}
        >
          Précommande confirmée
        </h1>

        <p
          style={{
            fontSize:     "13px",
            fontWeight:   300,
            color:        "var(--details)",
            lineHeight:   "1.7",
            marginBottom: "32px",
          }}
        >
          {loading ? (
            "Chargement des détails..."
          ) : order ? (
            <>
              Merci pour votre précommande de <em>Tierra de gigantes</em> ({price}).
              <br />
              Un email de confirmation a été envoyé à{" "}
              <strong style={{ color: "var(--text)" }}>{order.customer_email}</strong>.
            </>
          ) : (
            <>
              Votre paiement a bien été validé. Un email de confirmation vous a été envoyé.
            </>
          )}
        </p>

        {order && (
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.03)",
              padding:         "16px 20px",
              marginBottom:    "32px",
              textAlign:       "left",
            }}
          >
            <p
              style={{
                fontSize:     "11px",
                fontWeight:   300,
                color:        "var(--details)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Numéro de commande
            </p>
            <p
              style={{
                fontSize:   "13px",
                fontWeight: 300,
                color:      "var(--text)",
                marginBottom: "12px",
              }}
            >
              {order.order_number}
            </p>
            <p
              style={{
                fontSize:   "12px",
                fontWeight: 300,
                color:      "var(--details)",
                lineHeight: "1.6",
              }}
            >
              {order.delivery_mode === "main-propre"
                ? "Remise en main propre — les modalités vous seront communiquées par email."
                : "Les expéditions débuteront sous un mois. Vous recevrez un email dès que votre livre sera expédié."}
            </p>
          </div>
        )}

        <Link
          href="/boutique"
          style={{
            display:         "inline-block",
            fontSize:        "12px",
            fontWeight:      300,
            color:           "var(--text)",
            border:          "1px solid var(--text)",
            padding:         "10px 20px",
            letterSpacing:   "0.06em",
            textDecoration:  "none",
          }}
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}

export default function SuccesPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            minHeight:      "calc(100vh - 56px)",
            fontSize:       "13px",
            fontWeight:     300,
            color:          "var(--details)",
          }}
        >
          Chargement...
        </div>
      }
    >
      <SuccesContent />
    </Suspense>
  );
}
