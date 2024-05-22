/*
  Warnings:

  - Added the required column `invoice_id` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `package_name` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `merchantpayment` ADD COLUMN `invoice_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `package_name` VARCHAR(191) NOT NULL;
