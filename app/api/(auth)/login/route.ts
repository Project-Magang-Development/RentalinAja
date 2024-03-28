import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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

    const merchant = await prisma.merchant.findUnique({
      where: 
      { 
        email,
        status_subscriber: "Aktif"
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, merchant.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { merchantId: merchant.merchant_id, email: merchant.email, merchant_company: merchant.merchant_company },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ token });
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
