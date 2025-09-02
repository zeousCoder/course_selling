// app/api/razorpay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // 1) Verify webhook signature over raw body
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 2) Parse the event
  const event = JSON.parse(raw);

  if (event.event === "payment.captured") {
    const p = event.payload.payment.entity as {
      id: string;
      order_id: string;
      method?: string;
      email?: string | null;
      contact?: string | null;
    };

    // Find the local order using the Razorpay order id
    const o = await prisma.order.findFirst({
      where: { razorpayOrderId: p.order_id },
      select: { id: true, userId: true, plan: true, status: true },
    });

    if (o) {
      // 3) Idempotent DB updates: mark payment captured, order paid, and grant enrollment
      await prisma.$transaction(async (tx) => {
        await tx.payment.updateMany({
          where: { orderId: o.id },
          data: {
            status: "CAPTURED",
            razorpayPaymentId: p.id,
            method: p.method,
            email: p.email ?? null,
            contact: p.contact ?? null,
            rawResponse: event, // persists the full webhook payload for audit
          },
        });

        // Update order to PAID only if not already terminal success
        if (o.status !== "PAID") {
          await tx.order.update({
            where: { id: o.id },
            data: { status: "PAID" },
          });
        }

        // Upsert Enrollment to ensure one entitlement per user+plan (idempotent)
        // Requires: model Enrollment with @@unique([userId, plan]) and orderId @unique
        await tx.enrollment.upsert({
          where: { userId_plan: { userId: o.userId, plan: o.plan } },
          create: { userId: o.userId, plan: o.plan, orderId: o.id },
          update: {},
        });
      });
    }
  }

  // You can handle other events (payment.failed, refund.processed, etc.) similarly if needed
  return NextResponse.json({ ok: true });
}
