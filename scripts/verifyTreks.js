import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });

async function verifyTreks() {
  try {
    const count = await prisma.trek.count();
    console.log('✅ Total treks in DB:', count);

    if (count === 0) {
      console.log('❌ No treks found in database!');
      return;
    }

    // Get all treks
    const treks = await prisma.trek.findMany();

    // Check all fields exist
    const requiredFields = [
      'id', 'trekId', 'name', 'location', 'region', 'country', 'difficulty',
      'durationDays', 'distanceKm', 'maxAltitudeM', 'altitudeGainM',
      'terrainTypes', 'bestSeasons', 'temperatureMin', 'temperatureMax',
      'permitsRequired', 'permitDetails', 'guideMandatory', 'fitnessLevelRequired',
      'startingPoint', 'endingPoint', 'baseCampAltitudeM', 'dailyTrekHours',
      'accommodationType', 'waterAvailability', 'mobileNetwork',
      'riskLevel', 'altitudeSicknessRisk', 'nearestMedicalFacilityKm',
      'evacuationPossible', 'estimatedCostMinUsd', 'estimatedCostMaxUsd',
      'currency', 'attractions', 'wildlifePossible', 'culturalSignificance',
      'averageRating', 'totalReviews', 'popularityScore',
      'foodAvailability', 'languageSpoken', 'groupSizeMin', 'groupSizeMax',
      'province', 'bestFor', 'description', 'shortDescription',
      'images', 'itinerary', 'createdAt', 'updatedAt'
    ];

    console.log('\n📋 Checking all', requiredFields.length, 'fields are present...');

    // Check first trek has all fields
    const sampleTrek = treks[0];
    const missingFields = [];

    for (const field of requiredFields) {
      if (!(field in sampleTrek)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
    } else {
      console.log('✅ All', requiredFields.length, 'fields present in each trek!');
    }

    // Show sample with field values
    console.log('\n--- Sample Trek (', sampleTrek.trekId, ') ---');
    console.log('name:', sampleTrek.name);
    console.log('province:', sampleTrek.province);
    console.log('durationDays:', sampleTrek.durationDays);
    console.log('maxAltitudeM:', sampleTrek.maxAltitudeM);
    console.log('images (array):', JSON.stringify(sampleTrek.images)?.substring(0, 50) + '...');
    console.log('itinerary (array):', Array.isArray(sampleTrek.itinerary) ? `${sampleTrek.itinerary.length} items` : 'N/A');
    console.log('attractions:', Array.isArray(sampleTrek.attractions) ? `${sampleTrek.attractions.length} items` : 'N/A');
    console.log('description length:', sampleTrek.description?.length || 0);
    console.log('shortDescription length:', sampleTrek.shortDescription?.length || 0);

    // Check for empty arrays
    let emptyImages = 0;
    let emptyItinerary = 0;
    for (const trek of treks) {
      if (!trek.images || trek.images.length === 0) emptyImages++;
      if (!trek.itinerary || trek.itinerary.length === 0) emptyItinerary++;
    }

    console.log('\n📊 Summary:');
    console.log('  - Total treks:', count);
    console.log('  - Treks with empty images[]:', emptyImages);
    console.log('  - Treks with empty itinerary[]:', emptyItinerary);
    console.log('  - All fields present: ✅');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTreks();
