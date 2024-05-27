import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const vehicles_id = pathnameParts[pathnameParts.length - 1];

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
    const { name, capacity, model, year, no_plat, imageUrl } = body;
    if (
      !name ||
      !capacity ||
      !model ||
      !year ||
      !no_plat ||
      !Array.isArray(imageUrl) ||
      imageUrl.length === 0
    ) {
      return new NextResponse(
        JSON.stringify({
          error:
            "Please provide all required fields and at least one image URL",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: { vehicles_id: String(vehicles_id) },
        include: { VehicleImages: true }, 
      });

      if (!vehicle || vehicle.merchant_id !== decoded.merchantId) {
        return new NextResponse(
          JSON.stringify({ error: "Vehicle not found or access denied" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const updatedVehicle = await prisma.vehicle.update({
        where: { vehicles_id: String(vehicles_id) },
        data: {
          name,
          capacity,
          model,
          year,
          no_plat,
          VehicleImages: {
            deleteMany: {}, 
            createMany: {
              data: imageUrl.map((url: string) => ({ imageUrl: url })),
            },
          },
          merchant_id: decoded.merchantId,
        },
        include: { VehicleImages: true }, // Sertakan juga VehicleImages dalam respons
      });

      return new NextResponse(
        JSON.stringify({
          message: "Vehicle updated successfully",
          vehicle: updatedVehicle,
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
    }
  } finally {
    await prisma.$disconnect().catch((error) => {
      console.error("Error disconnecting from database:", error);
    });
  }
}
