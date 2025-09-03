// hooks/useEnrollments.ts
"use client";

import * as React from "react";
import {
  getAllEnrollments,
  deleteEnrollment,
} from "@/actions/enrollmentAction";

type OrderStatus = "CREATED" | "PENDING" | "PAID" | "FAILED" | "CANCELED";

export type OrderRow = {
  status: OrderStatus;
  amount: number;
  currency: string;
};

export type UserRow = {
  name: string | null;
  email: string | null;
};

export type EnrollmentRow = {
  id: string;
  userId: string;
  plan: "basic" | "pro" | "premium" | string;
  orderId: string;
  createdAt: string; // ISO
  order: OrderRow | null;
  user: UserRow | null;
};

type ListResponse = { items: EnrollmentRow[] };

export function useEnrollments() {
  const [items, setItems] = React.useState<EnrollmentRow[]>([]);
  const [loadingData, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = (await getAllEnrollments()) as ListResponse;
      setItems((res.items || []) as EnrollmentRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Optimistic delete
  const removeEnrollment = React.useCallback(
    async (id: string, opts?: { refetch?: boolean }) => {
      if (!id) return { ok: false, message: "Missing id" };

      // Keep a snapshot for rollback
      const prev = items;
      // Optimistically remove
      setItems((cur) => cur.filter((row) => row.id !== id));

      try {
        const res = await deleteEnrollment(id);
        const ok = !res?.message?.toLowerCase().includes("error");
        if (!ok) {
          // rollback
          setItems(prev);
          return { ok: false, message: res?.message || "Delete failed" };
        }
        // Optionally hard refresh from server caches
        if (opts?.refetch) {
          await fetchItems();
        }
        return { ok: true, message: res?.message || "Deleted" };
      } catch (e: any) {
        // rollback
        setItems(prev);
        return { ok: false, message: e?.message || "Delete failed" };
      }
    },
    [items, fetchItems]
  );

  return {
    items,
    loadingData,
    error,
    refetch: fetchItems,
    setItems,
    removeEnrollment, // expose delete
  };
}
