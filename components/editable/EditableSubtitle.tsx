"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Save } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface EditableSubtitleProps {
  contentKey: string;
  initialValue: string;
  className?: string;
  placeholder?: string;
  onUpdate?: () => void;
}

export function EditableSubtitle({
  contentKey,
  initialValue,
  className = "",
  placeholder = "Enter subtitle...",
  onUpdate,
}: EditableSubtitleProps) {
  const { isAdmin, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const fetchCurrentValue = async () => {
      try {
        const snakeKey = contentKey.replace(/([A-Z])/g, '_$1').toLowerCase();
        const response = await fetch(`/api/content/${snakeKey}`);
        if (response.ok) {
          const data = await response.json() as { value: string };
          setValue(data.value);
        } else if (response.status === 404) {
          setValue(initialValue);
        }
      } catch (error) {
        console.error("Failed to fetch current value:", error);
        setValue(initialValue);
      }
    };

    if (contentKey) {
      fetchCurrentValue();
    }
  }, [contentKey, initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      const snakeKey = contentKey.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      const response = await fetch(`/api/content/${snakeKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      setError("Failed to save. Please try again.");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
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
    return <p className={className}>{value}</p>;
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
            className="w-full p-2 border-2 border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-xs"
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
        <div className="flex items-start gap-2">
          <p className={`${className} ${value ? "" : "text-gray-400 italic"}`}>
            {value || placeholder}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg transition-colors border-2 border-blue-700"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
