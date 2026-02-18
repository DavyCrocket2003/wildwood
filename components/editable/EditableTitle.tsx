"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Save } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface EditableTitleProps {
  contentKey: string;
  initialValue?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  placeholder?: string;
}

export function EditableTitle({
  contentKey,
  initialValue,
  className = "",
  as: Component = "h2",
  placeholder = "Enter title...",
}: EditableTitleProps) {
  const { isAdmin, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const [dbValue, setDbValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch current value from database when component mounts
  useEffect(() => {
    const fetchCurrentValue = async () => {
      try {
        // Convert camelCase key to snake_case for database lookup
        const snakeKey = contentKey.replace(/([A-Z])/g, '_$1').toLowerCase();
        const response = await fetch(`/api/content/${snakeKey}`);
        if (response.ok) {
          const data = await response.json() as { value: string };
          setValue(data.value);
          setDbValue(data.value);
        } else if (response.status === 404) {
          // No content in DB yet, leave empty
          setDbValue("");
        }
      } catch (error) {
        console.error("Failed to fetch current value:", error);
        setDbValue("");
      } finally {
        setHasFetched(true);
      }
    };

    if (contentKey && !hasFetched) {
      fetchCurrentValue();
    }
  }, [contentKey]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!value.trim()) {
      setError("Title cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Convert camelCase key to snake_case for database storage
      const snakeKey = contentKey.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      const response = await fetch(`/api/content/${snakeKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: value.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      setIsEditing(false);
      setDbValue(value.trim());
    } catch (error) {
      setError("Failed to save. Please try again.");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(dbValue ?? "");
    setIsEditing(false);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isAdmin) {
    return <Component className={className}>{value}</Component>;
  }

  return (
    <div className="group relative">
      {isEditing ? (
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full p-3 border-2 border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium ${className}`}
            placeholder={placeholder}
          />
          {error && (
            <div className="text-red-700 text-sm font-semibold bg-red-100 p-2 rounded">{error}</div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50 border-2 border-green-800"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-700 text-white rounded-md hover:bg-gray-800 border-2 border-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Component className={`${className} ${value ? "" : "text-gray-400 italic"}`}>
            {value || placeholder}
          </Component>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg transition-colors border-2 border-blue-700"
            title="Edit"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
