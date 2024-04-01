import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dateRange, capacity } = body;
    const [startDate, endDate] = dateRange;

    const bookedVehiclesIds = await prisma.booking.findMany({
      where: {
        OR: [
          {
            start_date: {
              lte: new Date(endDate),
            },
            end_date: {
              gte: new Date(startDate),
            },
          },
        ],
      },
      select: {
        schedules_id: true,
      },
    });

    const bookedVehiclesScheduleIds = bookedVehiclesIds.map(
      (b) => b.schedules_id
    );

    const availableSchedules = await prisma.schedule.findMany({
      where: {
        AND: [
          {
            Vehicle: {
              capacity: {
                gte: capacity,
              },
            },
          },
          {
            NOT: {
              schedules_id: {
                in: bookedVehiclesScheduleIds,
              },
            },
          },
          {
            OR: [
              {
                start_date: {
                  lte: new Date(endDate),
                },
                end_date: {
                  gte: new Date(startDate),
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

    const groupedByVehicle = availableSchedules.reduce((acc: any, curr) => {
      const key = `${curr.Vehicle.name}-${curr.Vehicle.model}`;
      if (!acc[key]) {
        acc[key] = curr;
      }
      return acc;
    }, {});

    const uniqueVehicles = Object.values(groupedByVehicle);

    return new Response(JSON.stringify(uniqueVehicles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error accessing database:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
