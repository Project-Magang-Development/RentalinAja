/*
  Warnings:

  - You are about to drop the column `email` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_company` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_name` on the `merchant` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `merchant` table. All the data in the column will be lost.
  - The primary key for the `merchantpayment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `merchantpayment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[merchant_payment_id]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pending_id]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[merchant_id]` on the table `MerchantPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `merchant_payment_id` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pending_id` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_id` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - The required column `merchant_payment_id` was added to the `MerchantPayment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `merchant` DROP FOREIGN KEY `Merchant_id_fkey`;

-- DropIndex
DROP INDEX `Merchant_email_key` ON `merchant`;

-- AlterTable
ALTER TABLE `merchant` DROP COLUMN `email`,
    DROP COLUMN `id`,
    DROP COLUMN `merchant_company`,
    DROP COLUMN `merchant_name`,
    DROP COLUMN `password`,
    ADD COLUMN `merchant_payment_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `pending_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchantpayment` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `merchant_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `merchant_payment_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`merchant_payment_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_merchant_payment_id_key` ON `Merchant`(`merchant_payment_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_pending_id_key` ON `Merchant`(`pending_id`);

-- CreateIndex
CREATE UNIQUE INDEX `MerchantPayment_merchant_id_key` ON `MerchantPayment`(`merchant_id`);

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_merchant_payment_id_fkey` FOREIGN KEY (`merchant_payment_id`) REFERENCES `MerchantPayment`(`merchant_payment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_pending_id_fkey` FOREIGN KEY (`pending_id`) REFERENCES `MerchantPendingPayment`(`pending_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
