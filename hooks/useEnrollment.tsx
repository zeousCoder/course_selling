// hooks/useEnrollments.ts
"use client";
import { listEnrollments } from "@/actions/enrollmentAction";
import * as React from "react";

type EnrollmentRow = {
  id: string;
  userId: string;
  plan: "basic" | "pro" | "premium" | string;
  orderId: string;
  createdAt: string;
  order?: { status: "CREATED" | "PENDING" | "PAID" | "FAILED" | "CANCELED"; amount: number; currency: string };
};

export function useEnrollments() {
  const [items, setItems] = React.useState<EnrollmentRow[]>([]);
  const [loadingData, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listEnrollments();
      setItems(res.items as EnrollmentRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loadingData, error, fetchItems, setItems };
}
