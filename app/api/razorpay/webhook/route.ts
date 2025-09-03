// app/api/razorpay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  // 1) Verify webhook signature
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = JSON.parse(raw);

  if (event.event === "payment.captured") {
    const p = event.payload.payment.entity;

    const o = await prisma.order.findFirst({
      where: { razorpayOrderId: p.order_id },
      select: { id: true, userId: true, plan: true, status: true },
    });

    if (o) {
      await prisma.$transaction(async (tx) => {
        // 1) Update the payment row (match on razorpayPaymentId if unique)
        await tx.payment.updateMany({
          where: { orderId: o.id },
          data: {
            status: "CAPTURED",
            razorpayPaymentId: p.id,
            method: p.method,
            email: p.email ?? null,
            contact: p.contact ?? null,
            rawResponse: event,
          },
        });

        // 2) Update order → PAID
        if (o.status !== "PAID") {
          await tx.order.update({
            where: { id: o.id },
            data: { status: "PAID" },
          });
        }

        // 3) Grant enrollment (idempotent)
        await tx.enrollment.upsert({
          where: { userId_plan: { userId: o.userId, plan: o.plan } },
          create: { userId: o.userId, plan: o.plan, orderId: o.id },
          update: {},
        });
      });
    }
  }

  return NextResponse.json({ ok: true });
}
