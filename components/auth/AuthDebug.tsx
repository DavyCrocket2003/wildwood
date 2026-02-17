"use client";

import { useAuth } from "./AuthProvider";

export function AuthDebug() {
  const { isAdmin, loading } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-sm z-50">
      <div>Loading: {loading ? "Yes" : "No"}</div>
      <div>Is Admin: {isAdmin ? "Yes" : "No"}</div>
    </div>
  );
}
