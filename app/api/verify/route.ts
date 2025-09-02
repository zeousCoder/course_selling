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

  // 1) Verify signature per Razorpay docs: HMAC_SHA256(order_id|payment_id, key_secret)
  const h = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  h.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = h.digest("hex");
  const ok = digest === razorpay_signature; // true if authentic [1][2]

  // 2) Find local order
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: razorpay_order_id },
    select: { id: true, userId: true, plan: true, status: true },
  });
  if (!order) {
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  }

  // 3) Update DB in a transaction. If ok, capture + pay + upsert enrollment; else mark failed.
  try {
    await prisma.$transaction(async (tx) => {
      // Update payment row(s) linked to this order
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: {
          status: ok ? "CAPTURED" : "FAILED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          rawResponse: body,
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: order.id },
        data: { status: ok ? "PAID" : "FAILED" },
      });

      // On success, grant enrollment idempotently
      if (ok) {
        // Requires Enrollment model with @@unique([userId, plan]) and orderId @unique
        await tx.enrollment.upsert({
          where: { userId_plan: { userId: order.userId, plan: order.plan } },
          create: { userId: order.userId, plan: order.plan, orderId: order.id },
          update: {}, // idempotent upsert [7]
        });
      }
    });
  } catch (err: any) {
    // Handle potential unique constraint race gracefully
    const isUnique = err?.code === "P2002";
    if (!ok && !isUnique) {
      return NextResponse.json(
        { success: false, error: "DB update failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: ok });
}
