// app/actions/enrollment.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ✅ Get ALL enrollments (no user filter)
export const getAllEnrollments = async () => {
  try {
    const rows = await prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        plan: true,
        orderId: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            status: true,
            amount: true,
            currency: true,
          },
        },
      },
    });

    return {
      items: rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch all enrollments.");
  }
};

// ✅ Delete enrollment by id (admin-style)
export const deleteEnrollment = async (id: string) => {
  if (!id) {
    return { message: "Error: ID is required to delete." };
  }

  try {
    await prisma.enrollment.delete({
      where: { id },
    });

    revalidatePath("/"); // Revalidate admin page
    return { message: "Enrollment deleted successfully." };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to delete enrollment." };
  }
};
