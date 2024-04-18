import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      schedules_id,
      start_date,
      end_date,
      customer_name,
      merchant_id,
      price,
      token,
    } = body;

    if (
      !schedules_id ||
      !start_date ||
      !end_date ||
      !customer_name ||
      !merchant_id ||
      !price ||
      !token
    ) {
      throw new Error("Missing required fields");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        email: string;
        merchant_company: string;
      };
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const existingBooking = await prisma.order.findFirst({
      where: {
        schedules_id: Number(schedules_id),
        AND: [
          {
            OR: [
              { start_date: { lte: endDate }, end_date: { gte: startDate } }, // Bentrok dengan periode yang ada
              { start_date: { gte: startDate }, end_date: { lte: endDate } }, // Periode yang ada di dalam periode yang diminta
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      throw new Error("The requested booking period is not available");
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = price * diffDays;

    const order = await prisma.order.create({
      data: {
        schedules_id: Number(schedules_id),
        start_date: startDate,
        end_date: endDate,
        customer_name,
        total_amount: totalPrice,
        merchant_id: Number(merchant_id),
      },
    });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"RentalinAja" <no-reply@gmail.com>',
      to: decoded.email,
      subject: "Ada Yang Order Nih!",
      html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #0275d8; padding: 20px 0;">
      <h1 style="color: #ffffff; margin: 0; padding: 0 20px;">Ada Yang Order Nih!</h1>
    </div>
    <div style="padding: 20px;">
      <p style="font-size: 16px;">Hai ${decoded.merchant_company},</p>
      <p style="font-size: 16px;">Ada order baru dengan detail sebagai berikut:</p>
      <ul style="text-align: left;">
        <li>Nama Customer: ${customer_name}</li>
        <li>Tanggal Mulai: ${start_date}</li>
        <li>Tanggal Berakhir: ${end_date}</li>
        <li>Harga: ${totalPrice}</li>
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

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error accessing database or validating data:", error);
    return new NextResponse(JSON.stringify("Internal Server Error"), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
