"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EditableService } from "@/components/editable/EditableService";
import { useAuth } from "@/components/auth/AuthProvider";

interface Service {
  id: number;
  category: "studio" | "nature";
  title: string;
  description: string;
  price: number;
  duration: number;
  detail_text: string;
  is_active: boolean;
}

interface ServiceDetailProps {
  service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  const { isAdmin } = useAuth();
  const [currentService, setCurrentService] = useState(service);
  const [isEditing, setIsEditing] = useState(false);

  // Use detail_text if available, fall back to description
  const bodyText = currentService.detail_text || currentService.description;
  const title = currentService.title;

  if (isAdmin && isEditing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-4">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-foreground"
          >
            ← Exit Edit Mode
          </button>
        </div>
        <EditableService
          service={currentService}
          onUpdate={(updatedService) => {
            setCurrentService(updatedService);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex justify-between items-start mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-foreground"
        >
          ← Back to Services
        </Link>
        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Service
          </button>
        )}
      </div>
      
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
        {title}
      </h1>
      <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />

      {currentService.price !== null && currentService.duration !== null && (
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <span>{currentService.duration} min</span>
          <span className="font-medium text-accent">${currentService.price}</span>
        </div>
      )}

      <div className="mt-6 space-y-4 leading-relaxed text-muted">
        {bodyText.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {currentService.price !== null && currentService.price > 0 && (
        <Link
          href={`/book?service=${currentService.id}`}
          className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-sm font-medium text-accent-foreground no-underline transition-colors hover:bg-accent-hover"
        >
          Book This Service
        </Link>
      )}
    </div>
  );
}
