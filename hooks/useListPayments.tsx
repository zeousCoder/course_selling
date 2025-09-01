// hooks/usePayments.ts
"use client";

import * as React from "react";
import type { Payment, User, Order } from "@prisma/client";
import { getPayments } from "@/actions/razorPayAction";

// Match the server action's return shape: { data, nextCursor }
export type PaymentWithRefs = Payment & {
  user: Pick<User, "id" | "name" | "email">;
  order: Pick<Order, "id" | "plan" | "status">;
};

// Params must be serializable for Server Actions
export type PaymentsQuery = {
  status?: Array<Payment["status"]>;
  plan?: Array<string>;
  q?: string;
  from?: string; // ISO string
  to?: string; // ISO string
  take?: number;
  cursor?: { id: string } | null;
};

type State = {
  payments: PaymentWithRefs[];
  loadingData: boolean;
  error: string | null;
  nextCursor: { id: string } | null;
};

export function usePayments(initialParams: PaymentsQuery = {}) {
  const [state, setState] = React.useState<State>({
    payments: [],
    loadingData: false,
    error: null,
    nextCursor: null,
  });

  const paramsRef = React.useRef<PaymentsQuery>(initialParams);

  const fetchPayments = React.useCallback(async (overrides?: PaymentsQuery) => {
    try {
      setState((s) => ({ ...s, loadingData: true, error: null }));
      const merged: PaymentsQuery = {
        ...paramsRef.current,
        ...(overrides ?? {}),
      };
      paramsRef.current = merged;

      // Server action must return serializable data (Dates -> strings)
      const res = await getPayments(merged as any);
      // Expecting { data, nextCursor }
      const data = (res?.data ?? []) as any[];

      // Normalize date fields to strings for client
      const normalized = data.map((p) => ({
        ...p,
        createdAt:
          typeof p.createdAt === "string"
            ? p.createdAt
            : new Date(p.createdAt).toISOString(),
        updatedAt:
          typeof p.updatedAt === "string"
            ? p.updatedAt
            : new Date(p.updatedAt).toISOString(),
      })) as PaymentWithRefs[];

      setState((s) => ({
        ...s,
        payments: normalized,
        nextCursor: res?.nextCursor ?? null,
        loadingData: false,
      }));
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loadingData: false,
        error: e?.message || "Failed to load payments",
      }));
    }
  }, []);

  const loadMore = React.useCallback(async () => {
    if (!state.nextCursor) return;
    await fetchPayments({ cursor: state.nextCursor });
  }, [state.nextCursor, fetchPayments]);

  React.useEffect(() => {
    // initial load
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    payments: state.payments,
    loadingData: state.loadingData,
    error: state.error,
    fetchPayments, // can receive filters: fetchPayments({ status: ["CAPTURED"], from: "2025-09-01T00:00:00.000Z" })
    loadMore,
    nextCursor: state.nextCursor,
    setPayments: (updater: React.SetStateAction<PaymentWithRefs[]>) =>
      setState((s) => ({
        ...s,
        payments:
          typeof updater === "function"
            ? (updater as any)(s.payments)
            : updater,
      })),
  };
}
