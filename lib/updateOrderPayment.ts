import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

// Function to post payment data
const postPayment = async (invoiceData: any) => {
  try {
    const { order_id, merchant_id, amount, external_id } = invoiceData;

    // Ambil data order dari tabel order berdasarkan order_id
    const existingOrder = await prisma.order.findUnique({
      where: { order_id },
    });

    if (!existingOrder) {
      throw new Error(`Order with order_id ${order_id} not found`);
    }

    // Ambil nilai status dari data order
    const { status } = existingOrder;

    // Gunakan nilai status untuk membuat entri baru dalam tabel payment
    const payment_method = "Undefined"; // Sesuaikan dengan metode pembayaran yang Anda gunakan
    const payment_date = new Date().toISOString(); // Gunakan tanggal eksekusi saat ini

    // Buat entri baru dalam tabel payment menggunakan nilai status dari order
    const newPayment = await prisma.payment.create({
      data: {
        order_id,
        merchant_id,
        amount,
        payment_method,
        status,
        payment_date,
        external_id,
      },
    });

    console.log("New payment created:", newPayment);
    const newBooking = await prisma.booking.create({
      data: {
        order_id,
        payment_id: newPayment.payment_id, // Gunakan payment_id dari pembayaran yang baru dibuat
        merchant_id,
        imageUrl: "", // Pastikan imageUrl sudah disertakan di invoiceData atau gunakan default jika tidak tersedia
      },
    });

    console.log("New booking created:", newBooking);

    return newPayment;
  } catch (error) {
    console.error("Error posting payment:", error);
    throw error;
  }
};

export async function updateOrderFinish(externalId: string, newStatus: string) {
  try {
    // Check if the record exists
    const transaction = await prisma.order.findUnique({
      where: { external_id: externalId },
    });

    if (!transaction) {
      throw new Error(`Transaction with external_id ${externalId} not found`);
    }

    // Update the status if the record exists
    const updatedTransaction = await prisma.order.update({
      where: { external_id: externalId },
      data: { status: newStatus },
    });

    console.log("Status pembayaran berhasil diperbarui:", updatedTransaction);

    // Post payment data after updating the status
    if (newStatus === "PAID") {
      await postPayment({
        order_id: transaction.order_id,
        merchant_id: transaction.merchant_id,
        amount: transaction.total_amount,
        external_id: transaction.external_id,
      });
    }

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
