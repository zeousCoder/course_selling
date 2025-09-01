// hooks/useUserList.ts
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getUserList } from "@/actions/userListAction";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
}

export const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoadingData(true);
    setError(null);
    try {
      const data = await getUserList();
      setUsers(data || []);
    } catch (err) {
      const errorMessage = "Failed to load users";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  return {
    users,
    loadingData,
    error,
    fetchUsers,
  };
};
