import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const pathnameParts = url.pathname.split("/");
  const package_id = pathnameParts[pathnameParts.length - 1];

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

    const body = await req.json();
    const {
      package_name,
      package_description,
      package_feature,
      package_price,
      count,
      duration,
    } = body;
    let featureList = [];
    if (package_feature) {
      featureList = package_feature.split(", ");
    }

    console.log("Received body:", body);

    if (
      package_name == null ||
      package_price == null ||
      package_description == null ||
      package_feature == null ||
      count == null ||
      duration == null
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "Please provide all required fields",
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
      const packages = await prisma.package.findUnique({
        where: { package_id: String(package_id) },
      });

      if (!packages) {
        return new NextResponse(
          JSON.stringify({ error: "Package not found or access denied" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const updatedPackage = await prisma.package.update({
        where: { package_id: String(package_id) },
        data: {
          package_name,
          package_price,
          package_description,
          package_feature,
          count_order: count,
          count_vehicle: count,
          duration,
        },
      });

      return new NextResponse(
        JSON.stringify({
          message: "Package updated successfully",
          package: updatedPackage,
          features: featureList,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating package:", error);
      return new NextResponse(
        JSON.stringify({ error: "Internal Server Error" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return new NextResponse(JSON.stringify({ error: "Invalid Request" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    await prisma.$disconnect().catch((error) => {
      console.error("Error disconnecting from database:", error);
    });
  }
}
