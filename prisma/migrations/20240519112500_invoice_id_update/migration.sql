/*
  Warnings:

  - A unique constraint covering the columns `[invoice_id]` on the table `MerchantPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `MerchantPayment_invoice_id_key` ON `MerchantPayment`(`invoice_id`);
