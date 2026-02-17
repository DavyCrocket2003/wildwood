"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function LogoutButton() {
  const { logout, isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
      title="Logout"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
