/*
  Warnings:

  - You are about to drop the column `amount` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_id` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_address` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_city` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_email` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_id` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_name` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_whatsapp` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `package_name` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_date` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `rental_name` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `rental_type` on the `merchantpayment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pending_id]` on the table `MerchantPayment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id]` on the table `MerchantPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pending_id` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `merchantpayment` DROP FOREIGN KEY `MerchantPayment_merchant_id_fkey`;

-- DropIndex
DROP INDEX `MerchantPayment_invoice_id_key` ON `merchantpayment`;

-- AlterTable
ALTER TABLE `merchant` ADD COLUMN `id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchantpayment` DROP COLUMN `amount`,
    DROP COLUMN `invoice_id`,
    DROP COLUMN `merchant_address`,
    DROP COLUMN `merchant_city`,
    DROP COLUMN `merchant_email`,
    DROP COLUMN `merchant_id`,
    DROP COLUMN `merchant_name`,
    DROP COLUMN `merchant_whatsapp`,
    DROP COLUMN `package_name`,
    DROP COLUMN `payment_date`,
    DROP COLUMN `rental_name`,
    DROP COLUMN `rental_type`,
    ADD COLUMN `external_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `pending_id` VARCHAR(191) NOT NULL,
    ALTER COLUMN `status` DROP DEFAULT;

-- CreateTable
CREATE TABLE `MerchantPendingPayment` (
    `pending_id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NOT NULL,
    `package_name` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `merchant_name` VARCHAR(191) NOT NULL,
    `merchant_email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `merchant_whatsapp` VARCHAR(191) NOT NULL,
    `rental_name` VARCHAR(191) NOT NULL,
    `rental_type` VARCHAR(191) NOT NULL,
    `merchant_city` VARCHAR(191) NOT NULL,
    `merchant_address` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `payment_date` DATETIME(3) NULL,
    `external_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MerchantPendingPayment_invoice_id_key`(`invoice_id`),
    UNIQUE INDEX `MerchantPendingPayment_external_id_key`(`external_id`),
    PRIMARY KEY (`pending_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_id_key` ON `Merchant`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `MerchantPayment_pending_id_key` ON `MerchantPayment`(`pending_id`);

-- CreateIndex
CREATE UNIQUE INDEX `MerchantPayment_external_id_key` ON `MerchantPayment`(`external_id`);

-- AddForeignKey
ALTER TABLE `Merchant` ADD CONSTRAINT `Merchant_id_fkey` FOREIGN KEY (`id`) REFERENCES `MerchantPayment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MerchantPayment` ADD CONSTRAINT `MerchantPayment_pending_id_fkey` FOREIGN KEY (`pending_id`) REFERENCES `MerchantPendingPayment`(`pending_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
