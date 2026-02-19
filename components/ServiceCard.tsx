"use client";

import { ChevronRight, Clock } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onClick?: () => void;
}

export default function ServiceCard({
  service,
  selected = false,
  onClick,
}: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-accent bg-accent/10"
          : "border-border bg-surface hover:border-accent/50 hover:bg-surface-hover"
      }`}
    >
      <div className="flex-1">
        <h3 className="text-base font-semibold text-foreground">
          {service.name}
        </h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration} min
          </span>
          {service.price > 0 && (
            <span className="font-medium text-accent">${service.price}</span>
          )}
        </div>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(service.description, {
              ALLOWED_TAGS: ['a', 'b', 'strong', 'i', 'em', 'br', 'ul', 'ol', 'li', 'p', 'h1', 'h2', 'h3', 'u'],
              ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
            })
          }} 
          className="mt-2 text-sm text-muted prose prose-slate max-w-none"
        />
      </div>
      <ChevronRight
        className={`ml-4 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
          selected ? "text-accent" : "text-muted"
        }`}
      />
    </button>
  );
}