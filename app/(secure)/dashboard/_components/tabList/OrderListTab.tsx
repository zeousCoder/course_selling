"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  ListOrdered,
  RefreshCw,
  Loader2,
  User as UserIcon,
  Receipt,
  BadgeCheck,
  BadgeAlert,
  Calendar,
} from "lucide-react";
import { useOrders } from "@/hooks/useORderList";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

function formatAmount(amountPaise: number, currency = "INR") {
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    rupees
  );
}

export default function OrderListTab() {
  const { orders, loadingData, error, fetchOrders } = useOrders();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = orders.length;
  const paid = orders.filter((o) => o.status === "PAID").length;
  const failed = orders.filter((o) => o.status === "FAILED").length;
  const created = orders.filter((o) => o.status === "CREATED").length;
  const canceled = orders.filter((o) => o.status === "CANCELED").length;
  const pending = orders.filter((o) => o.status === "PENDING").length;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, page, pageSize]);

  const pagesToShow = useMemo(() => {
    const maxLinks = 5;
    const half = Math.floor(maxLinks / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxLinks - 1);
    start = Math.max(1, Math.min(start, end - maxLinks + 1));
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <div className="w-full space-y-6 p-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListOrdered className="w-6 h-6" />
            Orders
          </h1>
          <p className="text-muted-foreground">
            Razorpay order records linked to users
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            Paid: {paid}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BadgeAlert className="w-3 h-3" />
            Created: {created}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BadgeAlert className="w-3 h-3" />
            Failed: {failed}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BadgeAlert className="w-3 h-3" />
            Canceled: {canceled}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BadgeAlert className="w-3 h-3" />
            Pending: {pending}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Total: {total}
          </Badge>
          <Button
            onClick={() => fetchOrders()}
            disabled={loadingData}
            variant="outline"
            size="sm"
          >
            {loadingData ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Card with sticky header, scrollable table body, sticky footer */}
      <Card className="h-[80vh] flex flex-col">
        <CardHeader className="shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>

        {/* Middle: scroll container for table ONLY */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="text-center py-4 text-red-600">
              <p>{error}</p>
              <Button
                onClick={() => fetchOrders()}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading orders...</span>
            </div>
          ) : total === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                Orders will appear here after checkout starts.
              </p>
              <Button
                onClick={() => fetchOrders()}
                variant="outline"
                className="mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh List
              </Button>
            </div>
          ) : (
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">#</TableHead>
                    <TableHead className="w-[150px]">Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead className="hidden md:table-cell">
                      RZP Order
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((o, idx) => {
                    const created = new Date(o.createdAt).toLocaleString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );
                    const badgeVariant =
                      o.status === "PAID"
                        ? "default"
                        : o.status === "FAILED"
                        ? "destructive"
                        : "secondary";
                    const lastPayment = o.payments;
                    const rowNumber = (page - 1) * pageSize + (idx + 1);

                    return (
                      <TableRow key={o.id} className="hover:bg-muted/50">
                        <TableCell className="text-center">
                          {rowNumber}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {o.id.slice(0, 12)}…
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {o.user.name || "No Name"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {o.user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{o.plan}</TableCell>
                        <TableCell>
                          {formatAmount(o.amount, o.currency)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {o.receipt ? o.receipt : "—"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs">
                          {o.razorpayOrderId ? o.razorpayOrderId : "—"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {created}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={badgeVariant as any}
                            className="text-xs"
                          >
                            {o.status}
                          </Badge>
                          {lastPayment && (
                            <div className="text-[10px] text-muted-foreground mt-1">
                              Last payment:{" "}
                              {lastPayment[lastPayment.length - 1]?.status}
                              {lastPayment[lastPayment.length - 1]
                                ?.razorpayPaymentId
                                ? ` • ${
                                    lastPayment[lastPayment.length - 1]
                                      ?.razorpayPaymentId
                                  }`
                                : ""}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Sticky footer inside Card: pagination area not scrolling */}
        <div className="sticky bottom-0 bg-background border-t">
          <div className="flex flex-col lg:flex-row  items-center justify-between gap-3 p-3">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, total)} of {total}
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="flex justify-center w-full items-center gap-2">
                <span className="text-sm">Rows per page:</span>
                <select
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                  value={pageSize}
                  onChange={(e) => {
                    const next = parseInt(e.target.value, 10);
                    setPageSize(next);
                    setPage(1);
                  }}
                >
                  {[5, 10, 20, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={page === 1}
                      onClick={() => page > 1 && setPage(page - 1)}
                    />
                  </PaginationItem>

                  {pagesToShow.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={page === totalPages}
                      onClick={() => page < totalPages && setPage(page + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
