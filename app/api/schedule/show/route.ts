import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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
        merchantId: number;
      };
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const schedule = await prisma.schedule.findMany({
      where: {
        merchant_id: decoded.merchantId,
        Merchant: {
          status_subscriber: "Aktif"
        }
      },
      include: {
        Vehicle: true, 
      },
    });

    return new NextResponse(JSON.stringify(schedule), {
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
