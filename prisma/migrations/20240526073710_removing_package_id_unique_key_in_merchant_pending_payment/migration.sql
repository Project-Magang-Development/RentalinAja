-- DropIndex
DROP INDEX `MerchantPendingPayment_package_id_key` ON `merchantpendingpayment`;

-- AddForeignKey
ALTER TABLE `MerchantPendingPayment` ADD CONSTRAINT `MerchantPendingPayment_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
