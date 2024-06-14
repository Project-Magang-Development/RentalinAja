/*
  Warnings:

  - A unique constraint covering the columns `[merchant_email]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `merchant_email` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Merchant` ADD COLUMN `merchant_email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_merchant_email_key` ON `Merchant`(`merchant_email`);
