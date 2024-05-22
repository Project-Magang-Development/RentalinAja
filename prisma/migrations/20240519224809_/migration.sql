/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `external_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_external_id_key` ON `Order`(`external_id`);
