"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-bg-elevated border-b border-surface" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display text-xl font-bold text-accent uppercase tracking-wider hover:text-primary transition-colors"
          >
            My Racket
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/quiz" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Quiz</Link>
            <Link href="/raquetes" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Raquetes</Link>
            <Link href="/comparar" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Comparar</Link>
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary transition-colors"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-surface bg-bg-elevated">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link href="/quiz" className="py-3 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-primary hover:bg-bg-subtle transition-colors" onClick={() => setMenuOpen(false)}>Quiz</Link>
            <Link href="/raquetes" className="py-3 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-primary hover:bg-bg-subtle transition-colors" onClick={() => setMenuOpen(false)}>Raquetes</Link>
            <Link href="/comparar" className="py-3 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-primary hover:bg-bg-subtle transition-colors" onClick={() => setMenuOpen(false)}>Comparar</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
