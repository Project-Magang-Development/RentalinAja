/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `external_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_external_id_key` ON `Payment`(`external_id`);
