"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Maximize2, X } from "lucide-react";
import { EditableService } from "@/components/editable/EditableService";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

interface Service {
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

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    category: "studio",
    title: "",
    description: "",
    price: 0,
    duration: 60,
    detail_text: "",
    is_active: true,
    has_detail_page: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalField, setModalField] = useState<"description" | "detail_text" | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json() as { services: Service[] };
      setServices(data.services || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.title?.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        setNewService({
          category: "studio",
          title: "",
          description: "",
          price: 0,
          duration: 60,
          detail_text: "",
          is_active: true,
          has_detail_page: false,
        });
        setShowAddForm(false);
        fetchServices();
      } else {
        alert("Failed to add service");
      }
    } catch (error) {
      console.error("Failed to add service:", error);
      alert("Failed to add service");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to be an admin to access this page.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your services and content</p>
          </div>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to site
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Services</h2>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Add New Service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Service title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value as "studio" | "nature" })}
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
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
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
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 60 })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="60"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detail Text
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={newService.detail_text}
                    onChange={(e) => setNewService({ ...newService, detail_text: e.target.value })}
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
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="new_is_active"
                  checked={newService.is_active}
                  onChange={(e) => setNewService({ ...newService, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="new_is_active" className="text-sm font-medium text-gray-700">
                  Active (visible to users)
                </label>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="new_has_detail_page"
                  checked={newService.has_detail_page}
                  onChange={(e) => setNewService({ ...newService, has_detail_page: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="new_has_detail_page" className="text-sm font-medium text-gray-700">
                  Has detail page (links to service details)
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleAddService}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Service
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading services...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No services found. Add your first service above.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                  <EditableService
                    service={service}
                    onUpdate={(updatedService) => {
                      setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
                    }}
                    className="mb-4"
                  />
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Link
                      href={`/services/${service.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
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
                value={modalField === "description" ? newService.description : newService.detail_text}
                onChange={(e) => {
                  if (modalField === "description") {
                    setNewService({ ...newService, description: e.target.value });
                  } else {
                    setNewService({ ...newService, detail_text: e.target.value });
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
