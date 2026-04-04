/*
  Warnings:

  - You are about to drop the column `trek_id` on the `trek_images` table. All the data in the column will be lost.
  - The primary key for the `treks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `altitude_gain` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `altitude_sickness_risk` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `cost_max_usd` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `cost_min_usd` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `cultural_significance` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `daily_trek_hours` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `distance_km` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `duration_days` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `ending_point` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `evacuation_possible` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `fitness_level_required` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `food_availability` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `group_size_max` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `group_size_min` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `guide_mandatory` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `max_altitude` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_network_availability` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `nearest_medical_facility_distance` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `permits_required` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `popularity_score` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `risk_level` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `starting_point` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `temperature_range` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `trek_id` on the `treks` table. All the data in the column will be lost.
  - You are about to drop the column `water_availability` on the `treks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trekId]` on the table `treks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trekId` to the `trek_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accommodationType` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altitudeGainM` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altitudeSicknessRisk` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attractions` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestFor` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestSeasons` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyTrekHours` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceKm` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationDays` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endingPoint` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCostMaxUsd` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCostMinUsd` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evacuationPossible` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fitnessLevelRequired` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodAvailability` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupSizeMax` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupSizeMin` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guideMandatory` to the `treks` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `treks` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `images` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itinerary` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageSpoken` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAltitudeM` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNetwork` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nearestMedicalFacilityKm` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permitsRequired` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskLevel` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingPoint` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperatureMax` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperatureMin` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terrainTypes` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trekId` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterAvailability` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wildlifePossible` to the `treks` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `treks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `region` on table `treks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `treks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `difficulty` on table `treks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `trek_images` DROP FOREIGN KEY `trek_images_trek_id_fkey`;

-- DropIndex
DROP INDEX `trek_images_trek_id_fkey` ON `trek_images`;

-- DropIndex
DROP INDEX `treks_slug_key` ON `treks`;

-- AlterTable
ALTER TABLE `trek_images` DROP COLUMN `trek_id`,
    ADD COLUMN `trekId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `treks` DROP PRIMARY KEY,
    DROP COLUMN `altitude_gain`,
    DROP COLUMN `altitude_sickness_risk`,
    DROP COLUMN `cost_max_usd`,
    DROP COLUMN `cost_min_usd`,
    DROP COLUMN `cultural_significance`,
    DROP COLUMN `daily_trek_hours`,
    DROP COLUMN `distance_km`,
    DROP COLUMN `duration_days`,
    DROP COLUMN `ending_point`,
    DROP COLUMN `evacuation_possible`,
    DROP COLUMN `fitness_level_required`,
    DROP COLUMN `food_availability`,
    DROP COLUMN `group_size_max`,
    DROP COLUMN `group_size_min`,
    DROP COLUMN `guide_mandatory`,
    DROP COLUMN `is_active`,
    DROP COLUMN `max_altitude`,
    DROP COLUMN `mobile_network_availability`,
    DROP COLUMN `nearest_medical_facility_distance`,
    DROP COLUMN `permits_required`,
    DROP COLUMN `popularity_score`,
    DROP COLUMN `risk_level`,
    DROP COLUMN `slug`,
    DROP COLUMN `starting_point`,
    DROP COLUMN `temperature_range`,
    DROP COLUMN `trek_id`,
    DROP COLUMN `water_availability`,
    ADD COLUMN `accommodationType` JSON NOT NULL,
    ADD COLUMN `altitudeGainM` INTEGER NOT NULL,
    ADD COLUMN `altitudeSicknessRisk` VARCHAR(191) NOT NULL,
    ADD COLUMN `attractions` JSON NOT NULL,
    ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `baseCampAltitudeM` INTEGER NULL,
    ADD COLUMN `bestFor` JSON NOT NULL,
    ADD COLUMN `bestSeasons` JSON NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `culturalSignificance` VARCHAR(191) NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    ADD COLUMN `dailyTrekHours` DOUBLE NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL,
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
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `images` JSON NOT NULL,
    ADD COLUMN `itinerary` JSON NOT NULL,
    ADD COLUMN `languageSpoken` JSON NOT NULL,
    ADD COLUMN `maxAltitudeM` INTEGER NOT NULL,
    ADD COLUMN `mobileNetwork` VARCHAR(191) NOT NULL,
    ADD COLUMN `nearestMedicalFacilityKm` DOUBLE NOT NULL,
    ADD COLUMN `permitDetails` VARCHAR(191) NULL,
    ADD COLUMN `permitsRequired` BOOLEAN NOT NULL,
    ADD COLUMN `popularityScore` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `riskLevel` VARCHAR(191) NOT NULL,
    ADD COLUMN `shortDescription` TEXT NOT NULL,
    ADD COLUMN `startingPoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `temperatureMax` INTEGER NOT NULL,
    ADD COLUMN `temperatureMin` INTEGER NOT NULL,
    ADD COLUMN `terrainTypes` JSON NOT NULL,
    ADD COLUMN `totalReviews` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `trekId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `waterAvailability` VARCHAR(191) NOT NULL,
    ADD COLUMN `wildlifePossible` JSON NOT NULL,
    MODIFY `location` VARCHAR(191) NOT NULL,
    MODIFY `region` VARCHAR(191) NOT NULL,
    MODIFY `country` VARCHAR(191) NOT NULL,
    MODIFY `difficulty` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` MODIFY `location_country` VARCHAR(191) NULL DEFAULT 'Nepal';

-- CreateIndex
CREATE UNIQUE INDEX `treks_trekId_key` ON `treks`(`trekId`);

-- AddForeignKey
ALTER TABLE `trek_images` ADD CONSTRAINT `trek_images_trekId_fkey` FOREIGN KEY (`trekId`) REFERENCES `treks`(`trekId`) ON DELETE RESTRICT ON UPDATE CASCADE;
