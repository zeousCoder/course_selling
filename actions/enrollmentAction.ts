// app/actions/enrollment.ts
"use server";

import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/server/getSession";

// Read: does current user own this plan?
export async function getEnrollment(plan: "basic" | "pro" | "premium") {
  const userId = await getAuthUserId();
  if (!userId) {
    // Keep API simple and predictable for client checks
    return {
      has: false,
      id: null,
      userId: null,
      orderId: null,
      createdAt: null,
    };
  }

  const en = await prisma.enrollment.findUnique({
    where: { userId_plan: { userId, plan } },
    select: {
      id: true,
      userId: true,
      orderId: true,
      createdAt: true,
    },
  });

  return {
    has: !!en,
    id: en?.id ?? null,
    userId: en?.userId ?? userId, 
    orderId: en?.orderId ?? null,
    createdAt: en?.createdAt ? en.createdAt.toISOString() : null,
  };
}

// Read: list all enrollments for current user
export async function listEnrollments() {
  const userId = await getAuthUserId();
  if (!userId) return { items: [] };
  const rows = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      plan: true,
      orderId: true,
      createdAt: true,
      order: { select: { status: true, amount: true, currency: true } },
    },
  });
  return {
    items: rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

// Write: grant enrollment for a user+plan after payment success
// Typically called inside verify/webhook; also useful for admin comp.
export async function grantEnrollment(args: {
  userId: string;
  plan: "basic" | "pro" | "premium";
  orderId: string;
}) {
  // Idempotent upsert on composite key (userId, plan)
  const en = await prisma.enrollment.upsert({
    where: { userId_plan: { userId: args.userId, plan: args.plan } },
    create: { userId: args.userId, plan: args.plan, orderId: args.orderId },
    update: {}, // idempotent
  });
  return { id: en.id, createdAt: en.createdAt.toISOString() };
}

// Write: revoke enrollment (admin only or your policy)
export async function revokeEnrollment(enrollmentId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error("Unauthenticated");

  // Policy: only admins or the owner can revoke; adjust as needed
  // Example simple policy: allow owner to revoke their own
  const item = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { userId: true },
  });
  if (!item || item.userId !== userId) throw new Error("Forbidden");

  await prisma.enrollment.delete({ where: { id: enrollmentId } });
  return { ok: true };
}
