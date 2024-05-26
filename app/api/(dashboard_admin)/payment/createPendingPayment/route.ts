import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      invoice_id,
      package_name,
      package_id,
      merchant_name,
      merchant_email,
      merchant_whatsapp,
      rental_name,
      rental_type,
      merchant_city,
      merchant_address,
      status,
      password,
    } = body;

    // Dapatkan tanggal saat ini
    const paymentDate = new Date();
    // Lakukan hash pada password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pembayaran baru
    const newPayment = await prisma.merchantPendingPayment.create({
      data: {
        amount,
        invoice_id,
        package_name,
        package_id,
        status,
        merchant_name,
        merchant_email,
        merchant_whatsapp,
        rental_name,
        rental_type,
        merchant_city,
        merchant_address,
        payment_date: paymentDate,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Data berhasil disimpan", newPayment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan saat menyimpan data:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Terjadi kesalahan saat menyimpan data",
        message: error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect();
  }
}
