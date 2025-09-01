"use server";

import prisma from "@/lib/prisma";

export const getUserList = async () => {
  try {
    const userList = await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return userList;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user list.");
  }
};
