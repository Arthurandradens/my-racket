"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Racket } from "@/lib/types";
import { getRacketBySlug, searchRackets } from "@/lib/rackets";
import CompareTable from "@/components/CompareTable";
import racketData from "@/data/rackets.json";

const MAX_RACKETS = 3;
const allRackets = racketData as Racket[];

export default function CompararPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<Racket[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Racket[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize from URL query param "r"
  useEffect(() => {
    const r = searchParams.get("r");
    if (r) {
      const slugs = r
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_RACKETS);
      const initialRackets = slugs
        .map((slug) => getRacketBySlug(allRackets, slug))
        .filter((r): r is Racket => r !== null);
      setSelected(initialRackets);
    }
  }, [searchParams]);

  // Search
  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const found = searchRackets(allRackets, query.trim()).slice(0, 8);
    setResults(found);
    setShowDropdown(true);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateURL = useCallback(
    (rackets: Racket[]) => {
      const slugs = rackets.map((r) => r.slug).join(",");
      const params = new URLSearchParams(searchParams.toString());
      if (slugs) {
        params.set("r", slugs);
      } else {
        params.delete("r");
      }
      router.replace(`/comparar?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  function addRacket(racket: Racket) {
    if (selected.length >= MAX_RACKETS) return;
    if (selected.some((r) => r.slug === racket.slug)) return;
    const next = [...selected, racket];
    setSelected(next);
    setQuery("");
    setShowDropdown(false);
    updateURL(next);
  }

  function removeRacket(slug: string) {
    const next = selected.filter((r) => r.slug !== slug);
    setSelected(next);
    updateURL(next);
  }

  const matchSlug = searchParams.get("match") ?? undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
          Comparador de raquetes
        </h1>
        <p className="text-gray-500 text-lg">
          Selecione até 3 raquetes para comparar lado a lado.
        </p>
      </div>

      {/* Search + chips */}
      <div className="flex flex-col gap-4">
        {/* Search input */}
        {selected.length < MAX_RACKETS && (
          <div ref={searchRef} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar raquete por nome ou marca..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                {results.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => addRacket(r)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center justify-between gap-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                        {r.brand}
                      </span>
                      <p className="text-sm font-medium text-gray-900">{r.model}</p>
                    </div>
                    {r.price_brl && (
                      <span className="text-xs text-gray-500 shrink-0">
                        R$ {r.price_brl.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {showDropdown && results.length === 0 && query.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 px-4 py-3 text-sm text-gray-500">
                Nenhuma raquete encontrada
              </div>
            )}
          </div>
        )}

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((r) => (
              <div
                key={r.slug}
                className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full"
              >
                <span>{r.brand} {r.model}</span>
                <button
                  type="button"
                  onClick={() => removeRacket(r.slug)}
                  className="text-green-600 hover:text-green-900 leading-none"
                  aria-label={`Remover ${r.model}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare table or empty state */}
      {selected.length > 0 ? (
        <CompareTable rackets={selected} matchSlug={matchSlug} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium text-lg">Nenhuma raquete selecionada</p>
          <p className="text-gray-400 text-sm max-w-xs">
            Use a busca acima para adicionar raquetes à comparação.
          </p>
        </div>
      )}
    </div>
  );
}
