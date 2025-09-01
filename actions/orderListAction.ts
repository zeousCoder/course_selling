// actions/orderActions.ts
"use server";

import prisma from "@/lib/prisma";

export type OrderStatusT = "CREATED" | "PENDING" | "PAID" | "FAILED" | "CANCELED";

export type GetOrdersParams = {
  status?: OrderStatusT[];
  plan?: string[];                 // ["basic","pro","premium"] if normalized
  q?: string;                      // search id, receipt, user email/name
  from?: string;                   // ISO
  to?: string;                     // ISO
  take?: number;                   // default 200
  cursor?: { id: string } | null;  // for cursor pagination
};

export async function getOrders(params: GetOrdersParams = {}) {
  const { status, plan, q, from, to, take = 200, cursor = null } = params;

  const where: any = {};

  if (status?.length) where.status = { in: status };
  if (plan?.length) where.plan = { in: plan };

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { id: { contains: term, mode: "insensitive" } },
      { receipt: { contains: term, mode: "insensitive" } },
      { razorpayOrderId: { contains: term, mode: "insensitive" } },
      { user: { email: { contains: term, mode: "insensitive" } } },
      { user: { name: { contains: term, mode: "insensitive" } } },
    ];
  }

  const results = await prisma.order.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }], // stable pagination
    take: Math.min(Math.max(take, 1), 500),
    ...(cursor ? { skip: 1, cursor } : {}),
    include: {
      user: { select: { id: true, name: true, email: true } },
      payments: {
        select: { id: true, status: true, amount: true, razorpayPaymentId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1, // last payment summary
      },
    },
  });

  const nextCursor =
    results.length === Math.min(Math.max(take, 1), 500)
      ? { id: results[results.length - 1].id }
      : null;

  // serialize Dates to strings for client consumption
  const data = results.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    payments: o.payments.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
  }));

  return { data, nextCursor };
}
