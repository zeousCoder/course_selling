// app/api/checkout/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/server/getSession";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { orderId, reason } = (await req.json()) as {
      orderId: string;
      reason?: string;
    };

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Find local order by Razorpay order id
    const order = await prisma.order.findFirst({
      where: { razorpayOrderId: orderId, userId },
      select: { id: true, status: true },
    });

    if (!order) {
      // If no order found, return ok to keep client simple
      return NextResponse.json({ ok: true });
    }

    // If already PAID or FAILED/CANCELED, do nothing (idempotent)
    if (order.status !== "PENDING" && order.status !== "CREATED") {
      return NextResponse.json({ ok: true });
    }

    // Update order -> CANCELED, latest payment -> FAILED
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELED" },
      });

      const lastPayment = await tx.payment.findFirst({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
      });

      if (lastPayment && lastPayment.status === "CREATED") {
        await tx.payment.update({
          where: { id: lastPayment.id },
          data: {
            status: "FAILED",
            rawResponse: {
              type: "client_cancel",
              reason: reason ?? "User canceled checkout",
            },
          },
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Cancel update failed" },
      { status: 500 }
    );
  }
}
