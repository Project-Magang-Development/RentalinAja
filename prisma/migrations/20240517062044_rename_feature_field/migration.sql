/*
  Warnings:

  - You are about to drop the column `feature` on the `package` table. All the data in the column will be lost.
  - Added the required column `package_feature` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `package` DROP COLUMN `feature`,
    ADD COLUMN `package_feature` VARCHAR(191) NOT NULL;
