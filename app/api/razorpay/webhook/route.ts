// app/api/razorpay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest("hex");
  if (expected !== signature)
    return NextResponse.json({ ok: false }, { status: 400 });

  const event = JSON.parse(raw);
  if (event.event === "payment.captured") {
    const p = event.payload.payment.entity;
    const o = await prisma.order.findFirst({
      where: { razorpayOrderId: p.order_id },
    });
    if (o) {
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: { orderId: o.id },
          data: {
            status: "CAPTURED",
            razorpayPaymentId: p.id,
            method: p.method,
            email: p.email ?? null,
            contact: p.contact ?? null,
            rawResponse: event,
          },
        }),
        prisma.order.update({ where: { id: o.id }, data: { status: "PAID" } }),
      ]);
    }
  }
  return NextResponse.json({ ok: true });
}
