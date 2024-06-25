/*
  Warnings:

  - Added the required column `index` to the `VehicleImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VehicleImage` ADD COLUMN `index` INTEGER NOT NULL;
