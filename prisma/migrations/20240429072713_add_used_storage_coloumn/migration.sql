/*
  Warnings:

  - You are about to drop the column `storageSize` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `storageSize`;

-- AlterTable
ALTER TABLE `Vehicle` MODIFY `storageSize` INTEGER NOT NULL DEFAULT 0;
