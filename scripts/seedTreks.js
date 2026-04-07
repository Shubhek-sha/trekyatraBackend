import 'dotenv/config';
import {PrismaClient} from '@prisma/client';
import {PrismaMariaDb} from '@prisma/adapter-mariadb';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  connectTimeout: 5000,
  acquireTimeout: 10000,
});

const prisma = new PrismaClient({adapter});

async function seedTreks() {
  try {
    // Read the JSON file
    const dataPath = path.join(__dirname, '..', 'data', 'final_trek_dataset_updated_final.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const {treks} = JSON.parse(rawData);

    console.log(`Found ${treks.length} treks in JSON file`);

    // Clear existing data
    const deleted = await prisma.trek.deleteMany({});
    console.log(`Cleared ${deleted.count} existing treks from DB`);

    // Check for duplicate trekIds and keep only the first occurrence
    const seenTrekIds = new Set();
    const uniqueTreks = [];
    const duplicates = [];

    for (const trek of treks) {
      if (seenTrekIds.has(trek.trek_id)) {
        duplicates.push(trek.trek_id);
      } else {
        seenTrekIds.add(trek.trek_id);
        uniqueTreks.push(trek);
      }
    }

    if (duplicates.length > 0) {
      console.log(`Found and removed ${duplicates.length} duplicates:`, duplicates);
    }

    console.log(`Processing ${uniqueTreks.length} unique treks...`);

    // Transform and validate each trek
    const transformedTreks = [];
    for (const trek of uniqueTreks) {
      // Skip if trek_id is missing
      if (!trek.trek_id) {
        console.log('Skipping trek without trek_id:', trek.name);
        continue;
      }

      const transformed = {
        trekId: trek.trek_id,
        name: trek.name || 'Unknown',
        location: trek.location || 'Unknown',
        region: trek.region || 'Unknown',
        country: trek.country || 'Nepal',
        difficulty: trek.difficulty || 'moderate',
        durationDays: trek.duration_days || 0,
        distanceKm: trek.distance_km || 0,
        maxAltitudeM: trek.max_altitude_m || 0,
        altitudeGainM: trek.altitude_gain_m || 0,
        terrainTypes: trek.terrain_types || [],
        bestSeasons: trek.best_seasons || [],
        temperatureMin: trek.temperature_min || 0,
        temperatureMax: trek.temperature_max || 0,
        permitsRequired: trek.permits_required || false,
        permitDetails: trek.permit_details || null,
        guideMandatory: trek.guide_mandatory || false,
        fitnessLevelRequired: trek.fitness_level_required || 'moderate',
        startingPoint: trek.starting_point || 'Unknown',
        endingPoint: trek.ending_point || 'Unknown',
        baseCampAltitudeM: trek.base_camp_altitude_m || null,
        dailyTrekHours: trek.daily_trek_hours || 0,
        accommodationType: trek.accommodation_type || [],
        waterAvailability: trek.water_availability || 'unknown',
        mobileNetwork: trek.mobile_network || 'unknown',
        riskLevel: trek.risk_level || 'moderate',
        altitudeSicknessRisk: trek.altitude_sickness_risk || 'moderate',
        nearestMedicalFacilityKm: trek.nearest_medical_facility_km || 0,
        evacuationPossible: trek.evacuation_possible || false,
        estimatedCostMinUsd: trek.estimated_cost_min_usd || 0,
        estimatedCostMaxUsd: trek.estimated_cost_max_usd || 0,
        currency: trek.currency || 'USD',
        attractions: trek.attractions || [],
        wildlifePossible: trek.wildlife_possible || [],
        culturalSignificance: trek.cultural_significance || null,
        averageRating: trek.average_rating || 0,
        totalReviews: trek.total_reviews || 0,
        popularityScore: trek.popularity_score || 0,
        foodAvailability: trek.food_availability || 'unknown',
        languageSpoken: trek.language_spoken || [],
        groupSizeMin: trek.group_size_min || 1,
        groupSizeMax: trek.group_size_max || 10,
        province: trek.province || 'Unknown',
        bestFor: trek.best_for || [],
        description: trek.description || '',
        shortDescription: trek.short_description || trek.name || '',
        images: trek.images || [],
        itinerary: trek.itinerary || [],
      };

      transformedTreks.push(transformed);
    }

    console.log(`\nPrepared ${transformedTreks.length} treks for insertion`);

    // Insert one by one to see which one fails
    let inserted = 0;
    const failed = [];
    for (const trek of transformedTreks) {
      try {
        await prisma.trek.create({data: trek});
        inserted++;
      } catch (err) {
        failed.push({trekId: trek.trekId, error: err.message});
      }
    }

    console.log(`\n✅ Successfully seeded ${inserted} treks!`);
    if (failed.length > 0) {
      console.log(`❌ Failed to seed ${failed.length} treks:`);
      failed.forEach((f) => console.log(`  - ${f.trekId}: ${f.error.substring(0, 100)}...`));
    }

    // Verify by fetching one trek with all fields
    const verifyTrek = await prisma.trek.findFirst();
    console.log('\n--- Verification: Sample trek from DB ---');
    console.log('trekId:', verifyTrek?.trekId);
    console.log('name:', verifyTrek?.name);
    console.log('province:', verifyTrek?.province);
    console.log('difficulty:', verifyTrek?.difficulty);
    console.log('durationDays:', verifyTrek?.durationDays);
    console.log('distanceKm:', verifyTrek?.distanceKm);
    console.log('maxAltitudeM:', verifyTrek?.maxAltitudeM);
    console.log('Has description:', !!verifyTrek?.description);
    console.log('Has shortDescription:', !!verifyTrek?.shortDescription);
    console.log('Has permitDetails:', !!verifyTrek?.permitDetails);
    console.log('Has culturalSignificance:', !!verifyTrek?.culturalSignificance);
    console.log('Number of fields in DB:', Object.keys(verifyTrek || {}).length);

    // Count total treks in DB
    const finalCount = await prisma.trek.count();
    console.log(`\n📊 Total treks in database: ${finalCount}`);
  } catch (error) {
    console.error('Error seeding treks:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTreks();
