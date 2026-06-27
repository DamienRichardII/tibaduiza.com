"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    src: "/travaux/p3_nb_ufo.jpg",
    href: "/travaux/noir-et-blanc",
    label: "Noir et blanc",
  },
  {
    src: "/travaux/p4_nb_foret.jpg",
    href: "/travaux/noir-et-blanc",
    label: "Noir et blanc",
  },
  {
    src: "/travaux/p5_nb_sculpture.jpg",
    href: "/travaux/noir-et-blanc",
    label: "Noir et blanc",
  },
  {
    src: "/travaux/p1_nb_homme.jpg",
    href: "/travaux/noir-et-blanc",
    label: "Noir et blanc",
  },
  {
    src: "/travaux/p2_couleur_paris.jpg",
    href: "/travaux/couleurs",
    label: "Couleurs",
  },
  {
    src: "/travaux/p6_louvre.jpg",
    href: "/travaux/couleurs",
    label: "Couleurs",
  },
  {
    src: "/travaux/p7_colombie.jpg",
    href: "/travaux/couleurs",
    label: "Couleurs",
  },
  {
    src: "/travaux/p8_bapteme.jpg",
    href: "/travaux/couleurs",
    label: "Couleurs",
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
      {/* Photos centrées — chaque lien couvre toute la zone */}
      {slides.map((slide, i) => (
        <Link
          key={i}
          href={slide.href}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
            pointerEvents: i === current ? "auto" : "none",
          }}
          tabIndex={i === current ? 0 : -1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.label}
            style={{
              maxHeight: "70vh",
              maxWidth: "min(560px, 60vw)",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>
      ))}

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

      {/* Bas gauche — catégorie */}
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

      {/* Bas droite — compteur X/N */}
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
