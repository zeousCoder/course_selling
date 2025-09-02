// hooks/useEnrollments.ts
"use client";

import { getAllEnrollments } from "@/actions/enrollmentAction";
import * as React from "react";

// Define types aligned with the server action
type OrderRow = {
  status: "CREATED" | "PENDING" | "PAID" | "FAILED" | "CANCELED";
  amount: number;
  currency: string;
};

type UserRow = {
  name: string | null;
  email: string | null;
};

export type EnrollmentRow = {
  id: string;
  userId: string;
  plan: "basic" | "pro" | "premium" | string;
  orderId: string;
  createdAt: string;
  order: OrderRow | null;
  user: UserRow | null;
};

export function useEnrollments() {
  const [items, setItems] = React.useState<EnrollmentRow[]>([]);
  const [loadingData, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAllEnrollments(); // ✅ call admin fetch
      setItems(res.items as EnrollmentRow[]);
    } catch (e: any) {
      console.error("❌ Failed to fetch enrollments:", e);
      setError(e?.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loadingData,
    error,
    refetch: fetchItems,
    setItems, 
  };
}
