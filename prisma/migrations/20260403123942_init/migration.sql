-- CreateTable
CREATE TABLE `reviews` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `trekId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `review` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_trekId_fkey` FOREIGN KEY (`trekId`) REFERENCES `treks`(`trekId`) ON DELETE CASCADE ON UPDATE CASCADE;
