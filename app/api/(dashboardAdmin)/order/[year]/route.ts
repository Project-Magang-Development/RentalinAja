import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const year = pathnameParts[pathnameParts.length - 1];

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

    if (!year) {
      return new NextResponse(
        JSON.stringify({ error: "Please provide a year" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const bookings = await prisma.order.findMany({
      where: {
        status: "Berhasil",
        AND: [
          { start_date: { gte: new Date(`${year}-01-01`) } },
          { start_date: { lte: new Date(`${year}-12-31`) } },
          { merchant_id: decoded.merchantId },
          
        ],
      },
    });

    const bookingsPerMonth = bookings.reduce((acc: any, booking) => {
      const month = booking.start_date.getMonth();
      if (!acc[month]) {
        acc[month] = { month: month + 1, count: 0 };
      }
      acc[month].count += 1;
      return acc;
    }, {});

    const formattedData = Object.values(bookingsPerMonth);

    return new NextResponse(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
