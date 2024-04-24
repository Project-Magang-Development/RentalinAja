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
    const { vehicles_id, start_date, end_date, price } = body;

    if (!vehicles_id || !start_date || !end_date || !price) {
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

    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    const overlappingSchedule = await prisma.schedule.findMany({
      where: {
        vehicles_id,
        OR: [
          {
            start_date: {
              lte: parsedEndDate,
            },
            end_date: {
              gte: parsedStartDate,
            },
          },
          {
            start_date: {
              gte: parsedStartDate,
              lte: parsedEndDate,
            },
          },
          {
            end_date: {
              gte: parsedStartDate,
              lte: parsedEndDate,
            },
          },
        ],
      },
    });

    if (overlappingSchedule.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: "An existing schedule overlaps with the provided dates",
        }),
        {
          status: 409, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        vehicles_id,
        start_date: parsedStartDate,
        end_date: parsedEndDate,
        price,
        merchant_id: decoded.merchantId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Schedule created successfully",
        schedule: newSchedule,
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
