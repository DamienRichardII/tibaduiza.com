import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Elisabeth Tibaduiza Manosalva",
  robots: "noindex, nofollow",
};

/**
 * Layout admin — sans Navbar ni CartProvider.
 * Protégé par mot de passe ADMIN_SECRET côté client.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight:       "100vh",
        backgroundColor: "#f5f5f3",
        color:           "#0b0b0b",
        fontFamily:      "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
