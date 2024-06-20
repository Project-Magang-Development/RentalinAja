import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"RentalinAja" <no-reply@gmail.com>',
      to: email,
      subject: "Aktivasi Akun Anda",
      text: "Halo! Silahkan Reset Password Anda: http://localhost:3000/confirm-password",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0275d8; padding: 20px 0;">
              <h1 style="color: #ffffff; margin: 0; padding: 0 20px;">Selamat Datang di RentalinAja!</h1>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px;">Hai,</p>
              <p style="font-size: 16px;">Silahkan Reset Password Anda. Untuk menyelesaikan proses pendaftaran dan mengaktifkan akun Anda, silakan klik tombol di bawah ini:</p>
              <a href="http://localhost:3000/confirm-password?email=${email}"
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
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
