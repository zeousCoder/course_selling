"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideFileText, Download, ArrowRight, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProject"; // ✅ import hook
import ShimmerText from "../ShimmerText";

export default function ProjectsCard() {
  const { projects, fetchProjects, isPending, error } = useProjects();

  // fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight">
          <span className="">Featured Projects 🚀</span>
        </h2>
        <p className="mt-4 text-lg  max-w-2xl mx-auto">
          Explore a showcase of my professional work, highlighting expertise in
          data analytics, business intelligence, and machine learning.
        </p>
      </div>

      {isPending ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-600 dark:text-gray-300">
            <ShimmerText text="Loading..." />
          </span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-center  py-8">
          <ShimmerText text="Comming Soon..." />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col h-full rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardHeader className="flex-grow">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.filesName?.length > 0 ? (
                    project.filesName.map((file: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium gap-1"
                      >
                        <LucideFileText size={14} className="text-blue-500" />
                        {file}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No files</span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  {project.viewDetails ? (
                    <a
                      href={project.viewDetails}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-6 py-2 shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  ) : (
                    <span className="flex-1 text-center text-gray-400 text-sm">
                      No details
                    </span>
                  )}

                  {project.downloadLink ? (
                    <a href={project.downloadLink} download>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </Button>
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">No file</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
