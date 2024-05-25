/*
  Warnings:

  - You are about to drop the column `merchant_id` on the `merchantpayment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `MerchantPayment_merchant_id_key` ON `merchantpayment`;

-- AlterTable
ALTER TABLE `merchantpayment` DROP COLUMN `merchant_id`;
