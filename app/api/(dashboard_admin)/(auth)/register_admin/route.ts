import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import moment from "moment";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pending_id, plan, email } = body;

    if (!plan || !email) {
      return NextResponse.json(
        { error: "Please provide plan and email" },
        { status: 400 }
      );
    }

    const merchantPendingPayment =
      await prisma.merchantPendingPayment.findUnique({
        where: { pending_id },
      });

    if (!merchantPendingPayment) {
      return NextResponse.json(
        { error: "Pending payment not found" },
        { status: 404 }
      );
    }

    // Get the package details
    const packageInfo = await prisma.package.findUnique({
      where: { package_id: plan },
    });

    if (!packageInfo) {
      return NextResponse.json({ error: "Invalid plan ID" });
    }

    const startDate = new Date();
    const endDate = moment(startDate)
      .add(packageInfo.duration, "months")
      .toDate();

    const generateApiKey = () => crypto.randomBytes(32).toString("hex");

    // Check if a merchant exists with the given email
    let merchantData = await prisma.merchant.findUnique({
      where: { merchant_email: email },
    });

    let responseMessage;

    // Create a new merchant payment record
    const newMerchantPayment = await prisma.merchantPayment.create({
      data: {
        pending_id: merchantPendingPayment.pending_id,
        invoice_id: merchantPendingPayment.invoice_id,
        status: merchantPendingPayment.status,
      },
    });

    if (merchantData) {
      merchantData = await prisma.merchant.update({
        where: { merchant_email: merchantData.merchant_email },
        data: {
          pending_id: merchantPendingPayment.pending_id,
          merchant_payment_id: newMerchantPayment.merchant_payment_id,
          start_date: startDate,
          end_date: endDate,
          package_id: plan,
          status_subscriber: "Aktif",
        },
      });

      responseMessage = "Merchant updated successfully.";
    } else {
      merchantData = await prisma.merchant.create({
        data: {
          start_date: startDate,
          end_date: endDate,
          api_key: generateApiKey(),
          package_id: plan,
          pending_id: merchantPendingPayment.pending_id,
          merchant_payment_id: newMerchantPayment.merchant_payment_id,
          status_subscriber: "Aktif",
          merchant_email: email,
          password: merchantPendingPayment.password,
        },
      });

      responseMessage =
        "User and payment created successfully. Welcome email has been sent.";
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return NextResponse.json({
      message: responseMessage,
      user: merchantData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
