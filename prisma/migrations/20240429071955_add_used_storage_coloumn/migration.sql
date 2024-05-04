/*
  Warnings:

  - You are about to alter the column `used_storage` on the `Merchant` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Merchant` MODIFY `used_storage` DOUBLE NOT NULL DEFAULT 0;
