/*
  Warnings:

  - You are about to drop the column `used_storage` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `Package` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Merchant` DROP COLUMN `used_storage`,
    ADD COLUMN `used_storage_order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `used_storage_vehicle` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Package` DROP COLUMN `count`,
    ADD COLUMN `count_order` INTEGER NULL,
    ADD COLUMN `count_vehicle` INTEGER NULL;
