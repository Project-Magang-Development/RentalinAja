import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schedules_id, start_date, end_date, customer_name, merchant_id, price } = body;

    if (
      !schedules_id ||
      !start_date ||
      !end_date ||
      !customer_name ||
      !merchant_id ||
      !price
    ) {
      throw new Error("Missing required fields");
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalPrice = price * diffDays;

    const booking = await prisma.booking.create({
      data: {
        schedules_id: Number(schedules_id),
        start_date: startDate,
        end_date: endDate,
        customer_name,
        total_amount: totalPrice,
        merchant_id: Number(merchant_id),
      },
    });

    return new NextResponse(JSON.stringify(booking), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error accessing database or validating data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
