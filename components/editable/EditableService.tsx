"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Save, X, Maximize2 } from "lucide-react";
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
  has_detail_page: boolean;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalField, setModalField] = useState<"description" | "detail_text" | null>(null);

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
        <div className="space-y-4 p-4 border border-gray-300 rounded-md bg-yellow-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editedService.title}
                onChange={(e) => setEditedService({ ...editedService, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Service title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={editedService.category}
                onChange={(e) => setEditedService({ ...editedService, category: e.target.value as "studio" | "nature" })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="studio">Studio</option>
                <option value="nature">Nature</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedService.price}
                onChange={(e) => setEditedService({ ...editedService, price: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={editedService.duration}
                onChange={(e) => setEditedService({ ...editedService, duration: parseInt(e.target.value) || 60 })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="flex gap-2">
              <textarea
                value={editedService.description}
                onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Service description"
              />
              <button
                type="button"
                onClick={() => {
                  setModalField("description");
                  setIsModalOpen(true);
                }}
                className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-500"
                title="Expand to full screen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detail Text
            </label>
            <div className="flex gap-2">
              <textarea
                value={editedService.detail_text}
                onChange={(e) => setEditedService({ ...editedService, detail_text: e.target.value })}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Detailed service information"
              />
              <button
                type="button"
                onClick={() => {
                  setModalField("detail_text");
                  setIsModalOpen(true);
                }}
                className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-500"
                title="Expand to full screen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={editedService.is_active}
              onChange={(e) => setEditedService({ ...editedService, is_active: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active (visible to users)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="has_detail_page"
              checked={editedService.has_detail_page}
              onChange={(e) => setEditedService({ ...editedService, has_detail_page: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="has_detail_page" className="text-sm font-medium text-gray-700">
              Has detail page (links to service details)
            </label>
          </div>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="text-gray-900">{service.title}</div>
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-600 hover:text-blue-600"
            title="Edit service"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {isModalOpen && modalField && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-h-[90vh] max-w-4xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit {modalField === "description" ? "Description" : "Detail Text"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <textarea
                value={modalField === "description" ? editedService.description : editedService.detail_text}
                onChange={(e) => {
                  if (modalField === "description") {
                    setEditedService({ ...editedService, description: e.target.value });
                  } else {
                    setEditedService({ ...editedService, detail_text: e.target.value });
                  }
                }}
                className="w-full h-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                placeholder={modalField === "description" ? "Service description" : "Detailed service information"}
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
