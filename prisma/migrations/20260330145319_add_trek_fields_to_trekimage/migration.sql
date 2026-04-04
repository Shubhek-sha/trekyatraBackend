/*
  Warnings:

  - Added the required column `accommodationType` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altitudeGainM` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altitudeSicknessRisk` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attractions` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestFor` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestSeasons` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyTrekHours` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceKm` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationDays` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endingPoint` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCostMaxUsd` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCostMinUsd` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evacuationPossible` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fitnessLevelRequired` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodAvailability` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupSizeMax` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupSizeMin` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guideMandatory` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itinerary` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageSpoken` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAltitudeM` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNetwork` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nearestMedicalFacilityKm` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permitsRequired` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskLevel` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingPoint` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperatureMax` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperatureMin` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terrainTypes` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterAvailability` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wildlifePossible` to the `trek_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `trek_images` ADD COLUMN `accommodationType` JSON NOT NULL,
    ADD COLUMN `altitudeGainM` INTEGER NOT NULL,
    ADD COLUMN `altitudeSicknessRisk` VARCHAR(191) NOT NULL,
    ADD COLUMN `attractions` JSON NOT NULL,
    ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `baseCampAltitudeM` INTEGER NULL,
    ADD COLUMN `bestFor` JSON NOT NULL,
    ADD COLUMN `bestSeasons` JSON NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `culturalSignificance` VARCHAR(191) NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    ADD COLUMN `dailyTrekHours` DOUBLE NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `difficulty` VARCHAR(191) NOT NULL,
    ADD COLUMN `distanceKm` DOUBLE NOT NULL,
    ADD COLUMN `durationDays` INTEGER NOT NULL,
    ADD COLUMN `endingPoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `estimatedCostMaxUsd` INTEGER NOT NULL,
    ADD COLUMN `estimatedCostMinUsd` INTEGER NOT NULL,
    ADD COLUMN `evacuationPossible` BOOLEAN NOT NULL,
    ADD COLUMN `fitnessLevelRequired` VARCHAR(191) NOT NULL,
    ADD COLUMN `foodAvailability` VARCHAR(191) NOT NULL,
    ADD COLUMN `groupSizeMax` INTEGER NOT NULL,
    ADD COLUMN `groupSizeMin` INTEGER NOT NULL,
    ADD COLUMN `guideMandatory` BOOLEAN NOT NULL,
    ADD COLUMN `images` JSON NOT NULL,
    ADD COLUMN `itinerary` JSON NOT NULL,
    ADD COLUMN `languageSpoken` JSON NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `maxAltitudeM` INTEGER NOT NULL,
    ADD COLUMN `mobileNetwork` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `nearestMedicalFacilityKm` DOUBLE NOT NULL,
    ADD COLUMN `permitDetails` VARCHAR(191) NULL,
    ADD COLUMN `permitsRequired` BOOLEAN NOT NULL,
    ADD COLUMN `popularityScore` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `region` VARCHAR(191) NOT NULL,
    ADD COLUMN `riskLevel` VARCHAR(191) NOT NULL,
    ADD COLUMN `shortDescription` TEXT NOT NULL,
    ADD COLUMN `startingPoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `temperatureMax` INTEGER NOT NULL,
    ADD COLUMN `temperatureMin` INTEGER NOT NULL,
    ADD COLUMN `terrainTypes` JSON NOT NULL,
    ADD COLUMN `totalReviews` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `waterAvailability` VARCHAR(191) NOT NULL,
    ADD COLUMN `wildlifePossible` JSON NOT NULL;
