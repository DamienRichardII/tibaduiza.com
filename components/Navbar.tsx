"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

const navLinks = [
  { href: "/travaux", label: "Travaux" },
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "A propos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();

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
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "13px",
          fontWeight: 300,
          letterSpacing: "0.01em",
          color: "var(--text)",
        }}
      >
        Elisabeth Tibaduiza Manosalva
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
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
    </header>
  );
}
