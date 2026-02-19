"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trees, Home, Edit, Plus } from "lucide-react";
import { EditableService } from "@/components/editable/EditableService";
import { useAuth } from "@/components/auth/AuthProvider";
import { DatabaseService } from "@/lib/data";
import DOMPurify from "isomorphic-dompurify";

interface ServiceColumnsProps {
  studioServices?: DatabaseService[];
  natureServices?: DatabaseService[];
}

function ServiceList({
  services,
  onUpdate,
}: {
  services: DatabaseService[];
  onUpdate?: (updatedService: DatabaseService) => void;
}) {
  const { isAdmin } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);

  if (editingId !== null) {
    const editingService = services.find(s => s.id === editingId);
    if (editingService) {
      return (
        <div className="p-6 border-4 border-blue-600 rounded-lg bg-white shadow-xl">
          <EditableService
            service={editingService}
            onUpdate={(updatedService) => {
              setEditingId(null);
              onUpdate?.(updatedService);
            }}
          />
          <button
            onClick={() => setEditingId(null)}
            className="mt-2 px-4 py-2 text-sm font-semibold bg-gray-700 text-white rounded-md hover:bg-gray-800 border-2 border-gray-800"
          >
            Cancel
          </button>
        </div>
      );
    }
  }

  return (
    <div className="space-y-3">
      {services.map((service) => {
        const ServiceContent = (
          <div className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:border-accent/50 hover:bg-surface-hover">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {service.title}
              </h3>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(service.description, {
                    ALLOWED_TAGS: ['a', 'b', 'strong', 'i', 'em', 'br', 'ul', 'ol', 'li', 'p', 'h1', 'h2', 'h3', 'u'],
                    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
                  })
                }} 
                className="mt-1 text-sm text-muted prose prose-slate max-w-none"
              />
              {service.price !== null && service.duration !== null && service.price > 0 && (
                <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                  <span>{service.duration} min</span>
                  <span className="font-medium text-accent">${service.price}</span>
                </div>
              )}
            </div>
            {!!service.has_detail_page && (
              <span className="ml-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5">
                &#8594;
              </span>
            )}
          </div>
        );

        return (
          <div key={service.id} className="group relative">
            {service.has_detail_page ? (
              <Link
                href={`/services/${service.id}`}
                className="no-underline"
              >
                {ServiceContent}
              </Link>
            ) : (
              ServiceContent
            )}
            {isAdmin && (
              <button
                onClick={() => setEditingId(service.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg border-2 border-blue-700"
                title="Edit service"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function EditableServiceColumns({
  studioServices = [],
  natureServices = [],
}: ServiceColumnsProps) {
  const { isAdmin } = useAuth();
  const [studioServicesList, setStudioServicesList] = useState(studioServices);
  const [natureServicesList, setNatureServicesList] = useState(natureServices);

  // Update local state when props change (e.g., after login when data is refreshed)
  useEffect(() => {
    setStudioServicesList(studioServices);
    setNatureServicesList(natureServices);
  }, [studioServices, natureServices]);

  const handleUpdateService = (updatedService: DatabaseService) => {
    if (updatedService.category === "studio") {
      setStudioServicesList(services => 
        services.map(s => s.id === updatedService.id ? updatedService : s)
      );
    } else {
      setNatureServicesList(services => 
        services.map(s => s.id === updatedService.id ? updatedService : s)
      );
    }
  };

  return (
    <section className="flex-1">
      <div className="grid gap-8 md:grid-cols-2">
        {/* In Studio */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-accent-soft" />
            <h2 className="text-xl font-semibold text-foreground">In Studio</h2>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="ml-auto inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 border-2 border-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add
              </Link>
            )}
          </div>
          <ServiceList 
            services={studioServicesList} 
            onUpdate={handleUpdateService}
          />
        </div>

        {/* In Nature */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Trees className="h-5 w-5 text-accent-soft" />
            <h2 className="text-xl font-semibold text-foreground">In Nature</h2>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="ml-auto inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 border-2 border-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add
              </Link>
            )}
          </div>
          <ServiceList 
            services={natureServicesList} 
            onUpdate={handleUpdateService}
          />
        </div>
      </div>
    </section>
  );
}
