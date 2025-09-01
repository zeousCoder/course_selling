// hooks/useOrders.ts
"use client";

import * as React from "react";
import type { User } from "@prisma/client";
import { getOrders, GetOrdersParams } from "@/actions/orderListAction";

export type OrderRow = {
  id: string;
  userId: string;
  plan: string;
  amount: number;
  currency: string;
  status: "CREATED" | "PENDING" | "PAID" | "FAILED" | "CANCELED";
  razorpayOrderId: string | null;
  receipt: string | null;
  notes: any | null;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "name" | "email">;
  payments: Array<{
    id: string;
    status: "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
    amount: number;
    razorpayPaymentId: string | null;
    createdAt: string;
  }>;
};

type State = {
  orders: OrderRow[];
  loadingData: boolean;
  error: string | null;
  nextCursor: { id: string } | null;
};

export function useOrders(initialParams: GetOrdersParams = {}) {
  const [state, setState] = React.useState<State>({
    orders: [],
    loadingData: false,
    error: null,
    nextCursor: null,
  });

  const paramsRef = React.useRef<GetOrdersParams>(initialParams);

  const fetchOrders = React.useCallback(async (overrides?: GetOrdersParams) => {
    try {
      setState((s) => ({ ...s, loadingData: true, error: null }));
      const merged = { ...paramsRef.current, ...(overrides ?? {}) };
      paramsRef.current = merged;

      const res = await getOrders(merged);
      const data = (res?.data ?? []) as OrderRow[];

      setState((s) => ({
        ...s,
        orders: data,
        nextCursor: res?.nextCursor ?? null,
        loadingData: false,
      }));
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loadingData: false,
        error: e?.message || "Failed to load orders",
      }));
    }
  }, []);

  const loadMore = React.useCallback(async () => {
    if (!state.nextCursor) return;
    await fetchOrders({ cursor: state.nextCursor });
  }, [state.nextCursor, fetchOrders]);

  return {
    orders: state.orders,
    loadingData: state.loadingData,
    error: state.error,
    fetchOrders,
    loadMore,
    nextCursor: state.nextCursor,
    setOrders: (updater: React.SetStateAction<OrderRow[]>) =>
      setState((s) => ({
        ...s,
        orders:
          typeof updater === "function" ? (updater as any)(s.orders) : updater,
      })),
  };
}
