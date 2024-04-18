import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
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
        merchantId: number;
      };
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { startDate, endDate } = body;

    // Find all schedules that clash with the given date range for a specific merchant
    const bookedSchedules = await prisma.schedule.findMany({
      where: {
        AND: [
          { merchant_id: decoded.merchantId },
          {
            OR: [
              {
                start_date: { lte: new Date(endDate) },
                end_date: { gte: new Date(startDate) },
              },
            ],
          },
        ],
      },
      select: {
        vehicles_id: true,
      },
    });

    const bookedVehicleIds = bookedSchedules.map(
      (schedule) => schedule.vehicles_id
    );

    // Find all vehicles not in the bookedVehicleIds for the same merchant
    const availableVehicles = await prisma.vehicle.findMany({
      where: {
        AND: [
          { merchant_id: decoded.merchantId },
          {
            NOT: {
              vehicles_id: {
                in: bookedVehicleIds,
              },
            },
          },
        ],
      },
      orderBy: {
        vehicles_id: "desc",
      },
    });

    return new Response(JSON.stringify(availableVehicles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error accessing database:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
