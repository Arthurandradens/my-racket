import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fetchRacqix } from "./fetch-racqix";
import { parseTwuCsv } from "./parse-twu";
import { mergeRacketData } from "./merge-data";

async function main() {
  console.log("=== My Racket Data Pipeline ===\n");

  const racqixData = await fetchRacqix();

  const twuPath = path.resolve("data/twu-reviews.csv");
  const twuContent = readFileSync(twuPath, "utf-8");
  const twuData = parseTwuCsv(twuContent);
  console.log(`Parsed ${twuData.length} TWU reviews.\n`);

  const merged = mergeRacketData(racqixData, twuData);
  const enriched = merged.filter((r) => r.scores.overall !== null).length;
  console.log(`Merged: ${merged.length} total, ${enriched} with TWU scores.\n`);

  const outDir = path.resolve("src/data");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "rackets.json");
  writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log(`Written to ${outPath}`);
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
