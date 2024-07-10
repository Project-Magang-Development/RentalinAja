import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

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
      include: {
        Merchant: {
          include: {
            MerchantPayment: {
              include: { MerchantPendingPayment: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new Error(`Transaction with external_id ${externalId} not found`);
    }

    // Update the status if the record exists
    const updatedTransaction = await prisma.order.update({
      where: { external_id: externalId },
      data: { status: newStatus },
      include: {
        Merchant: {
          include: {
            MerchantPayment: {
              include: { MerchantPendingPayment: true },
            },
          },
        },
      },
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

      // Update available_balance for the merchant
      await prisma.merchant.update({
        where: { merchant_id: transaction.merchant_id },
        data: {
          available_balance: {
            increment: transaction.total_amount,
          },
        },
      });

      // Record the income for the merchant
      try {
        const income = await prisma.income.create({
          data: {
            merchant_id: transaction.merchant_id,
            amount: transaction.total_amount,
          },
        });

        console.log("Income recorded successfully:", income);
      } catch (incomeError) {
        console.error("Failed to record income:", incomeError);
        throw new Error("Failed to record income");
      }

      // Send email notification to merchant
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: '"RentalinAja" <no-reply@gmail.com>',
        to: updatedTransaction.Merchant.MerchantPayment.MerchantPendingPayment
          .merchant_email,
        subject: "Ada Yang Order Nih!",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #0275d8; padding: 20px 0;">
                <h1 style="color: #ffffff; margin: 0; padding: 0 20px;">Ada Yang Order Nih!</h1>
              </div>
              <div style="padding: 20px;">
                <p style="font-size: 16px;">Hai ${updatedTransaction.Merchant.MerchantPayment.MerchantPendingPayment.merchant_name},</p>
                <p style="font-size: 16px;">Ada order baru dengan detail sebagai berikut:</p>
                <ul style="text-align: left;">
                  <li>Nama Customer: ${updatedTransaction.customer_name}</li>
                  <li>Tanggal Mulai: ${updatedTransaction.start_date}</li>
                  <li>Tanggal Berakhir: ${updatedTransaction.end_date}</li>
                  <li>Harga: ${updatedTransaction.total_amount.toLocaleString()}</li>
                </ul>
                <p style="font-size: 16px;">Kami senang Anda menggunakan layanan kami dan berharap Anda puas dengan pengalaman Anda.</p>
                <p style="font-size: 16px;">Jika Anda memiliki pertanyaan atau butuh bantuan lebih lanjut, jangan ragu untuk membalas email ini atau menghubungi support kami.</p>
              </div>
              <div style="background-color: #f0f0f0; padding: 20px; font-size: 14px; text-align: left;">
                <p>Salam Hangat,<br/>Tim RentalinAja</p>
              </div>
            </div>
          </div>
        `,
      });

      console.log("Email notification sent to merchant.");
    }

    return updatedTransaction;
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam memperbarui status pembayaran:",
      error
    );
    throw new Error("Terjadi kesalahan dalam memperbarui status pembayaran");
  } finally {
    await prisma.$disconnect();
  }
}
