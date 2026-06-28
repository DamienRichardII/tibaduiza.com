import Link from "next/link";
import { boutique } from "@/data/boutique";

const livre = boutique.find((c) => c.id === "tierra-de-gigantes")?.produits[0];

export default function BoutiquePage() {
  return (
    <div
      className="boutique-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      {/* Sidebar */}
      <aside
        className="boutique-aside"
        style={{
          padding: "40px 24px",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Link
          href="/boutique/tierra-de-gigantes"
          style={{
            fontSize: "13px",
            fontWeight: 300,
            color: "var(--text)",
            letterSpacing: "0.02em",
          }}
        >
          Tierra de gigantes
        </Link>

        {/* Card livre */}
        {livre && (
          <div style={{ marginTop: "8px" }}>
            <Link href="/boutique/tierra-de-gigantes">
              <div
                style={{
                  position: "relative",
                  marginBottom: "8px",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={livre.src}
                  alt={livre.title}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
                />
                {/* Badge précommande */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    backgroundColor: "var(--accent)",
                    color: "#fff",
                    fontSize: "9px",
                    padding: "2px 6px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Précommande
                </div>
              </div>
              <p style={{ fontSize: "11px", fontWeight: 300, color: "var(--text)" }}>
                {livre.title}
              </p>
              <p style={{ fontSize: "11px", color: "var(--details)" }}>{livre.price}</p>
            </Link>
            <Link
              href="/boutique/tierra-de-gigantes"
              style={{
                display: "inline-block",
                marginTop: "8px",
                fontSize: "11px",
                fontWeight: 300,
                color: "var(--text)",
                border: "1px solid var(--text)",
                padding: "4px 10px",
              }}
            >
              Précommander
            </Link>
          </div>
        )}
      </aside>

      {/* Main : vidéo Timeline 3 */}
      <main style={{ position: "relative", overflow: "hidden" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "calc(100vh - 56px)",
            objectFit: "cover",
            display: "block",
          }}
        >
          <source src="/videos/timeline3.mp4" type="video/mp4" />
          <source src="/videos/timeline3.mov" type="video/quicktime" />
        </video>

        {/* Bandeau délai précommande */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 24px",
            backgroundColor: "rgba(248,247,245,0.92)",
            backdropFilter: "blur(4px)",
            fontSize: "11px",
            fontWeight: 300,
            color: "var(--details)",
            letterSpacing: "0.03em",
            lineHeight: "1.5",
          }}
        >
          Les livres sont actuellement proposés en précommande.
          Les expéditions commenceront sous un mois, le temps de finaliser les précommandes et de lancer la production.
        </div>
      </main>
    </div>
  );
}
