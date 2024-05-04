import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const tokenHeader = req.headers.get("Authorization");
    const token = tokenHeader?.split(" ")[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token not provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        merchantId: string;
      };
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const merchant = await prisma.merchant.findUnique({
      where: {
        merchant_id: decoded.merchantId, 
      },
      select: {
        used_storage: true, 
      },
    });

    if (!merchant) {
      return new NextResponse(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(
      JSON.stringify({ used_storage: merchant.used_storage }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error or Invalid Token" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
