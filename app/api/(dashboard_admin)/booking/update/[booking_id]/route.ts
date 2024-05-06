import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const booking_id = pathnameParts[pathnameParts.length - 1];

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
    const { imageUrl, storageSize } = body;

    if (!imageUrl || !storageSize) {
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

    try {
      const booking = await prisma.booking
        .findUnique({
          where: { booking_id: String(booking_id) },
        })
        .catch((error) => {
          throw error;
        });

      if (!booking || booking.merchant_id !== decoded.merchantId) {
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

      const updatedBooking = await prisma.booking.update({
        where: { booking_id: String(booking_id) },
        data: {
          imageUrl,
        },
      });

      return new NextResponse(
        JSON.stringify({
          message: "Booking update successfully",
          vehicle: updatedBooking,
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
