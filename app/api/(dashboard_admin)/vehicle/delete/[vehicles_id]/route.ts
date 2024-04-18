import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
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

    if (!vehicles_id) {
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

    try {
      const vehicle = await prisma.vehicle
        .findUnique({
          where: { vehicles_id: Number(vehicles_id) },
        })
        .catch((error) => {
          throw error;
        });

      // Check if vehicle exists and belongs to the tenant
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

      await prisma.vehicle
        .delete({
          where: { 
            vehicles_id: Number(vehicles_id),
           },
        })
        .catch((error) => {
          throw error;
        });

      return new NextResponse(
        JSON.stringify({
          message: "Vehicle deleted successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      // Add a catch block for any errors
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
    // Add await to disconnect() call and catch any errors
    await prisma.$disconnect().catch((error) => {
      console.error("Error disconnecting from database:", error);
    });
  }
}
