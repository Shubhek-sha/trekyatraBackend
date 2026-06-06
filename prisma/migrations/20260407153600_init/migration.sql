/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `fitness_level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location_city` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location_country` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_difficulty` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_max_duration` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `date_of_birth`,
    DROP COLUMN `fitness_level`,
    DROP COLUMN `location_city`,
    DROP COLUMN `location_country`,
    DROP COLUMN `preferred_difficulty`,
    DROP COLUMN `preferred_max_duration`,
    ADD COLUMN `isPreferenceSet` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `preference` JSON NULL;
