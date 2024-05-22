import { NextRequest, NextResponse } from "next/server";
import { updateExpiredStatus, updatePaymentStatus } from "@/lib/updatePayment";

import { updateOrderFinish } from "@/lib/updateOrderPayment";
import { updatePaymentMethodByExternalId } from "@/lib/updateCustomerPayments";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    if (body && body.status === "PAID" && body.external_id) {
      console.log(
        `Invoice has been paid with status ${body.status} and external_id ${body.external_id}`
      );

      // Update order finish status first
      await updateOrderFinish(body.external_id, "PAID");

      // Get the payment method from the request body
      const paymentMethod = body.payment_method || "Default Payment Method";

      // Update payment status and payment method after order finish status is updated
      const updatePaymentResults = await Promise.allSettled([
        updatePaymentStatus(body.external_id, "PAID"),
        updatePaymentMethodByExternalId(body.external_id, paymentMethod),
      ]);

      updatePaymentResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Error updating payment record ${index + 1}:`,
            result.reason
          );
        }
      });

      return NextResponse.json({ success: true, body }, { status: 200 });
    } else if (body && body.status === "EXPIRED" && body.external_id) {
      console.log(`Invoice has expired with external_id ${body.external_id}`);

      const updates = [updateExpiredStatus(body.external_id, "EXPIRED")];

      const results = await Promise.allSettled(updates);

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Error updating record ${index + 1}:`, result.reason);
        }
      });

      return NextResponse.json("Expired!", { status: 200 });
    } else if (body && body.status === "FINISH" && body.external_id) {
      console.log(`Order has finished with external_id ${body.external_id}`);

      const updates = [updateOrderFinish(body.external_id, "FINISH")];

      const results = await Promise.allSettled(updates);

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Error updating record ${index + 1}:`, result.reason);
        }
      });

      return NextResponse.json("Order finished!", { status: 200 });
    } else {
      console.log(`Invoice failed to be paid with status ${body.status}`);
      return NextResponse.json("Failed!", { status: 200 });
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json("An error occurred: " + error, { status: 500 });
  }
}
