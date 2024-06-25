import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
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
    const {
      name,
      capacity,
      model,
      year,
      no_plat,
      mainImage,
      additionalImages,
    } = body;

    if (
      !name ||
      !capacity ||
      !model ||
      !year ||
      !no_plat ||
      !mainImage ||
      !additionalImages ||
      !Array.isArray(additionalImages)
    ) {
      return new NextResponse(
        JSON.stringify({
          error:
            "Please provide all required fields, a main image, and additional images",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const imageUrl = [mainImage, ...additionalImages];

    const merchant = await prisma.merchant.findUnique({
      where: { merchant_id: decoded.merchantId },
      include: { package: true, vehicles: true },
    });

    if (!merchant) {
      return new NextResponse(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (
      merchant.package.count_vehicle !== null &&
      merchant.used_storage_vehicle >= merchant.package.count_vehicle
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Vehicle limit exceeded" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        name,
        capacity,
        model,
        year,
        no_plat,
        merchant_id: decoded.merchantId,
      },
    });

    const vehicleImages = await Promise.all(
      imageUrl.map((url, index) =>
        prisma.vehicleImage.create({
          data: {
            imageUrl: url,
            index: index,
            vehicles_id: newVehicle.vehicles_id,
          },
        })
      )
    );

    const updatedMerchant = await prisma.merchant.update({
      where: { merchant_id: decoded.merchantId },
      data: { used_storage_vehicle: { increment: 1 } },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Vehicle created successfully",
        vehicle: newVehicle,
        vehicleImages,
        updatedStorage: updatedMerchant.used_storage_vehicle,
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
