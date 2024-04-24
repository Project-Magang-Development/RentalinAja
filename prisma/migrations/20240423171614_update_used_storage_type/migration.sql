/*
  Warnings:

  - You are about to alter the column `used_storage` on the `Merchant` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Merchant` MODIFY `used_storage` DECIMAL(65, 30) NOT NULL DEFAULT 0;
