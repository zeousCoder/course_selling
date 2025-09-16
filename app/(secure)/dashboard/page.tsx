import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import Sidebar from "./_components/Sidebar";

export default async function AdminPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="">
      <Sidebar />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Dashboard",
  description: "course selling site",
};
