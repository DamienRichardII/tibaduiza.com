import Link from "next/link";
import { boutique } from "@/data/boutique";

const sidebarLinks = [
  { href: "/boutique/tirages", label: "Tirages" },
  { href: "/boutique/cartes-postales", label: "Cartes postales" },
  { href: "/boutique/tierra-de-gigantes", label: "Tierra de gigantes" },
];

const livre = boutique.find((c) => c.id === "tierra-de-gigantes")?.produits[0];
const featured = boutique.find((c) => c.id === "tirages")?.produits[2];

export default function BoutiquePage() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          padding: "40px 24px",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sidebarLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "13px",
                fontWeight: 300,
                color: "var(--text)",
                letterSpacing: "0.02em",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Nouveauté */}
        {livre && (
          <div style={{ marginTop: "48px" }}>
            <Link href="/boutique/tierra-de-gigantes/livre">
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
                  style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    backgroundColor: "var(--text)",
                    color: "var(--bg)",
                    fontSize: "10px",
                    padding: "2px 6px",
                    letterSpacing: "0.05em",
                  }}
                >
                  Nouveauté
                </div>
              </div>
              <p style={{ fontSize: "11px", fontWeight: 300, color: "var(--text)" }}>
                {livre.title}
              </p>
              <p style={{ fontSize: "11px", color: "var(--details)" }}>{livre.price}</p>
            </Link>
            <Link
              href="/boutique/tierra-de-gigantes/livre"
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
              Ajouter
            </Link>
          </div>
        )}
      </aside>

      {/* Main: featured photo */}
      <main style={{ position: "relative" }}>
        {featured && (
          <Link
            href={`/boutique/tirages/${featured.id}`}
            style={{ display: "block", height: "100%" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.src}
              alt={featured.title}
              style={{
                width: "100%",
                height: "calc(100vh - 56px)",
                objectFit: "cover",
              }}
            />
          </Link>
        )}
      </main>
    </div>
  );
}
