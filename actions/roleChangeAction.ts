// app/actions/users.ts
"use server";

import prisma from "@/lib/prisma";

const ALLOWED_ROLES = ["USER", "ADMIN"] as const;
type UserRole = (typeof ALLOWED_ROLES)[number];

export async function listUsersForRoleChange() {
  // Adjust auth here to restrict to admins only
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true },
  });
  return { items: users };
}

export async function updateUserRole(formData: FormData) {
  // Expect fields: userId, role
  const userId = String(formData.get("userId") || "");
  const role = String(formData.get("role") || "").toUpperCase();

  if (!userId || !ALLOWED_ROLES.includes(role as UserRole)) {
    return { ok: false, message: "Invalid userId or role" };
  }

  // TODO: enforce that only admins can perform this action
  // Example: const me = await auth(); if (me.role !== 'ADMIN') return { ok:false, message:'Forbidden' }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
      select: { id: true, role: true },
    });
    return { ok: true, message: "Role updated", user: updated };
  } catch (e: any) {
    console.error("[updateUserRole]:", e);
    return { ok: false, message: "Failed to update role" };
  }
}
