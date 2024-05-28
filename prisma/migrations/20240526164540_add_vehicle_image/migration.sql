/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Vehicle` DROP COLUMN `imageUrl`;

-- CreateTable
CREATE TABLE `VehicleImage` (
    `vehicles_image_id` VARCHAR(191) NOT NULL,
    `vehicles_id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`vehicles_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VehicleImage` ADD CONSTRAINT `VehicleImage_vehicles_id_fkey` FOREIGN KEY (`vehicles_id`) REFERENCES `Vehicle`(`vehicles_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
