"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Save, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface ServiceData {
  id: number;
  category: "studio" | "nature";
  title: string;
  description: string;
  price: number;
  duration: number;
  detail_text: string;
  is_active: boolean;
}

interface EditableServiceProps {
  service: ServiceData;
  onUpdate?: (updatedService: ServiceData) => void;
  className?: string;
}

export function EditableService({ service, onUpdate, className = "" }: EditableServiceProps) {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState<ServiceData>(service);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEditedService(service);
  }, [service]);

  const handleSave = async () => {
    if (!editedService.title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    if (editedService.price < 0) {
      setError("Price cannot be negative");
      return;
    }

    if (editedService.duration <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedService),
      });

      if (!response.ok) {
        throw new Error("Failed to save service");
      }

      const updatedService = { ...editedService };
      setEditedService(updatedService);
      setIsEditing(false);
      onUpdate?.(updatedService);
    } catch (error) {
      setError("Failed to save. Please try again.");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedService(service);
    setIsEditing(false);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isAdmin) {
    return <div className={className}>{service.title}</div>;
  }

  return (
    <div className={`group relative ${className}`}>
      {isEditing ? (
        <div className="space-y-4 p-6 border-4 border-blue-600 rounded-lg bg-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editedService.title}
                onChange={(e) => setEditedService({ ...editedService, title: e.target.value })}
                className="w-full p-3 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                placeholder="Service title"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Category
              </label>
              <select
                value={editedService.category}
                onChange={(e) => setEditedService({ ...editedService, category: e.target.value as "studio" | "nature" })}
                className="w-full p-3 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
              >
                <option value="studio">Studio</option>
                <option value="nature">Nature</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedService.price}
                onChange={(e) => setEditedService({ ...editedService, price: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={editedService.duration}
                onChange={(e) => setEditedService({ ...editedService, duration: parseInt(e.target.value) || 60 })}
                className="w-full p-3 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                placeholder="60"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editedService.description}
              onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Service description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detail Text
            </label>
            <textarea
              value={editedService.detail_text}
              onChange={(e) => setEditedService({ ...editedService, detail_text: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Detailed service information"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={editedService.is_active}
              onChange={(e) => setEditedService({ ...editedService, is_active: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm font-bold text-gray-900">
              Active (visible to users)
            </label>
          </div>
          {error && (
            <div className="text-red-700 text-sm font-semibold bg-red-100 p-2 rounded">{error}</div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50 border-2 border-green-800"
            >
              <Save className="h-5 w-5" />
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold bg-gray-700 text-white rounded-md hover:bg-gray-800 border-2 border-gray-800"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="text-black font-bold">{service.title}</div>
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-100 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg border-2 border-blue-700"
            title="Edit service"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
