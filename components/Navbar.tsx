"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartContext";

// "/travaux" temporairement retiré de la navigation (code conservé dans app/travaux/)
const navLinks = [
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "A propos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "var(--bg)",
        padding: "0 clamp(16px, 4vw, 24px)",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontSize: "clamp(11px, 2.5vw, 13px)",
          fontWeight: 300,
          letterSpacing: "0.01em",
          color: "var(--text)",
          flexShrink: 0,
        }}
      >
        Elisabeth Tibaduiza Manosalva
      </Link>

      {/* Navigation desktop */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(16px, 4vw, 32px)",
        }}
        className="nav-desktop"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: "13px",
              fontWeight: 300,
              letterSpacing: "0.05em",
              color: isActive(link.href) ? "var(--accent)" : "var(--text)",
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}
        {count > 0 && (
          <Link
            href="/boutique/panier"
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text)",
            }}
          >
            Panier ({count})
          </Link>
        )}
      </nav>

      {/* Bouton hamburger (mobile uniquement) */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="nav-hamburger"
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          color: "var(--text)",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: "fixed",
            top: "56px",
            left: 0,
            right: 0,
            backgroundColor: "var(--bg)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            padding: "16px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            zIndex: 49,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "14px",
                fontWeight: 300,
                letterSpacing: "0.04em",
                color: isActive(link.href) ? "var(--accent)" : "var(--text)",
              }}
            >
              {link.label}
            </Link>
          ))}
          {count > 0 && (
            <Link
              href="/boutique/panier"
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: "14px", fontWeight: 300, color: "var(--text)" }}
            >
              Panier ({count})
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
