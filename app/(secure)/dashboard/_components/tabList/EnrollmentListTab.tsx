"use client";

import React, { useMemo, useState } from "react";

// shadcn components
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// lucide icons
import {
  WalletCards,
  RefreshCw,
  Loader2,
  CreditCard,
  Calendar,
  BadgeCheck,
  Trash2,
} from "lucide-react";

// hook
import { useEnrollments, EnrollmentRow } from "@/hooks/useEnrollment";
import { toast } from "sonner";

// shadcn pagination
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { useSession } from "@/lib/auth-client";

function formatAmount(amountPaise?: number, currency: string = "INR") {
  if (typeof amountPaise !== "number") return "—";
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    rupees
  );
}

export default function EnrollmentListTab() {
  const { data: session } = useSession();
  const { items, loadingData, error, refetch, removeEnrollment } =
    useEnrollments();

  // pagination state
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  const total = items.length;
  const recent = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return items.filter((r) => new Date(r.createdAt) >= weekAgo).length;
  }, [items]);

  // derive pages
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  // simple windowed page links
  const pagesToShow = useMemo(() => {
    const maxLinks = 5;
    const half = Math.floor(maxLinks / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxLinks - 1);
    start = Math.max(1, Math.min(start, end - maxLinks + 1));
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const userDeletOption = session?.user.email === "shrey.sadhukhan21@gmail.com";

  const onDelete = async (row: EnrollmentRow) => {
    const ok = window.confirm(`Delete enrollment for plan "${row.plan}"?`);
    if (!ok) return;
    const res = await removeEnrollment(row.id);
    if (res.ok) {
      toast.success("Enrollment deleted", { description: row.plan });
      // keep current page; if current page becomes empty, move up a page
      const newTotal = total - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
      if (page > newTotalPages) setPage(newTotalPages);
    } else {
      toast.error("Delete failed", {
        description: res.message || "Please retry.",
      });
    }
  };

  return (
    <div className="w-full space-y-6 p-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <WalletCards className="w-6 h-6" />
            Enrollments
          </h1>
          <p className="text-muted-foreground">
            Bundles owned by the current account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            Total: {total}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            New: {recent}
          </Badge>
          <Button
            onClick={refetch}
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

      {/* Card with sticky header, scrollable table area, sticky footer */}
      <Card className="h-[80vh] flex flex-col">
        <CardHeader className="shrink-0">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Owned Bundles
          </CardTitle>
        </CardHeader>

        {/* Middle: only this scrolls */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="text-center py-4 text-red-600">
              <p>{error}</p>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading enrollments...</span>
            </div>
          ) : total === 0 ? (
            <div className="text-center py-8">
              <WalletCards className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No enrollments yet</h3>
              <p className="text-muted-foreground">
                Purchased bundles will appear here after successful checkout.
              </p>
              <Button onClick={refetch} variant="outline" className="mt-4">
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
                    <TableHead className="w-[160px]">Enrollment</TableHead>
                    <TableHead className="hidden md:table-cell">User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Order Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Amount
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    {userDeletOption && (
                      <TableHead className="w-[110px]">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((e, idx) => {
                    const created = new Date(e.createdAt).toLocaleString(
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
                      e.order?.status === "PAID"
                        ? "default"
                        : e.order?.status === "FAILED"
                        ? "destructive"
                        : "secondary";
                    const rowNumber = (page - 1) * pageSize + (idx + 1);

                    return (
                      <TableRow key={e.id} className="hover:bg-muted/50">
                        <TableCell className="text-center">
                          {rowNumber}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {e.id.slice(0, 12)}…
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {e.user?.name ?? "—"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {e.user?.email ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{e.plan}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {e.orderId.slice(0, 12)}…
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {e.order?.status ? (
                            <Badge
                              variant={badgeVariant as any}
                              className="text-xs"
                            >
                              {e.order.status}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatAmount(
                            e.order?.amount,
                            e.order?.currency ?? "INR"
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {created}
                        </TableCell>
                        <TableCell>
                          {userDeletOption && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(e)}
                              className="h-8 px-3"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
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

        {/* Sticky footer inside Card: pagination and controls */}
        <div className="sticky bottom-0 bg-background border-t">
          <div className="flex lg:flex-row flex-col items-center justify-between gap-3 p-3">
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
