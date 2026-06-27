"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=85",
    href: "/travaux/noir-et-blanc",
    label: "Noir et blanc",
  },
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=85",
    href: "/travaux/noir-et-blanc",
    label: "Danse",
  },
  {
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=85",
    href: "/travaux/noir-et-blanc",
    label: "Portraits N&B",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85",
    href: "/travaux/couleurs",
    label: "Couleurs",
  },
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85",
    href: "/travaux/couleurs",
    label: "Portraits couleurs",
  },
  {
    src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=85",
    href: "/travaux/couleurs",
    label: "Reportage",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85",
    href: "/travaux/tierra-de-gigantes",
    label: "Tierra de Gigantes",
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=85",
    href: "/travaux/tierra-de-gigantes",
    label: "Tierra de Gigantes",
  },
];

export default function TravauxPage() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  // Navigation clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 56px)",
        backgroundColor: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Zone photo centrale */}
      <div
        style={{
          position: "relative",
          height: "72vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {slides.map((slide, i) => (
          <Link
            key={i}
            href={slide.href}
            style={{
              position: "absolute",
              opacity: i === current ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
              pointerEvents: i === current ? "auto" : "none",
              display: "block",
              height: "100%",
            }}
            tabIndex={i === current ? 0 : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.label}
              style={{
                height: "100%",
                width: "auto",
                maxWidth: "min(480px, 55vw)",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Link>
        ))}
      </div>

      {/* Flèche gauche */}
      <button
        onClick={() => { prev(); setPaused(false); }}
        aria-label="Précédent"
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: "var(--details)",
          padding: "12px",
          zIndex: 10,
          lineHeight: 1,
        }}
      >
        ←
      </button>

      {/* Flèche droite */}
      <button
        onClick={() => { next(); setPaused(false); }}
        aria-label="Suivant"
        style={{
          position: "absolute",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: "var(--details)",
          padding: "12px",
          zIndex: 10,
          lineHeight: 1,
        }}
      >
        →
      </button>

      {/* Bas gauche — label */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          fontSize: "12px",
          fontWeight: 300,
          color: "var(--details)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {slides[current].label}
      </div>

      {/* Bas droite — compteur */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          fontSize: "12px",
          fontWeight: 300,
          color: "var(--details)",
          letterSpacing: "0.06em",
        }}
      >
        {current + 1}/{total}
      </div>
    </div>
  );
}
