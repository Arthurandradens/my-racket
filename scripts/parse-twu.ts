import { readFileSync } from "fs";
import path from "path";

export interface TwuReview {
  name: string;
  normalized_name: string;
  scores: {
    overall: number | null;
    groundstrokes: number | null;
    volleys: number | null;
    serves: number | null;
    returns: number | null;
    power: number | null;
    control: number | null;
    maneuverability: number | null;
    stability: number | null;
    comfort: number | null;
    touch_feel: number | null;
    topspin: number | null;
    slice: number | null;
  };
  price_usd: number | null;
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(|\)/g, "")
    .replace(/\breview\b/gi, "")
    .replace(/\bracqu[e]?t\b/gi, "")
    .replace(/\btennis\b/gi, "")
    .trim()
    .replace(/\s+/g, " ");
}

function parseScore(value: string): number | null {
  if (!value || value.trim() === "") return null;
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  // Normalize 1-10 scale to 0-100
  if (num <= 10) return Math.round(num * 10);
  return num;
}

function parsePrice(value: string): number | null {
  if (!value || value.trim() === "") return null;
  const cleaned = value.replace(/[$,]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

interface CsvRow {
  Racquet: string;
  Overall: string;
  Groundstrokes: string;
  Volleys: string;
  Serves: string;
  Returns: string;
  Power: string;
  Control: string;
  Maneuverability: string;
  Stability: string;
  Comfort: string;
  TouchFeel: string;
  Topspin: string;
  Slice: string;
  Price: string;
}

export function parseTwuRow(row: CsvRow): TwuReview | null {
  const overall = parseScore(row.Overall);
  if (overall === null) return null;

  return {
    name: row.Racquet.trim(),
    normalized_name: normalizeName(row.Racquet),
    scores: {
      overall,
      groundstrokes: parseScore(row.Groundstrokes),
      volleys: parseScore(row.Volleys),
      serves: parseScore(row.Serves),
      returns: parseScore(row.Returns),
      power: parseScore(row.Power),
      control: parseScore(row.Control),
      maneuverability: parseScore(row.Maneuverability),
      stability: parseScore(row.Stability),
      comfort: parseScore(row.Comfort),
      touch_feel: parseScore(row.TouchFeel),
      topspin: parseScore(row.Topspin),
      slice: parseScore(row.Slice),
    },
    price_usd: parsePrice(row.Price),
  };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function parseTwuCsv(csvContent: string): TwuReview[] {
  const lines = csvContent.trim().split("\n");
  const headers = parseCsvLine(lines[0]);
  const reviews: TwuReview[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] ?? "").trim();
    });

    const review = parseTwuRow(row as unknown as CsvRow);
    if (review && !seen.has(review.normalized_name)) {
      seen.add(review.normalized_name);
      reviews.push(review);
    }
  }

  return reviews;
}

// CLI entry point
if (process.argv[1] === import.meta.filename) {
  const csvPath = path.resolve("data/twu-reviews.csv");
  const content = readFileSync(csvPath, "utf-8");
  const reviews = parseTwuCsv(content);
  console.log(`Parsed ${reviews.length} unique reviews from TWU CSV.`);
  console.log("Sample:", JSON.stringify(reviews[0], null, 2));
}
