"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Racket } from "@/lib/types";
import { getAllRackets, getAllBrands, searchRackets, getRacketsByBrand } from "@/lib/rackets";
import racketData from "@/data/rackets.json";
import AffiliateButton from "@/components/AffiliateButton";

const rackets = racketData as Racket[];
const allRackets = getAllRackets(rackets);
const allBrands = getAllBrands(rackets);

const MAX_DISPLAY = 50;

export default function RaquetesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const filtered = useMemo(() => {
    let result = allRackets;

    if (selectedBrand) {
      result = getRacketsByBrand(result, selectedBrand);
    }

    if (searchQuery.length >= 2) {
      result = searchRackets(result, searchQuery);
      if (selectedBrand) {
        const brandSet = new Set(getRacketsByBrand(allRackets, selectedBrand).map((r) => r.slug));
        result = searchRackets(allRackets, searchQuery).filter((r) => brandSet.has(r.slug));
      }
    }

    return result.slice(0, MAX_DISPLAY);
  }, [searchQuery, selectedBrand]);

  const totalRackets = allRackets.length;
  const totalBrands = allBrands.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-text uppercase tracking-wide mb-2">
          Catálogo de raquetes
        </h1>
        <p className="text-text-secondary text-base">
          {totalRackets} raquetes de {totalBrands} marcas
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Buscar raquetes</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por marca ou modelo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-subtle border border-surface rounded-lg px-4 py-2.5 text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
        <div className="sm:w-56">
          <label htmlFor="brand" className="sr-only">Filtrar por marca</label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-bg-subtle border border-surface rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            <option value="">Todas as marcas</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-text-muted mb-4">
        {filtered.length === 0
          ? "Nenhuma raquete encontrada"
          : `Exibindo ${filtered.length}${filtered.length === MAX_DISPLAY ? "+" : ""} raquetes`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((racket) => (
            <CatalogCard key={racket.slug} racket={racket} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-text-muted">
          <p className="text-lg font-medium">Nenhuma raquete encontrada.</p>
          <p className="text-sm mt-1">Tente ajustar sua busca ou filtro de marca.</p>
        </div>
      )}
    </div>
  );
}

function CatalogCard({ racket }: { racket: Racket }) {
  const { slug, brand, model, weight, head_size, ra, price_brl, image_url } = racket;

  const specChips: string[] = [];
  if (weight !== null) specChips.push(`${weight}g`);
  if (head_size) specChips.push(`${head_size} in²`);
  if (ra) specChips.push(`RA ${ra}`);

  return (
    <div className="bg-bg-elevated border border-surface rounded-lg hover:border-primary/30 transition-all duration-300 p-5 flex flex-col gap-4 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)]">
      {/* Racket image */}
      {image_url && (
        <div className="flex justify-center overflow-hidden rounded bg-white p-3 h-44">
          <img src={image_url} alt={`${brand} ${model}`} className="w-full h-full object-contain" loading="lazy" />
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-0.5">{brand}</p>
        <Link href={`/raquete/${slug}`} className="text-base font-bold text-text hover:text-primary transition-colors leading-snug">
          {model}
        </Link>
      </div>

      {specChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specChips.map((chip) => (
            <span key={chip} className="bg-bg-subtle text-text-secondary text-xs font-medium px-3 py-1 rounded">{chip}</span>
          ))}
        </div>
      )}

      {price_brl !== null && (
        <p className="text-base font-bold text-text">
          R$ {price_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      )}

      <div className="mt-auto">
        <AffiliateButton slug={slug} brand={brand} model={model} />
      </div>
    </div>
  );
}
