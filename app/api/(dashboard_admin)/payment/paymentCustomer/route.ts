import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const {
      order_id,
      merchant_id,
      external_id,
      amount,
      payment_method,
      status,
      payment_date,
      imageUrl, // Pastikan imageUrl termasuk dalam body
    } = body;

    // Validasi input
    if (
      !order_id ||
      !merchant_id ||
      !external_id ||
      !amount ||
      !payment_method
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Simpan data pembayaran ke dalam database
      const payment = await prisma.payment.create({
        data: {
          order_id,
          merchant_id,
          external_id,
          amount,
          payment_method,
          status: status || "Pending",
          payment_date: payment_date ? new Date(payment_date) : null,
        },
      });

      // Buat pemesanan baru dengan order_id dan payment_id
      const newBooking = await prisma.booking.create({
        data: {
          order_id,
          payment_id: payment.payment_id, // Gunakan payment_id dari pembayaran yang baru dibuat
          merchant_id,
          imageUrl, // Optional field
        },
      });

      return NextResponse.json(
        { payment, booking: newBooking },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating payment:", error);
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 }
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}
