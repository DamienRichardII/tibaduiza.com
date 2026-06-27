"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Photos des slides 9-16 du design Canva (à remplacer par les vraies images)
// Pour l'instant : placeholders Unsplash dans le même style éditorial
const slides = [
  {
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1600&q=85",
    href: "/travaux/noir-et-blanc",
    label: "Noir et blanc",
  },
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=85",
    href: "/travaux/noir-et-blanc",
    label: "Danse",
  },
  {
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&q=85",
    href: "/travaux/noir-et-blanc",
    label: "Portraits N&B",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=85",
    href: "/travaux/couleurs",
    label: "Couleurs",
  },
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600&q=85",
    href: "/travaux/couleurs",
    label: "Portraits couleurs",
  },
  {
    src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1600&q=85",
    href: "/travaux/couleurs",
    label: "Reportage",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85",
    href: "/travaux/tierra-de-gigantes",
    label: "Tierra de Gigantes",
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=85",
    href: "/travaux/tierra-de-gigantes",
    label: "Tierra de Gigantes",
  },
];

export default function TravauxPage() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 56px)",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <Link
          key={i}
          href={slide.href}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.7s ease-in-out",
            display: "block",
          }}
          tabIndex={i === current ? 0 : -1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Link>
      ))}

      {/* Flèche gauche */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); setPaused(false); }}
        aria-label="Photo précédente"
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.7)",
          fontSize: "24px",
          padding: "12px",
          lineHeight: 1,
        }}
      >
        ←
      </button>

      {/* Flèche droite */}
      <button
        onClick={(e) => { e.preventDefault(); next(); setPaused(false); }}
        aria-label="Photo suivante"
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.7)",
          fontSize: "24px",
          padding: "12px",
          lineHeight: 1,
        }}
      >
        →
      </button>

      {/* Compteur X/N — bas droite */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "24px",
          zIndex: 20,
          fontSize: "12px",
          fontWeight: 300,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.08em",
        }}
      >
        {current + 1}/{total}
      </div>

      {/* Label catégorie — bas gauche */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "24px",
          zIndex: 20,
          fontSize: "12px",
          fontWeight: 300,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {slides[current].label}
      </div>

      {/* Barre de progression */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: "rgba(255,255,255,0.15)",
          zIndex: 20,
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.6)",
            width: `${((current + 1) / total) * 100}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
