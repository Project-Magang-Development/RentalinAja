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
        merchantId: number;
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

    let vehicles;

    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // Get all vehicles
      const allVehicles = await prisma.vehicle.findMany({
        where: { merchant_id: decoded.merchantId },
        orderBy: { vehicles_id: "desc" },
      });

      // Find overlapping orders
      const overlappingOrders = await prisma.order.findMany({
        where: {
          AND: [
            { merchant_id: decoded.merchantId },
            {
              OR: [
                {
                  start_date: { lte: endDate },
                  end_date: { gte: startDate },
                },
              ],
            },
          ],
        },
        include: { Schedule: true },
      });

      // Extract booked vehicle IDs
      const bookedVehicleIds = overlappingOrders.map(
        (order) => order.Schedule.vehicles_id
      );

      // Mark availability
      vehicles = allVehicles.map((vehicle) => ({
        ...vehicle,
        status: bookedVehicleIds.includes(vehicle.vehicles_id)
          ? "Tidak Tersedia"
          : "Tersedia",
      }));
    } else {
      vehicles = await prisma.vehicle.findMany({
        where: { merchant_id: decoded.merchantId },
        orderBy: { vehicles_id: "desc" },
      });

      // Mark all as available if no date filters are applied
      vehicles = vehicles.map((vehicle) => ({
        ...vehicle,
        status: "Tersedia",
      }));
    }

    return new NextResponse(JSON.stringify(vehicles), {
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
