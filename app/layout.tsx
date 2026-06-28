import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/CartContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Elisabeth Tibaduiza Manosalva",
  description:
    "Photographe française d'origine colombienne basée à Paris — portfolio et boutique.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <body style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
        <CartProvider>
          <Navbar />
          <main style={{ paddingTop: "56px", minHeight: "100vh" }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
