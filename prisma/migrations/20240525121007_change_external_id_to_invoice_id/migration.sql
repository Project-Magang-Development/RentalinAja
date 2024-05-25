/*
  Warnings:

  - You are about to drop the column `external_id` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `external_id` on the `merchantpendingpayment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoice_id]` on the table `MerchantPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoice_id` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `MerchantPayment_external_id_key` ON `merchantpayment`;

-- DropIndex
DROP INDEX `MerchantPendingPayment_external_id_key` ON `merchantpendingpayment`;

-- AlterTable
ALTER TABLE `merchantpayment` DROP COLUMN `external_id`,
    ADD COLUMN `invoice_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `merchantpendingpayment` DROP COLUMN `external_id`;

-- CreateIndex
CREATE UNIQUE INDEX `MerchantPayment_invoice_id_key` ON `MerchantPayment`(`invoice_id`);
