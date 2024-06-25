import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const merchantEmail = await prisma.merchant.findMany({
      select: {
        merchant_email: true,
      },
    });
    return NextResponse.json({
      status: 200,
      data: merchantEmail,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
