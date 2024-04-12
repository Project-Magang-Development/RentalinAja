-- CreateTable
CREATE TABLE `Merchant` (
    `merchant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `merchant_name` VARCHAR(191) NOT NULL,
    `merchant_company` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `status_subscriber` VARCHAR(191) NOT NULL DEFAULT 'Aktif',
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `api_key` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Merchant_email_key`(`email`),
    UNIQUE INDEX `Merchant_api_key_key`(`api_key`),
    PRIMARY KEY (`merchant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `merchant_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `payment_date` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `vehicles_id` INTEGER NOT NULL AUTO_INCREMENT,
    `merchant_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `no_plat` VARCHAR(191) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `capacity` INTEGER NOT NULL,

    UNIQUE INDEX `Vehicle_no_plat_key`(`no_plat`),
    PRIMARY KEY (`vehicles_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `schedules_id` INTEGER NOT NULL AUTO_INCREMENT,
    `merchant_id` INTEGER NOT NULL,
    `vehicles_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`schedules_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `merchant_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `payment_date` DATETIME(3) NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `schedules_id` INTEGER NOT NULL,
    `merchant_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `total_amount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `payment_id` INTEGER NOT NULL,
    `merchant_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Booking_order_id_key`(`order_id`),
    UNIQUE INDEX `Booking_payment_id_key`(`payment_id`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MerchantPayment` ADD CONSTRAINT `MerchantPayment_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_vehicles_id_fkey` FOREIGN KEY (`vehicles_id`) REFERENCES `Vehicle`(`vehicles_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_schedules_id_fkey` FOREIGN KEY (`schedules_id`) REFERENCES `Schedule`(`schedules_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_merchant_id_fkey` FOREIGN KEY (`merchant_id`) REFERENCES `Merchant`(`merchant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
