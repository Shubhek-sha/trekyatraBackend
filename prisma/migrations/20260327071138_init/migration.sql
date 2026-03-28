-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `profile_picture` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `date_of_birth` DATE NULL,
    `fitness_level` INTEGER NULL,
    `preferred_difficulty` VARCHAR(191) NULL,
    `preferred_max_duration` INTEGER NULL,
    `location_country` VARCHAR(191) NULL,
    `location_city` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `otp` VARCHAR(191) NULL,
    `otp_expires` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `treks` (
    `trek_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `difficulty` VARCHAR(191) NULL,
    `duration_days` INTEGER NULL,
    `distance_km` DECIMAL(10, 2) NULL,
    `max_altitude` INTEGER NULL,
    `altitude_gain` INTEGER NULL,
    `starting_point` VARCHAR(191) NULL,
    `ending_point` VARCHAR(191) NULL,
    `daily_trek_hours` INTEGER NULL,
    `temperature_range` VARCHAR(191) NULL,
    `permits_required` VARCHAR(191) NULL,
    `guide_mandatory` INTEGER NULL DEFAULT 0,
    `fitness_level_required` INTEGER NULL,
    `water_availability` INTEGER NULL DEFAULT 1,
    `food_availability` INTEGER NULL DEFAULT 1,
    `mobile_network_availability` INTEGER NULL DEFAULT 1,
    `risk_level` VARCHAR(191) NULL,
    `altitude_sickness_risk` VARCHAR(191) NULL,
    `nearest_medical_facility_distance` DECIMAL(10, 2) NULL,
    `evacuation_possible` INTEGER NULL DEFAULT 1,
    `cost_min_usd` DECIMAL(10, 2) NULL,
    `cost_max_usd` DECIMAL(10, 2) NULL,
    `cultural_significance` TEXT NULL,
    `group_size_min` INTEGER NULL,
    `group_size_max` INTEGER NULL,
    `popularity_score` INTEGER NULL DEFAULT 0,
    `is_active` INTEGER NULL DEFAULT 1,

    UNIQUE INDEX `treks_slug_key`(`slug`),
    PRIMARY KEY (`trek_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trek_images` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `trek_id` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `is_cover` INTEGER NOT NULL DEFAULT 0,
    `sort_order` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `trek_images` ADD CONSTRAINT `trek_images_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trek_images` ADD CONSTRAINT `trek_images_trek_id_fkey` FOREIGN KEY (`trek_id`) REFERENCES `treks`(`trek_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
