/*
  Warnings:

  - Added the required column `feature` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `package` ADD COLUMN `feature` VARCHAR(191) NOT NULL;
