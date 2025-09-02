// components/admin/OrderListTab.tsx
"use client";

import React, { useEffect } from "react";

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
  CircleDollarSign,
  BadgeCheck,
  BadgeAlert,
  Calendar,
} from "lucide-react";
import { useOrders } from "@/hooks/useORderList";

function formatAmount(amountPaise: number, currency = "INR") {
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    rupees
  );
}

export default function OrderListTab() {
  const { orders, loadingData, error, fetchOrders } = useOrders();

  const total = orders.length;
  const paid = orders.filter((o) => o.status === "PAID").length;
  const failed = orders.filter((o) => o.status === "FAILED").length;
  const created = orders.filter((o) => o.status === "CREATED").length;
  const canceled = orders.filter((o) => o.status === "CANCELED").length;
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const recent = orders.filter((o) => {
    const dt = new Date(o.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return dt >= weekAgo;
  }).length;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        <div className="flex items-center gap-2">
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
          {/* <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            New: {recent}
          </Badge> */}
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

      {/* Table */}
      <Card className="min-h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
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
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                  {orders.map((o) => {
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

                    return (
                      <TableRow key={o.id} className="hover:bg-muted/50">
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
                                ? ` • ${lastPayment[lastPayment.length - 1]
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
        </CardContent>
      </Card>
    </div>
  );
}
