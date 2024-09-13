/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `level` DROP FOREIGN KEY `Level_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `score` DROP FOREIGN KEY `Score_userId_fkey`;

-- AlterTable
ALTER TABLE `level` MODIFY `authorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `score` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(32) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `userid` ON `User`(`id`);

-- AddForeignKey
ALTER TABLE `Level` ADD CONSTRAINT `Level_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
