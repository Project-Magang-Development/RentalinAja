import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const year = parseInt(pathnameParts[pathnameParts.length - 1]); // Pastikan tahun di-parse ke integer

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

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const bookings = await prisma.payment.findMany({
      where: {
        status: "PAID",
        AND: [
          { merchant_id: decoded.merchantId },
          { payment_date: { gte: startDate, lt: endDate } },
        ],
      },
    });

    const paymentsPerMonth = bookings.reduce((acc: any, payment) => {
      // Pastikan bahwa payment_date ada dan bukan null sebelum mengakses getMonth
      const month = payment.payment_date?.getMonth();
      if (month !== undefined) {
        // Pastikan month bukan undefined (kasus ketika payment_date adalah null)
        if (!acc[month]) {
          acc[month] = { month: month + 1, amount: 0 };
        }
        acc[month].amount += payment.amount; // Tambahkan jumlah amount untuk booking di bulan tersebut
      }
      return acc;
    }, {});

    const formattedData = Object.values(paymentsPerMonth);

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
