// app/actions/loginDetails.ts
"use server";

import prisma from "@/lib/prisma";

export type LoginSessionRow = {
  id: string;
  token: string;
  userId: string;
  userEmail: string | null;
  userName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  expiresAt: string; // ISO
  impersonatedBy: string | null;
};

export async function getLoginSessions(): Promise<{
  items: LoginSessionRow[];
}> {
  try {
    const rows = await prisma.session.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    const items: LoginSessionRow[] = rows.map((s) => ({
      id: s.id,
      token: s.token,
      userId: s.userId,
      userEmail: s.user?.email ?? null,
      userName: s.user?.name ?? null,
      ipAddress: s.ipAddress ?? null,
      userAgent: s.userAgent ?? null,
      createdAt:
        s.createdAt?.toISOString?.() ??
        new Date(s.createdAt as any).toISOString(),
      updatedAt:
        s.updatedAt?.toISOString?.() ??
        new Date(s.updatedAt as any).toISOString(),
      expiresAt:
        s.expiresAt?.toISOString?.() ??
        new Date(s.expiresAt as any).toISOString(),
      impersonatedBy: s.impersonatedBy ?? null,
    }));

    return { items };
  } catch (error) {
    console.error("[getLoginSessions]:", error);
    throw new Error("Failed to fetch login sessions.");
  }
}
