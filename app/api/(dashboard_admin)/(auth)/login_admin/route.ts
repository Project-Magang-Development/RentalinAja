import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Cari merchantPendingPayment berdasarkan email
    const merchantPendingPayment =
      await prisma.merchantPendingPayment.findFirst({
        where: {
          merchant_email: email,
        },
      });

    if (!merchantPendingPayment) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ambil pending_id dari merchantPendingPayment
    const pendingId = merchantPendingPayment.pending_id;

    // Cari merchant berdasarkan pending_id dari merchantPendingPayment
    const merchant = await prisma.merchant.findFirst({
      where: {
        MerchantPendingPayment: {
          pending_id: pendingId,
        },
        status_subscriber: "Aktif",
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "User not found or not active" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      merchantPendingPayment.password
    );
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        merchantId: merchant.merchant_id,
        email: merchantPendingPayment.merchant_email,
        merchant_name: merchantPendingPayment.merchant_name,
        api_key: merchant.api_key,
      },
      process.env.JWT_SECRET as string
    );

    return NextResponse.json({token});
  } catch (error) {
    console.error("Error accessing database:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
