/*
  Warnings:

  - A unique constraint covering the columns `[package_id]` on the table `MerchantPendingPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `package_id` to the `MerchantPendingPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `merchantpendingpayment` ADD COLUMN `package_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MerchantPendingPayment_package_id_key` ON `MerchantPendingPayment`(`package_id`);
