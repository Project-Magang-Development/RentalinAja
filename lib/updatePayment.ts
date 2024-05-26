import { PrismaClient } from "@prisma/client";
import axios from "axios";
import moment from "moment";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const createMerchant = async (invoiceData: any) => {
  try {
    const { pending_id, plan } = invoiceData;

    const existingPaymentPending =
      await prisma.merchantPendingPayment.findUnique({
        where: { pending_id },
      });
    if (!existingPaymentPending) {
      throw new Error(`Order with id ${pending_id} not found`);
    }
    const { status, package_id, invoice_id, merchant_email } =
      existingPaymentPending;
    const startDate = new Date();
    const generateApiKey = () => crypto.randomBytes(32).toString("hex");
    const packageInfo = await prisma.package.findUnique({
      where: { package_id: plan },
    });
    if (!packageInfo) {
      return NextResponse.json({ error: "Invalid plan ID" });
    }

    const endDate = moment(startDate)
      .add(packageInfo.duration, "months")
      .toDate();

    // Membuat merchant baru menggunakan PrismaClient

    const newMerchantPayment: any = await prisma.merchantPayment.create({
      data: {
        pending_id,
        invoice_id: existingPaymentPending.invoice_id,
        status: existingPaymentPending.status,
      },
    });

    const newMerchant: any = await prisma.merchant.create({
      data: {
        start_date: startDate,
        end_date: endDate,
        api_key: generateApiKey(),
        package_id: plan,
        pending_id: pending_id,
        merchant_payment_id: newMerchantPayment.merchant_payment_id,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"RentalinAja" <no-reply@gmail.com>',
      to: existingPaymentPending.merchant_email,
      subject: "Aktivasi Akun Anda",
      text: "Halo! Terima kasih telah mendaftar. Silakan klik link berikut untuk mengaktifkan akun Anda: http://localhost:3000/dashboard/login",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0275d8; padding: 20px 0;">
              <h1 style="color: #ffffff; margin: 0; padding: 0 20px;">Selamat Datang di RentalinAja!</h1>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px;">Hai,</p>
              <p style="font-size: 16px;">Terima kasih telah mendaftar di RentalinAja. Kami senang Anda bergabung dengan kami. Untuk menyelesaikan proses pendaftaran dan mengaktifkan akun Anda, silakan klik tombol di bawah ini:</p>
              <a href="http://localhost:3000/dashboard/login"
                style="display: inline-block; background-color: #0275d8; color: #ffffff; padding: 12px 24px; font-size: 18px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Aktifkan Akun Anda
              </a>
              <p style="font-size: 16px;">Jika tombol di atas tidak bekerja, salin dan tempel tautan berikut ke browser Anda:</p>
              <p style="font-size: 16px;"><a href="http://localhost:3000/dashboard/login" style="color: #0275d8;">http://localhost:3000/dashboard/login</a></p>
              <p style="font-size: 16px;">Jika Anda memiliki pertanyaan atau butuh bantuan lebih lanjut, jangan ragu untuk membalas email ini atau menghubungi support kami.</p>
            </div>
            <div style="background-color: #f0f0f0; padding: 20px; font-size: 14px; text-align: left;">
              <p>Salam Hangat,<br/>Tim RentalinAja</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Merchant berhasil dibuat:", newMerchant);

    return newMerchantPayment;
    return newMerchant;
  } catch (error) {
    console.error("Terjadi kesalahan dalam membuat merchant:", error);
    throw new Error("Terjadi kesalahan dalam membuat merchant");
  }
};

// Function to update payment status
export async function updatePaymentStatus(
  externalId: string,
  newStatus: string
) {
  try {
    // Check if the record exists
    const transaction = await prisma.merchantPendingPayment.findUnique({
      where: { invoice_id: externalId },
    });

    if (!transaction) {
      // Tidak melakukan apa pun jika transaksi tidak ditemukan
      return;
    }

    // Update the status if the record exists
    const updatedTransaction = await prisma.merchantPendingPayment.update({
      where: { invoice_id: externalId },
      data: { status: newStatus },
    });

    console.log("Status pembayaran berhasil diperbarui:", updatedTransaction);

    // Jika status baru adalah "PAID", panggil fungsi createMerchant
    if (newStatus === "PAID") {
      await createMerchant({
        pending_id: transaction.pending_id,
        plan: transaction.package_id,
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
