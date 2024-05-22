/*
  Warnings:

  - You are about to drop the column `description` on the `merchantpayment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `merchantpayment` table. All the data in the column will be lost.
  - Added the required column `merchant_address` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_city` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_email` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_name` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_whatsapp` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rental_name` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rental_type` to the `MerchantPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `merchantpayment` DROP COLUMN `description`,
    DROP COLUMN `payment_method`,
    ADD COLUMN `merchant_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `merchant_city` VARCHAR(191) NOT NULL,
    ADD COLUMN `merchant_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `merchant_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `merchant_whatsapp` VARCHAR(191) NOT NULL,
    ADD COLUMN `rental_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `rental_type` VARCHAR(191) NOT NULL;
