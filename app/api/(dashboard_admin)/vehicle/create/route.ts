import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

    const body = await req.json();
    const { name, capacity, model, year, no_plat, imageUrl, storageSize } =
      body;

    if (
      !name ||
      !capacity ||
      !model ||
      !year ||
      !no_plat ||
      !imageUrl ||
      !storageSize
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "Please provide all required fields and the image size",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const merchant = await prisma.merchant.findUnique({
      where: { merchant_id: decoded.merchantId },
      include: { package: true }, 
    });

    if (!merchant) {
      return new NextResponse(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (merchant.used_storage + storageSize > merchant.package.storage_limit) {
      return new NextResponse(
        JSON.stringify({ error: "Storage limit exceeded" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
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
        imageUrl,
        merchant_id: decoded.merchantId,
      },
    });

    await prisma.merchant.update({
      where: { merchant_id: decoded.merchantId },
      data: { used_storage: { increment: storageSize } },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Vehicle created successfully",
        vehicle: newVehicle,
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
