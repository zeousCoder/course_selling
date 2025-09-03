// components/admin/UserChangeTab.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  listUsersForRoleChange,
  updateUserRole,
} from "@/actions/roleChangeAction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Loader2, ShieldCheck, RefreshCw } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
};

export default function UserChangeTab() {
  const [items, setItems] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await listUsersForRoleChange();
      setItems(res.items as UserRow[]);
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const userId = String(fd.get("userId") || "");
    setSavingId(userId);
    const res = await updateUserRole(fd);
    if (!res.ok) {
      alert(res.message);
    } else {
      // optimistic update
      setItems((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: res.user?.role as any } : u
        )
      );
    }
    setSavingId(null);
  }

  return (
    <div className="w-full space-y-6 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-2xl font-bold">User Roles</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Total: {items.length}</Badge>
          <Button onClick={load} variant="outline" size="sm" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <Card className="h-[70vh] flex flex-col">
        <CardContent className="flex-1 overflow-auto">
          {error ? (
            <div className="text-center text-red-600 py-6">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading users...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No users found
            </div>
          ) : (
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead className="">Change To</TableHead>
                    <TableHead className="">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((u) => (
                    <TableRow key={u.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {u.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.email ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "ADMIN" ? "default" : "secondary"}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Native select ensures value posts in FormData */}
                        <form
                          onSubmit={onSubmit}
                          className="flex items-center gap-3"
                        >
                          <input type="hidden" name="userId" value={u.id} />
                          <select
                            name="role"
                            defaultValue={u.role}
                            className="h-9 rounded-md border px-2 text-sm"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <Button
                            type="submit"
                            size="sm"
                            disabled={savingId === u.id}
                          >
                            {savingId === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Update"
                            )}
                          </Button>
                        </form>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
