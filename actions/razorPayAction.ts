"use server";

import prisma from "@/lib/prisma";

type GetPaymentsParams = {
  status?: ("CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED")[];
  plan?: ("basic" | "pro" | "premium")[] | string[];
  q?: string; // search by user email/name or Razorpay payment id
  from?: string; // ISO date
  to?: string; // ISO date
  take?: number; // default 200
  cursor?: { id: string } | null; // for cursor pagination
};

export async function getPayments(params: GetPaymentsParams = {}) {
  const { status, plan, q, from, to, take = 200, cursor = null } = params;

  const where: any = {};

  if (status?.length) {
    where.status = { in: status };
  }

  if (plan?.length) {
    where.order = { ...(where.order ?? {}), plan: { in: plan } };
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  if (q && q.trim()) {
    const term = q.trim();
    // Search user email/name and Razorpay payment id
    where.OR = [
      { razorpayPaymentId: { contains: term, mode: "insensitive" } },
      { user: { email: { contains: term, mode: "insensitive" } } },
      { user: { name: { contains: term, mode: "insensitive" } } },
      { order: { id: { contains: term, mode: "insensitive" } } },
    ];
  }

  const results = await prisma.payment.findMany({
    where,
    // Stable sort: createdAt desc then id desc to avoid duplicates in pagination
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: Math.min(Math.max(take, 1), 500),
    ...(cursor ? { skip: 1, cursor } : {}),
    include: {
      user: { select: { id: true, name: true, email: true } },
      order: { select: { id: true, plan: true, status: true } },
    },
  });

  const nextCursor =
    results.length === Math.min(Math.max(take, 1), 500)
      ? { id: results[results.length - 1].id }
      : null;

  // Ensure JSON-serializable data (Dates -> ISO strings)
  const data = results.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    user: r.user,
    order: r.order,
  }));

  return { data, nextCursor };
}
