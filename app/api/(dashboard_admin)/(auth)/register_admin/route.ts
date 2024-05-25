import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import moment from "moment";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pending_id, plan } = body;

    if (!plan || !pending_id) {
      return NextResponse.json({ error: "Please provide pending_id and plan" });
    }

    // Check if the pending payment exists
    const merchantPendingPayment =
      await prisma.merchantPendingPayment.findUnique({
        where: { pending_id },
      });
    if (!merchantPendingPayment) {
      return NextResponse.json({ error: "Invalid pending payment ID" });
    }

    const startDate = new Date();

    // Get the package details
    const packageInfo = await prisma.package.findUnique({
      where: { package_id: plan },
    });
    if (!packageInfo) {
      return NextResponse.json({ error: "Invalid plan ID" });
    }

    const endDate = moment(startDate)
      .add(packageInfo.duration, "months")
      .toDate();

    const generateApiKey = () => crypto.randomBytes(32).toString("hex");

    // Create the new merchant payment
    const newMerchantPayment: any = await prisma.merchantPayment.create({
      data: {
        pending_id,
        invoice_id: merchantPendingPayment.invoice_id,
        status: merchantPendingPayment.status,
      },
    });

    // Create the new merchant
    const newMerchant: any = await prisma.merchant.create({
      data: {
        start_date: startDate,
        end_date: endDate,
        api_key: generateApiKey(),
        package_id: plan,
        pending_id: merchantPendingPayment.pending_id,
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
      to: merchantPendingPayment.merchant_email,
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

    return NextResponse.json({
      message:
        "User and payment created successfully. Activation email has been sent.",
      user: newMerchant,
      payment: newMerchantPayment,
    });
  } catch (error) {
    console.error("Error accessing database or sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
