import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import moment from "moment"; // Ensure you have moment.js installed or use a native Date method

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, password, domain, plan } = body;

    if (!name || !company || !email || !password || !domain || !plan) {
      return NextResponse.json({ error: "Please provide all required fields" });
    }

    const existingUser = await prisma.merchant.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const startDate = new Date();
    let endDate = moment(startDate);

    switch (plan) {
      case "3 Months":
        endDate = endDate.add(3, "months");
        break;
      case "6 Months":
        endDate = endDate.add(6, "months");
        break;
      case "12 Months":
        endDate = endDate.add(12, "months");
        break;
      default:
        return NextResponse.json({ error: "Invalid plan duration" });
    }

    const newUser = await prisma.merchant.create({
      data: {
        merchant_name: name,
        merchant_company: company,
        domain: domain,
        email,
        password: hashedPassword,
        start_date: startDate,
        end_date: endDate.toDate(),
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error accessing database:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
