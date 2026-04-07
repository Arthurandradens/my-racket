import type { Racket } from "./types";

export function getAllRackets(data: Racket[]): Racket[] {
  return data;
}

export function getRacketBySlug(data: Racket[], slug: string): Racket | null {
  return data.find((r) => r.slug === slug) ?? null;
}

export function getRacketsByBrand(data: Racket[], brand: string): Racket[] {
  return data.filter((r) => r.brand.toLowerCase() === brand.toLowerCase());
}

export function searchRackets(data: Racket[], query: string): Racket[] {
  const q = query.toLowerCase();
  return data.filter(
    (r) =>
      r.model.toLowerCase().includes(q) ||
      r.brand.toLowerCase().includes(q) ||
      r.slug.includes(q)
  );
}

export function getAllBrands(data: Racket[]): string[] {
  const brands = new Set(data.map((r) => r.brand));
  return Array.from(brands).sort();
}
