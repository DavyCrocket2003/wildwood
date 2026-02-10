"use client";

import { Star, Phone, Mail } from "lucide-react";
import { provider, type Service } from "@/lib/mock-data";

interface SidebarProps {
  selectedService?: Service | null;
  selectedDate?: string | null;
  selectedTime?: string | null;
}

export default function Sidebar({
  selectedService,
  selectedDate,
  selectedTime,
}: SidebarProps) {
  const hasBookingInfo = selectedService || selectedDate || selectedTime;

  return (
    <aside className="w-full lg:sticky lg:top-20 lg:w-80 lg:shrink-0 lg:self-start">
      <div className="space-y-4">
        {/* Provider Card */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-swirl.svg"
              alt={provider.name}
              className="h-12 w-12 rounded-full bg-surface-hover p-1"
            />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {provider.name}
              </h3>
              <p className="text-xs text-muted">{provider.title}</p>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        {hasBookingInfo && (
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Booking Summary
            </h3>
            <div className="space-y-2 text-sm">
              {selectedService && (
                <div className="flex justify-between">
                  <span className="text-muted">Service</span>
                  <span className="text-foreground">
                    {selectedService.name} ({selectedService.duration}min)
                  </span>
                </div>
              )}
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-muted">Date</span>
                  <span className="text-foreground">{selectedDate}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-muted">Time</span>
                  <span className="text-foreground">{selectedTime}</span>
                </div>
              )}
              {selectedService && (
                <>
                  <div className="my-2 border-t border-border" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-accent">
                      ${selectedService.price}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Contact Card */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Contact
          </h3>
          <div className="space-y-2">
            <a
              href={`tel:${provider.phone}`}
              className="flex items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              {provider.phone}
            </a>
            <a
              href={`mailto:${provider.email}`}
              className="flex items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {provider.email}
            </a>
          </div>
          <p className="mt-3 text-xs text-muted">
            {provider.timezone}
          </p>
        </div>
      </div>
    </aside>
  );
}