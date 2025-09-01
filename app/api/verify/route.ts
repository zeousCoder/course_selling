// app/api/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    body ?? {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { success: false, error: "Missing params" },
      { status: 400 }
    );
  }

  const h = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  h.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = h.digest("hex");
  const ok = digest === razorpay_signature;

  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: razorpay_order_id },
  });
  if (!order)
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );

  await prisma.$transaction([
    prisma.payment.updateMany({
      where: { orderId: order.id },
      data: {
        status: ok ? "CAPTURED" : "FAILED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        rawResponse: body,
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { status: ok ? "PAID" : "FAILED" },
    }),
  ]);

  return NextResponse.json({ success: ok });
}
