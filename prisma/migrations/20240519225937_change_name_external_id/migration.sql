/*
  Warnings:

  - You are about to drop the column `external_id` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inv_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inv_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Order_external_id_key` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `external_id`,
    ADD COLUMN `inv_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_inv_id_key` ON `Order`(`inv_id`);
