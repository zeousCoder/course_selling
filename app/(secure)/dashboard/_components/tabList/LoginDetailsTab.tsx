// components/admin/LoginDetailsTab.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

// shadcn components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// icons
import {
  ShieldCheck,
  RefreshCw,
  Loader2,
  User as UserIcon,
  Globe,
  Clock,
} from "lucide-react";

// shadcn pagination
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { getLoginSessions, LoginSessionRow } from "@/actions/sessionAction";

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function LoginDetailsTab() {
  const [items, setItems] = useState<LoginSessionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const pagesToShow = useMemo(() => {
    const maxLinks = 5;
    const half = Math.floor(maxLinks / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxLinks - 1);
    start = Math.max(1, Math.min(start, end - maxLinks + 1));
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLoginSessions();
      setItems(res.items);
      // reset page if current page goes out of bounds
      const nextTotalPages = Math.max(
        1,
        Math.ceil(res.items.length / pageSize)
      );
      if (page > nextTotalPages) setPage(nextTotalPages);
    } catch (e: any) {
      setError(e?.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full space-y-6 p-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            Login Sessions
          </h1>
          <p className="text-muted-foreground">
            Recent login sessions with device and network details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Total: {total}
          </Badge>
          <Button
            onClick={fetchSessions}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Card with sticky header and scrollable table, sticky footer for pagination */}
      <Card className="h-[80vh] flex flex-col">
        {/* Middle scroll area */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="text-center py-6 text-red-600">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading sessions...</span>
            </div>
          ) : total === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No login sessions found
            </div>
          ) : (
            <div className="min-w-[1100px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">#</TableHead>
                    <TableHead className="w-[180px]">Session ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Token
                    </TableHead>
                    <TableHead className="hidden md:table-cell">IP</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Updated
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((s, idx) => {
                    const rowNumber = (page - 1) * pageSize + (idx + 1);
                    return (
                      <TableRow key={s.id} className="hover:bg-muted/50">
                        <TableCell className="text-center">
                          {rowNumber}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {s.id.slice(0, 16)}…
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {s.userName ?? "—"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {s.userEmail ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs">
                          {s.token.slice(0, 16)}…
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">
                              {s.ipAddress ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDateTime(s.createdAt)}</TableCell>
                        <TableCell>{formatDateTime(s.expiresAt)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDateTime(s.updatedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Sticky footer pagination */}
        <div className="sticky bottom-0 bg-background border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3">
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
