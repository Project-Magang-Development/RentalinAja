import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const vehicles_id = pathnameParts[pathnameParts.length - 1];

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        vehicles_id: Number(vehicles_id),
      },
      include:  {
        Schedules: true,
      }
    });

    if (!vehicle) {
      return new NextResponse(JSON.stringify({ error: "Vehicle not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify(vehicle), {
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
