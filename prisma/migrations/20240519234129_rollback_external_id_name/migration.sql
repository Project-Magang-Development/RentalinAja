/*
  Warnings:

  - You are about to drop the column `inv_id` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Order_inv_id_key` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `inv_id`,
    ADD COLUMN `external_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_external_id_key` ON `Order`(`external_id`);
