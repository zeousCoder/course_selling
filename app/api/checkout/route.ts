// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/server/getSession";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLAN_AMOUNT: Record<"basic" | "pro" | "premium", number> = {
  basic: 9999_00,
  pro: 19999_00,
  premium: 29999_00,
};

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { plan, prefill } = (await req.json()) as {
      plan: "basic" | "pro" | "premium";
      prefill?: { name?: string; email?: string; contact?: string };
    };

    const amount = PLAN_AMOUNT[plan];
    if (!amount)
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    // 0) Enrollment guard: block duplicate purchases
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_plan: { userId, plan } },
      select: { id: true },
    });
    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already purchased this plan." },
        { status: 409 }
      );
    }

    const receipt = `rcpt_${plan}_${Date.now()}`;

    // 1) Create local order
    const order = await prisma.order.create({
      data: {
        plan,
        amount,
        currency: "INR",
        status: "PENDING",
        receipt,
        notes: prefill ?? {},
        user: { connect: { id: userId } },
      },
    });

    // 2) Create Razorpay order (amount in paise)
    const rzpOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: { plan, userId },
    });

    // 3) Persist RZP id + create initial Payment
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: rzpOrder.id },
      }),
      prisma.payment.create({
        data: {
          orderId: order.id,
          userId,
          amount,
          currency: "INR",
          status: "CREATED",
        },
      }),
    ]);

    return NextResponse.json({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
