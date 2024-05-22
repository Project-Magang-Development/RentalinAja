import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk memperbarui payment_method berdasarkan external_id
export async function updatePaymentMethodByExternalId(
  externalId: string,
  paymentMethod: string
) {
  try {
    // Periksa apakah transaksi dengan external_id ada
    const existingTransaction = await prisma.payment.findUnique({
      where: { external_id: externalId },
    });

    if (!existingTransaction) {
      throw new Error(
        `Transaksi dengan external_id: ${externalId} tidak ditemukan.`
      );
    }

    // Lakukan pembaruan payment_method dalam database menggunakan Prisma
    const updatedTransaction = await prisma.payment.update({
      where: { external_id: externalId },
      data: { payment_method: paymentMethod },
    });

    console.log(
      "Payment_method berhasil diperbarui:",
      updatedTransaction.payment_method
    );

    return updatedTransaction;
  } catch (error) {
    console.error("Terjadi kesalahan dalam memperbarui payment_method:", error);
    throw new Error("Terjadi kesalahan dalam memperbarui payment_method");
  } finally {
    await prisma.$disconnect();
  }
}
