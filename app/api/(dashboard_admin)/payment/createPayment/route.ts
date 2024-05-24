import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      invoice_id,
      package_name,
      merchant_name,
      merchant_email,
      merchant_whatsapp,
      rental_name,
      rental_type,
      merchant_city,
      merchant_address,
      merchant_id,
    } = body;

    // TODO: taruh  code ini di bagian updatePaymentMerchant untuk webhook
    // // Cek apakah merchant dengan merchant_id tersebut ada
    // const existingMerchant = await prisma.merchant.findUnique({
    //   where: {
    //     merchant_id: merchant_id,
    //   },
    // });

    // // Jika merchant tidak ditemukan, kirim respon error
    // if (!existingMerchant) {
    //   return new NextResponse(JSON.stringify({ error: "Merchant not found" }), {
    //     status: 404,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    // }
    // Dapatkan tanggal saat ini
    const paymentDate = new Date();
    // Tentukan status pembayaran
    let status = "Pending";
    if (amount === 0) {
      status = "PAID";
    }
    // TODO: sesuaikan dengan model/ table
    // Create the payment with the obtained merchant_id and payment date
    const newPayment = await prisma.merchantPayment.create({
      data: {
        amount,
        invoice_id,
        package_name,
        status,
        merchant_name,
        merchant_email,
        merchant_whatsapp,
        rental_name,
        rental_type,
        merchant_city,
        merchant_address,
        merchant_id, // Connect the payment with the merchant using the obtained merchant_id
        payment_date: paymentDate, // Set the payment date to the current date
      },
    });
    return NextResponse.json(
      { message: "Data berhasil disimpan", newPayment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan saat menyimpan data:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Terjadi kesalahan saat menyimpan data",
        message: error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect();
  }
}
