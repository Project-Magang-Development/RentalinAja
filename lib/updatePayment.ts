import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to update payment status
export async function updatePaymentStatus(
  externalId: string,
  newStatus: string
) {
  try {
    // Check if the record exists
    const transaction = await prisma.merchantPayment.findUnique({
      where: { invoice_id: externalId },
    });

    if (!transaction) {
      // Tidak melakukan apa pun jika transaksi tidak ditemukan
      return;
    }

    // Update the status if the record exists
    const updatedTransaction = await prisma.merchantPayment.update({
      where: { invoice_id: externalId },
      data: { status: newStatus },
    });

    console.log("Status pembayaran berhasil diperbarui:", updatedTransaction);

    return updatedTransaction;
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam memperbarui status pembayaran:",
      error || error
    );
    throw new Error("Terjadi kesalahan dalam memperbarui status pembayaran");
  } finally {
    await prisma.$disconnect();
  }
}

// Function to update status to "EXPIRED"
export async function updateExpiredStatus(
  externalId: string,
  newStatus: string
) {
  try {
    // Check if the record exists
    const transaction = await prisma.merchantPayment.findUnique({
      where: { invoice_id: externalId },
    });

    if (!transaction) {
      // Tidak melakukan apa pun jika transaksi tidak ditemukan
      return;
    }

    // Update the status if the record exists
    const updatedTransaction = await prisma.merchantPayment.update({
      where: { invoice_id: externalId },
      data: { status: newStatus },
    });

    console.log(
      "Status pembayaran berhasil diperbarui menjadi EXPIRED:",
      updatedTransaction
    );

    return updatedTransaction;
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam memperbarui status menjadi EXPIRED:",
      error || error
    );
    throw new Error(
      "Terjadi kesalahan dalam memperbarui status menjadi EXPIRED"
    );
  } finally {
    await prisma.$disconnect();
  }
}
