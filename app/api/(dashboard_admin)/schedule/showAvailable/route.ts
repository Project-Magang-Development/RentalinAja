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

    const url = new URL(req.url);
    const startDateStr = url.searchParams.get("startDate");
    const endDateStr = url.searchParams.get("endDate");

    if (!startDateStr || !endDateStr) {
      return new NextResponse(
        JSON.stringify({ error: "Start and end dates are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const schedules = await prisma.schedule.findMany({
      where: {
        AND: [
          {
            Vehicle: {
              merchant_id: decoded.merchantId,
            },
          },
          {
            NOT: [
              {
                orders: {
                  some: {
                    OR: [
                      { start_date: { lte: endDate } },
                      { end_date: { gte: startDate } },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        Vehicle: true,
      },
    });

    return new NextResponse(JSON.stringify(schedules), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
