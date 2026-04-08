"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Racket } from "@/lib/types";
import { getRacketBySlug, searchRackets } from "@/lib/rackets";
import CompareTable from "@/components/CompareTable";
import racketData from "@/data/rackets.json";

const MAX_RACKETS = 3;
const allRackets = racketData as Racket[];

function CompararContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<Racket[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Racket[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = searchParams.get("r");
    if (r) {
      const slugs = r.split(",").map((s) => s.trim()).filter(Boolean).slice(0, MAX_RACKETS);
      const initialRackets = slugs.map((slug) => getRacketBySlug(allRackets, slug)).filter((r): r is Racket => r !== null);
      setSelected(initialRackets);
    }
  }, [searchParams]);

  useEffect(() => {
    if (query.trim().length < 1) { setResults([]); setShowDropdown(false); return; }
    const found = searchRackets(allRackets, query.trim()).slice(0, 8);
    setResults(found);
    setShowDropdown(true);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateURL = useCallback((rackets: Racket[]) => {
    const slugs = rackets.map((r) => r.slug).join(",");
    const params = new URLSearchParams(searchParams.toString());
    if (slugs) { params.set("r", slugs); } else { params.delete("r"); }
    router.replace(`/comparar?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  function addRacket(racket: Racket) {
    if (selected.length >= MAX_RACKETS || selected.some((r) => r.slug === racket.slug)) return;
    const next = [...selected, racket];
    setSelected(next); setQuery(""); setShowDropdown(false); updateURL(next);
  }

  function removeRacket(slug: string) {
    const next = selected.filter((r) => r.slug !== slug);
    setSelected(next); updateURL(next);
  }

  const matchSlug = searchParams.get("match") ?? undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-text uppercase tracking-wide mb-3">
          Comparador de raquetes
        </h1>
        <p className="text-text-secondary text-lg">Selecione ate 3 raquetes para comparar lado a lado.</p>
      </div>

      <div className="flex flex-col gap-4">
        {selected.length < MAX_RACKETS && (
          <div ref={searchRef} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar raquete por nome ou marca..."
              className="w-full bg-bg-subtle border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-surface rounded-lg shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                {results.map((r) => (
                  <button key={r.slug} type="button" onClick={() => addRacket(r)} className="w-full text-left px-4 py-3 hover:bg-bg-subtle transition-colors flex items-center justify-between gap-2 border-b border-surface last:border-b-0">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">{r.brand}</span>
                      <p className="text-sm font-medium text-text">{r.model}</p>
                    </div>
                    {r.price_brl && <span className="text-xs text-text-muted shrink-0">R$ {r.price_brl.toLocaleString("pt-BR")}</span>}
                  </button>
                ))}
              </div>
            )}
            {showDropdown && results.length === 0 && query.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-surface rounded-lg shadow-lg z-20 px-4 py-3 text-sm text-text-muted">
                Nenhuma raquete encontrada
              </div>
            )}
          </div>
        )}

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((r) => (
              <div key={r.slug} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-accent text-sm font-medium px-3 py-1.5 rounded">
                <span>{r.brand} {r.model}</span>
                <button type="button" onClick={() => removeRacket(r.slug)} className="text-primary hover:text-accent leading-none" aria-label={`Remover ${r.model}`}>x</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 ? (
        <CompareTable rackets={selected} matchSlug={matchSlug} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-subtle flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-text-secondary font-medium text-lg">Nenhuma raquete selecionada</p>
          <p className="text-text-muted text-sm max-w-xs">Use a busca acima para adicionar raquetes a comparacao.</p>
        </div>
      )}
    </div>
  );
}

export default function CompararPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-text-secondary text-lg">Carregando comparador...</p></div>}>
      <CompararContent />
    </Suspense>
  );
}
