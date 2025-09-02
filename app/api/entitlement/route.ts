// app/api/entitlement/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/server/getSession";

export async function GET(req: NextRequest) {
  // Read current user from cookies/headers
  const userId = await getAuthUserId();
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan") as "basic" | "pro" | "premium" | null;

  // Always return a boolean payload; avoid leaking auth state with 4xx
  if (!userId || !plan) {
    // If unauthenticated or no plan provided, respond has=false (client can prompt sign-in or select plan)
    return NextResponse.json({ has: false });
  }

  // Check Enrollment using composite unique index (userId, plan)
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_plan: { userId, plan } },
    select: { id: true },
  });

  return NextResponse.json({ has: !!enrollment });
}
