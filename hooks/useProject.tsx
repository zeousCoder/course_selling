"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import {
  postProject,
  getProjects,
  deleteProjects,
} from "@/actions/projectAction"; // adjust path

export function useProjects() {
  const [isPending, startTransition] = useTransition();
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Fetch all projects (on mount or manually)
  const fetchProjects = useCallback(() => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await getProjects();
        if (!res.success) throw new Error(res.message);
        setProjects(res.data);
      } catch (err: any) {
        setError(err.message);
      }
    });
  }, []);

  // ✅ Create new project
  const createProject = useCallback(
    (formData: FormData) => {
      setError(null);
      setMessage(null);
      startTransition(async () => {
        try {
          const res = await postProject(formData);
          if (!res.success) throw new Error(res.message);
          setMessage(res.message);
          fetchProjects(); // refresh list after new project
        } catch (err: any) {
          setError(err.message);
        }
      });
    },
    [fetchProjects]
  );

  const removeProject = useCallback(
    (id: string) => {
      setError(null);
      setMessage(null);
      startTransition(async () => {
        try {
          const res = await deleteProjects(id);
          if (!res || !res.success) {
            setError(
              res?.message || "An error occurred while deleting the project."
            );
            return;
          }
          setMessage(res.message);
          fetchProjects(); // refresh list after deletion
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
        }
      });
    },
    [fetchProjects]
  );

  // Auto-load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isPending,
    error,
    message,
    createProject,
    fetchProjects,
    removeProject,
  };
}
