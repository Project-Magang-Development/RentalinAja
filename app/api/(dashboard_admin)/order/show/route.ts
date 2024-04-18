import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const tokenHeader = req.headers.get("Authorization");
    const token = tokenHeader?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token not provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        merchantId: number;
      };
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const statusQuery = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: {
        merchant_id: decoded.merchantId,
        ...(statusQuery && { status: statusQuery }), 
      },
      orderBy: {
        order_id: "desc",
      },
      include: {
        Schedule: {
          include: {
            Vehicle: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(orders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new Response(
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
