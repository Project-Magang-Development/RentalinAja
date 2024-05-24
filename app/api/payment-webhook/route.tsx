import { NextRequest, NextResponse } from "next/server";
import { updateExpiredStatus, updatePaymentStatus } from "@/lib/updatePayment";
import { updateOrderFinish } from "@/lib/updateOrderPayment";
import { updatePaymentMethodByExternalId } from "@/lib/updateCustomerPayments";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    if (!body || !body.status || !body.external_id) {
      console.log("Invalid payload");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const externalId = body.external_id;
    const status = body.status;
    const paymentMethod = body.payment_method || "Default Payment Method";

    if (status === "PAID") {
      console.log(
        `Invoice has been paid with status ${status} and external_id ${externalId}`
      );

      // Update payment status
      const paymentStatusResult = await updatePaymentStatus(externalId, "PAID");
      if (paymentStatusResult) {
        console.log(
          `Payment status for external_id ${externalId} updated to PAID`
        );
      } else {
        console.log(
          `Payment with external_id ${externalId} not found for updatePaymentStatus.`
        );
      }

      // Update order finish status
      const orderFinishResult = await updateOrderFinish(externalId, "PAID");
      if (orderFinishResult) {
        console.log(
          `Order with external_id ${externalId} has been marked as PAID`
        );
      } else {
        console.log(
          `Order with external_id ${externalId} not found for updateOrderFinish.`
        );
      }

      // Update payment method
      const paymentMethodResult = await updatePaymentMethodByExternalId(
        externalId,
        paymentMethod
      );
      if (paymentMethodResult) {
        console.log(
          `Payment method for external_id ${externalId} updated to ${paymentMethod}`
        );
      } else {
        console.log(
          `Payment with external_id ${externalId} not found for updatePaymentMethodByExternalId.`
        );
      }

      return NextResponse.json({ success: true, body }, { status: 200 });
    } else if (status === "EXPIRED") {
      console.log(`Invoice has expired with external_id ${externalId}`);

      const expiredResult = await updateExpiredStatus(externalId, "EXPIRED");
      if (expiredResult) {
        console.log(
          `Payment status for external_id ${externalId} updated to EXPIRED`
        );
      } else {
        console.log(
          `Payment with external_id ${externalId} not found for updateExpiredStatus.`
        );
      }

      return NextResponse.json("Expired!", { status: 200 });
    } else {
      console.log(`Unhandled status: ${status}`);
      return NextResponse.json("Unhandled status", { status: 400 });
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json("An error occurred: " + error, { status: 500 });
  }
}
