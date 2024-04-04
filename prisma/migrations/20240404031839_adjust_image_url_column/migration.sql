/*
  Warnings:

  - Made the column `imageUrl` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Vehicle` MODIFY `imageUrl` TEXT NOT NULL;
