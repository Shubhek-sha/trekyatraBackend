/**
 * seed.js — Trek Dataset Bulk Seeder (ESM + Prisma 6 / mysql2 adapter)
 *
 * Setup:
 *   npm install @prisma/adapter-mysql2 mysql2 dotenv
 *
 * Usage:
 *   node seed.js
 *   node seed.js --dry-run
 *   node seed.js --file=./custom.json
 */

import { PrismaClient }    from "@prisma/client";
import { PrismaMysql2 }    from "@prisma/adapter-mysql2";
import mysql2              from "mysql2/promise";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath }    from "url";
import { config }           from "dotenv";

// ─── __dirname shim for ESM ────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ─── Load .env from project root (one level up from /script) ──────────────────
config({ path: resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set. Add it to your .env file.");
  process.exit(1);
}

// ─── CLI args ──────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const fileArg = args.find((a) => a.startsWith("--file="));
const DATA_FILE = fileArg
  ? fileArg.split("=")[1]
  : resolve(__dirname, "final_trek_dataset_with_provinces.json");

// ─── Prisma + mysql2 adapter (Prisma 6 compatible) ────────────────────────────
const pool    = mysql2.createPool(process.env.DATABASE_URL);
const adapter = new PrismaMysql2(pool);
const prisma  = new PrismaClient({ adapter, log: ["warn", "error"] });

// ─── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(name) {
  if (!name || typeof name !== "string") return `trek-${Date.now()}`;
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toIntOrNull(value) {
  if (value === null || value === undefined) return null;
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

function toFloatOrNull(value) {
  if (value === null || value === undefined) return null;
  const n = parseFloat(value);
  return isNaN(n) ? null : n;
}

function toJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function toJsonOrNull(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") return value;
  return null;
}

// ─── Transformer ───────────────────────────────────────────────────────────────

function transformTrek(raw) {
  const name = String(raw.name || "").trim();

  return {
    trekId:               String(raw.trek_id || toSlug(name)).trim(),
    name,
    location:             String(raw.location              || "").trim(),
    region:               String(raw.region                || "").trim(),
    country:              String(raw.country               || "Nepal").trim(),
    difficulty:           String(raw.difficulty            || "moderate").trim(),

    durationDays:         toIntOrNull(raw.duration_days)            ?? 0,
    distanceKm:           toFloatOrNull(raw.distance_km)            ?? 0,
    maxAltitudeM:         toIntOrNull(raw.max_altitude_m)           ?? 0,
    altitudeGainM:        toIntOrNull(raw.altitude_gain_m)          ?? 0,
    temperatureMin:       toIntOrNull(raw.temperature_min)          ?? 0,
    temperatureMax:       toIntOrNull(raw.temperature_max)          ?? 0,
    dailyTrekHours:       toFloatOrNull(raw.daily_trek_hours)       ?? 0,
    nearestMedicalFacilityKm: toFloatOrNull(raw.nearest_medical_facility_km) ?? 0,
    estimatedCostMinUsd:  toIntOrNull(raw.estimated_cost_min_usd)   ?? 0,
    estimatedCostMaxUsd:  toIntOrNull(raw.estimated_cost_max_usd)   ?? 0,
    totalReviews:         toIntOrNull(raw.total_reviews)            ?? 0,
    popularityScore:      toIntOrNull(raw.popularity_score)         ?? 0,
    groupSizeMin:         toIntOrNull(raw.group_size_min)           ?? 1,
    groupSizeMax:         toIntOrNull(raw.group_size_max)           ?? 12,
    baseCampAltitudeM:    toIntOrNull(raw.base_camp_altitude_m),
    averageRating:        toFloatOrNull(raw.average_rating)         ?? 0,

    permitsRequired:      Boolean(raw.permits_required),
    guideMandatory:       Boolean(raw.guide_mandatory),
    evacuationPossible:   Boolean(raw.evacuation_possible),

    fitnessLevelRequired: String(raw.fitness_level_required || "moderate").trim(),
    startingPoint:        String(raw.starting_point         || "").trim(),
    endingPoint:          String(raw.ending_point           || "").trim(),
    waterAvailability:    String(raw.water_availability     || "").trim(),
    mobileNetwork:        String(raw.mobile_network         || "").trim(),
    riskLevel:            String(raw.risk_level             || "").trim(),
    altitudeSicknessRisk: String(raw.altitude_sickness_risk || "").trim(),
    foodAvailability:     String(raw.food_availability      || "").trim(),
    province:             String(raw.province               || "").trim(),
    currency:             String(raw.currency               || "USD").trim(),

    permitDetails: raw.permit_details != null && raw.permit_details !== ""
      ? String(raw.permit_details).trim()
      : null,
    culturalSignificance: raw.cultural_significance != null && raw.cultural_significance !== ""
      ? String(raw.cultural_significance).trim()
      : null,

    description:      String(raw.description       || "").trim(),
    shortDescription: String(raw.short_description || "").trim(),

    terrainTypes:      toJsonArray(raw.terrain_types),
    bestSeasons:       toJsonArray(raw.best_seasons),
    accommodationType: toJsonArray(raw.accommodation_type),
    attractions:       toJsonArray(raw.attractions),
    wildlifePossible:  toJsonArray(raw.wildlife_possible),
    languageSpoken:    toJsonArray(raw.language_spoken),
    bestFor:           toJsonArray(raw.best_for),
    images:            toJsonArray(raw.images),
    itinerary:         toJsonOrNull(raw.itinerary) ?? [],
  };
}

// ─── Loader ────────────────────────────────────────────────────────────────────

function loadDataset(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Dataset file not found: ${filePath}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err.message}`);
  }

  const records = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.treks)
    ? parsed.treks
    : null;

  if (!records) {
    throw new Error('Expected a JSON array or an object with a "treks" array.');
  }
  return records;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Trek Seed Script");
  console.log(`  Mode   : ${DRY_RUN ? "DRY RUN (no DB writes)" : "LIVE"}`);
  console.log(`  Source : ${DATA_FILE}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // 1. Load
  console.log("📂  Loading dataset...");
  const rawRecords = loadDataset(DATA_FILE);
  console.log(`    Loaded ${rawRecords.length} raw records.\n`);

  // 2. Validate
  const valid   = [];
  const skipped = [];
  for (const [idx, raw] of rawRecords.entries()) {
    if (!raw.name || String(raw.name).trim() === "") {
      skipped.push({ idx, reason: "missing name" });
      continue;
    }
    if (!raw.trek_id || String(raw.trek_id).trim() === "") {
      skipped.push({ idx, reason: "missing trek_id", name: raw.name });
      continue;
    }
    valid.push(raw);
  }

  if (skipped.length) {
    console.warn(`⚠️   Skipped ${skipped.length} invalid record(s):`);
    skipped.forEach((s) =>
      console.warn(`     [${s.idx}] ${s.reason}${s.name ? ` — ${s.name}` : ""}`)
    );
    console.log();
  }

  // 3. Transform
  console.log("🔄  Transforming records...");
  const transformed = valid.map(transformTrek);

  // 4. Deduplicate within the batch
  const seenTrekIds = new Set();
  const seenNames   = new Set();
  const batch       = [];
  const batchDups   = [];

  for (const rec of transformed) {
    if (seenTrekIds.has(rec.trekId) || seenNames.has(rec.name)) {
      batchDups.push(rec.trekId);
      continue;
    }
    seenTrekIds.add(rec.trekId);
    seenNames.add(rec.name);
    batch.push(rec);
  }

  if (batchDups.length) {
    console.warn(
      `⚠️   Removed ${batchDups.length} in-batch duplicate(s): ${batchDups.join(", ")}\n`
    );
  }

  console.log(`    Ready to insert: ${batch.length} records.\n`);

  // 5. Dry-run preview
  if (DRY_RUN) {
    console.log("🔍  Dry-run — first 2 transformed records:\n");
    console.log(JSON.stringify(batch.slice(0, 2), null, 2));
    console.log("\n✅  Dry run complete. No data written.");
    return;
  }

  // 6. Bulk insert — single round-trip, safe to re-run
  console.log("💾  Inserting into database...");
  const result = await prisma.trek.createMany({
    data: batch,
    skipDuplicates: true,
  });

  console.log(
    `\n✅  Done! Inserted ${result.count} new trek(s) out of ${batch.length} prepared.`
  );
  if (result.count < batch.length) {
    console.log(
      `    ${batch.length - result.count} record(s) skipped (already exist in DB).`
    );
  }
}

// ─── Bootstrap ─────────────────────────────────────────────────────────────────

main()
  .catch((err) => {
    console.error("\n❌  Seed failed:");
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });