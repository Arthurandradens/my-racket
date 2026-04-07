"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            My Racket
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/quiz"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              Quiz
            </Link>
            <Link
              href="/raquetes"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              Raquetes
            </Link>
            <Link
              href="/comparar"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              Comparar
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link
              href="/quiz"
              className="py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Quiz
            </Link>
            <Link
              href="/raquetes"
              className="py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Raquetes
            </Link>
            <Link
              href="/comparar"
              className="py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Comparar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
