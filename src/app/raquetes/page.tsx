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
      // If brand filter is also applied, intersect
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
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Catalogo de Raquetes
        </h1>
        <p className="text-gray-500 text-base">
          {totalRackets} raquetes de {totalBrands} marcas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Buscar raquetes
          </label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por marca ou modelo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>
        <div className="sm:w-56">
          <label htmlFor="brand" className="sr-only">
            Filtrar por marca
          </label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
          >
            <option value="">Todas as marcas</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length === 0
          ? "Nenhuma raquete encontrada"
          : `Exibindo ${filtered.length}${filtered.length === MAX_DISPLAY ? "+" : ""} raquetes`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((racket) => (
            <RacketCatalogCard key={racket.slug} racket={racket} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg font-medium">Nenhuma raquete encontrada.</p>
          <p className="text-sm mt-1">Tente ajustar sua busca ou filtro de marca.</p>
        </div>
      )}
    </div>
  );
}

function RacketCatalogCard({ racket }: { racket: Racket }) {
  const { slug, brand, model, weight, head_size, ra, price_brl } = racket;

  const specChips: string[] = [];
  if (weight !== null) specChips.push(`${weight}g`);
  if (head_size) specChips.push(`${head_size} in²`);
  if (ra) specChips.push(`RA ${ra}`);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Brand & model */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-0.5">
          {brand}
        </p>
        <Link
          href={`/raquete/${slug}`}
          className="text-base font-bold text-gray-900 hover:text-green-600 transition-colors leading-snug"
        >
          {model}
        </Link>
      </div>

      {/* Spec chips */}
      {specChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specChips.map((chip) => (
            <span
              key={chip}
              className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* Price */}
      {price_brl !== null && (
        <p className="text-base font-bold text-gray-900">
          R${" "}
          {price_brl.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      )}

      {/* Buy button */}
      <div className="mt-auto">
        <AffiliateButton brand={brand} model={model} />
      </div>
    </div>
  );
}
