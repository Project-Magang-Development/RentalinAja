/*
  Warnings:

  - You are about to alter the column `used_storage` on the `Merchant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Merchant` MODIFY `used_storage` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Vehicle` ADD COLUMN `storageSize` DOUBLE NOT NULL DEFAULT 0;
