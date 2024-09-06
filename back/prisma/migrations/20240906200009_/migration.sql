-- DropForeignKey
ALTER TABLE `level` DROP FOREIGN KEY `Level_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `score` DROP FOREIGN KEY `Score_userId_fkey`;

-- AlterTable
ALTER TABLE `level` MODIFY `authorId` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Level` ADD CONSTRAINT `Level_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
