"use client";

import React, { useMemo, useState, useEffect } from "react";
import { usePayments } from "@/hooks/useListPayments";

// shadcn/ui components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// lucide-react icons
import {
  CreditCard, RefreshCw, Loader2, User as UserIcon, Calendar, CheckCircle2, XCircle, CircleAlert,
} from "lucide-react";

// shadcn pagination
import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink,
} from "@/components/ui/pagination";

function formatAmount(amountPaise: number, currency = "INR") {
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(rupees);
}

export default function PaymentListTab() {
  const { payments, loadingData, error, fetchPayments } = usePayments();

  // pagination state
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  // totals and badges
  const total = payments.length;
  const captured = payments.filter((p) => p.status === "CAPTURED").length;
  const failed = payments.filter((p) => p.status === "FAILED").length;
  const recent = payments.filter((p) => {
    const dt = new Date(p.createdAt as any);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return dt >= weekAgo;
  }).length;

  useEffect(() => {
    // make sure we load on mount or when hook changes
    if (payments.length === 0) fetchPayments();
  }, [fetchPayments]); // eslint-disable-line

  // derive pages
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return payments.slice(start, start + pageSize);
  }, [payments, page, pageSize]);

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
            <CreditCard className="w-6 h-6" />
            Payments
          </h1>
          <p className="text-muted-foreground">Razorpay payments recorded in your database</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Captured: {captured}
          </Badge>
          <Badge className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Failed: {failed}
          </Badge>
          <Badge className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            New: {recent}
          </Badge>
          <Button onClick={() => fetchPayments()} disabled={loadingData} size="sm">
            {loadingData ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* Card with sticky header, scrollable table area, sticky footer */}
      <Card className="h-[80vh] flex flex-col">

        {/* Middle: only this scrolls */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="flex items-center justify-between p-3 rounded-md border text-red-600">
              <div className="flex items-center gap-2">
                <CircleAlert className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <Button onClick={() => fetchPayments()} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          ) : loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading payments...</span>
            </div>
          ) : total === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payments found</h3>
              <p className="text-muted-foreground">Payments will appear here after checkout attempts.</p>
              <Button onClick={() => fetchPayments()} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          ) : (
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">#</TableHead>
                    <TableHead className="w-[150px]">Payment ID</TableHead>
                    <TableHead className="w-[150px]">Order</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Method</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((p, idx) => {
                    const created = new Date(p.createdAt as any).toLocaleString("en-IN", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    });
                    const badgeVariant =
                      p.status === "CAPTURED" ? "default" : p.status === "FAILED" ? "destructive" : "secondary";
                    const rowNumber = (page - 1) * pageSize + (idx + 1);

                    return (
                      <TableRow key={p.id} className="hover:bg-muted/50">
                        <TableCell className="text-center">{rowNumber}</TableCell>
                        <TableCell className="font-mono text-xs">{p.id.slice(0, 12)}…</TableCell>
                        <TableCell className="font-mono text-xs">{p.order.id.slice(0, 12)}…</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="font-medium">{p.user.name || "No Name"}</span>
                              <span className="text-xs text-muted-foreground">{p.user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{p.order.plan}</TableCell>
                        <TableCell>{formatAmount(p.amount, p.currency)}</TableCell>
                        <TableCell className="hidden md:table-cell">{p.method ? p.method.toUpperCase() : "—"}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{created}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={badgeVariant as any} className="text-xs">
                            {p.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Sticky footer: pagination stays visible, table scrolls */}
        <div className="sticky bottom-0 bg-background border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
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
                    <PaginationPrevious aria-disabled={page === 1} onClick={() => page > 1 && setPage(page - 1)} />
                  </PaginationItem>

                  {pagesToShow.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext aria-disabled={page === totalPages} onClick={() => page < totalPages && setPage(page + 1)} />
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
