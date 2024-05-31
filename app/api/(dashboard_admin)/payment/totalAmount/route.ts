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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const totalAmount = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        merchant_id: decoded.merchantId,
        AND: [
          {
            payment_date: {
              gte: startDate,
            },
          },
          {
            payment_date: {
              lte: endDate,
            },
          },
          {
            status: "PAID",
          },
        ],
      },
    });

    return new NextResponse(JSON.stringify(totalAmount), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error or Invalid Token" }),
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
