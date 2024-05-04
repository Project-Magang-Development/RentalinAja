import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";


export async function PUT(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const schedules_id = pathnameParts[pathnameParts.length - 1];

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

    const body = await req.json();
    const { start_date, end_date, price, vehicles_id } = body;

    if (!start_date || !end_date || !price || !vehicles_id) {
      return new NextResponse(
        JSON.stringify({ error: "Please provide all required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    // Cek apakah ada jadwal lain yang beririsan dengan tanggal baru
    const overlappingSchedule = await prisma.schedule.findMany({
      where: {
        vehicles_id,
        schedules_id: { not: String(schedules_id) }, // Pastikan jadwal yang dicek bukan jadwal yang sedang diupdate
        OR: [
          {
            start_date: {
              lte: parsedEndDate,
            },
            end_date: {
              gte: parsedStartDate,
            },
          },
        ],
      },
    });

    if (overlappingSchedule.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: "An existing schedule overlaps with the provided dates",
        }),
        {
          status: 409, // Conflict
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Lanjutkan pembaruan jadwal jika tidak ada yang beririsan
    const updatedSchedule = await prisma.schedule.update({
      where: { schedules_id: String(schedules_id) },
      data: {
        vehicles_id,
        start_date: parsedStartDate,
        end_date: parsedEndDate,
        price,
        merchant_id: decoded.merchantId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Schedule updated successfully",
        schedule: updatedSchedule,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
