import Link from "next/link";

export default function AnnulationPage() {
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
      <div style={{ maxWidth: "400px" }}>
        <h1
          style={{
            fontSize:     "14px",
            fontWeight:   300,
            color:        "var(--text)",
            marginBottom: "16px",
          }}
        >
          Paiement annulé
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
          Votre paiement n&apos;a pas été finalisé. Aucun montant n&apos;a été prélevé.
          <br />
          Vous pouvez recommencer votre précommande à tout moment.
        </p>
        <Link
          href="/boutique/tierra-de-gigantes"
          style={{
            display:        "inline-block",
            fontSize:       "12px",
            fontWeight:     300,
            color:          "var(--text)",
            border:         "1px solid var(--text)",
            padding:        "10px 20px",
            letterSpacing:  "0.06em",
            textDecoration: "none",
            marginBottom:   "16px",
          }}
        >
          Réessayer
        </Link>
        <br />
        <Link
          href="/boutique"
          style={{
            fontSize:   "12px",
            fontWeight: 300,
            color:      "var(--details)",
          }}
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
