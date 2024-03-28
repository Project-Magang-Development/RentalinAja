import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
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
     const { name, capacity, model, year} = body;

     if (!name || !capacity ||  !model || !year ) {
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
        where: 
        { vehicles_id: Number(vehicles_id), 
          
        },
        data: {
          name,
          capacity,
          model,
          year,
          merchant_id: decoded.merchantId,
        },
      });

      return new NextResponse(
        JSON.stringify({
          message: "Vehicle update successfully",
          vehicle: updatedVehicle
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
