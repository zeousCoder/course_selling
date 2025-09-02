"use client";

import React from "react";
import { usePayments } from "@/hooks/useListPayments"; // your hook

// shadcn/ui components
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

// lucide-react icons
import {
  CreditCard,
  RefreshCw,
  Loader2,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  XCircle,
  CircleAlert,
} from "lucide-react";

function formatAmount(amountPaise: number, currency = "INR") {
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    rupees
  );
}

export default function PaymentListTab() {
  const { payments, loadingData, error, fetchPayments } = usePayments();

  const captured = payments.filter((p) => p.status === "CAPTURED").length;
  const failed = payments.filter((p) => p.status === "FAILED").length;
  const recent = payments.filter((p) => {
    const dt = new Date(p.createdAt as any);
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
            <CreditCard className="w-6 h-6" />
            Payments
          </h1>
          <p className="text-muted-foreground">
            Razorpay payments recorded in your database
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Captured: {captured}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Failed: {failed}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            New: {recent}
          </Badge>
          <Button
            onClick={() => fetchPayments()}
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

      {/* Table card */}
      <Card className="min-h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center justify-between p-3 rounded-md border text-red-600">
              <div className="flex items-center gap-2">
                <CircleAlert className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <Button
                onClick={() => fetchPayments()}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading payments...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payments found</h3>
              <p className="text-muted-foreground">
                Payments will appear here after checkout attempts.
              </p>
              <Button
                onClick={() => fetchPayments()}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Payment ID</TableHead>
                    <TableHead className="w-[150px]">Order</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Method
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => {
                    const created = new Date(p.createdAt as any).toLocaleString(
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
                      p.status === "CAPTURED"
                        ? "default"
                        : p.status === "FAILED"
                        ? "destructive"
                        : "secondary";

                    return (
                      <TableRow key={p.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">
                          {p.id.slice(0, 12)}…
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {p.order.id.slice(0, 12)}…
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {p.user.name || "No Name"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {p.user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {p.order.plan}
                        </TableCell>
                        <TableCell>
                          {formatAmount(p.amount, p.currency)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {p.method ? p.method.toUpperCase() : "—"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {created}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={badgeVariant as any}
                            className="text-xs"
                          >
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
        </CardContent>
      </Card>
    </div>
  );
}
