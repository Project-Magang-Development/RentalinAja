/*
  Warnings:

  - A unique constraint covering the columns `[merchantId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Transaction_merchantId_key` ON `Transaction`(`merchantId`);
