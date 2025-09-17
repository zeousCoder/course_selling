"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useProjects } from "@/hooks/useProject"; // adjust path
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ListOrdered,
  RefreshCw,
  Loader2,
  Calendar,
  FileText,
  FileDown,
  PlusCircle,
} from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectListTab() {
  const { projects, isPending, error, fetchProjects, createProject, message } =
    useProjects();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Stats
  const total = projects.length;
  const withFiles = projects.filter((p) => p.filesName?.length > 0).length;

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return projects.slice(start, start + pageSize);
  }, [projects, page, pageSize]);

  const pagesToShow = useMemo(() => {
    const maxLinks = 5;
    const half = Math.floor(maxLinks / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxLinks - 1);
    start = Math.max(1, Math.min(start, end - maxLinks + 1));
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  // form state
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createProject(formData);
    e.currentTarget.reset();
    setOpen(false);
  };

  return (
    <div className="w-full space-y-6 p-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListOrdered className="w-6 h-6" />
            Projects
          </h1>
          <p className="text-muted-foreground">
            Portfolio projects with download links
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Total: {total}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileDown className="w-3 h-3" />
            With Files: {withFiles}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Pages: {totalPages}
          </Badge>

          {/* New Project Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" required />
                </div>
                <div>
                  <Label htmlFor="viewDetails">View Details URL</Label>
                  <Input id="viewDetails" name="viewDetails" />
                </div>
                <div>
                  <Label htmlFor="filesName">
                    File Names (comma separated)
                  </Label>
                  <Input id="filesName" name="filesName" required />
                </div>
                <div>
                  <Label htmlFor="downloadFile">Upload File</Label>
                  <Input
                    id="downloadFile"
                    name="downloadFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.xlsx,.txt"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => fetchProjects()}
            disabled={isPending}
            size="sm"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Card with table and pagination */}
      <Card className="h-[80vh] flex flex-col">
        {/* Table scrollable section */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="text-center py-4 text-red-600">
              <p>{error}</p>
              <Button
                onClick={() => fetchProjects()}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading projects...</span>
            </div>
          ) : total === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Projects will appear here once added.
              </p>
              <Button
                onClick={() => fetchProjects()}
                variant="outline"
                className="mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh List
              </Button>
            </div>
          ) : (
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[60px] text-center">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Files
                    </TableHead>
                    <TableHead className="hidden md:table-cell">View</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((p, idx) => {
                    const rowNumber = (page - 1) * pageSize + (idx + 1);

                    return (
                      <TableRow key={p.id} className="hover:bg-muted/50">
                        <TableCell className="text-center">
                          {rowNumber}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {p.title}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate text-sm">
                          {p.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          {p.filesName?.length ? p.filesName.join(", ") : "—"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {p.viewDetails ? (
                            <a
                              href={p.viewDetails}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {p.downloadLink ? (
                            <a
                              href={p.downloadLink}
                              download
                              className="text-green-600 hover:underline"
                            >
                              Download
                            </a>
                          ) : (
                            "—"
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

        {/* Sticky footer: pagination */}
        <div className="sticky bottom-0 bg-background border-t">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3">
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
