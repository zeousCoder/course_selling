"use client";

import React from "react";

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
} from "lucide-react";

// ✅ FIX: correct import (plural)
import { useEnrollments, EnrollmentRow } from "@/hooks/useEnrollment";

function formatAmount(amountPaise?: number, currency: string = "INR") {
  if (typeof amountPaise !== "number") return "—";
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    rupees
  );
}

export default function EnrollmentListTab() {
  const { items, loadingData, error, refetch } = useEnrollments();

  const total = items.length;
  const recent = items.filter((r) => {
    const dt = new Date(r.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return dt >= weekAgo;
  }).length;

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

      {/* Summary */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <WalletCards className="w-8 h-8 text-blue-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">New This Week</p>
                <p className="text-2xl font-bold text-purple-600">{recent}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Paid Orders Linked
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {items.filter((i) => i.order?.status === "PAID").length}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Owned Bundles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
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
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading enrollments...</span>
            </div>
          ) : items.length === 0 ? (
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
            <div className="overflow-x-auto min-h-screen overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Enrollment ID</TableHead>
                    <TableHead className="hidden md:table-cell">
                      User ID
                    </TableHead>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((e: EnrollmentRow) => {
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

                    return (
                      <TableRow key={e.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          {e.id.slice(0, 12)}…
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {e.userId.slice(0, 12)}…
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
