"use client";

import { Phone, Mail } from "lucide-react";
import { EditableSubtitle } from "@/components/editable/EditableSubtitle";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface ProviderData {
  name: string;
  title: string;
  phone: string;
  email: string;
  timezone: string;
}

interface SidebarProps {
  selectedService?: Service | null;
  selectedDate?: string | null;
  selectedTime?: string | null;
  providerData?: ProviderData;
}

export default function Sidebar({
  selectedService,
  selectedDate,
  selectedTime,
  providerData,
}: SidebarProps) {
  const hasBookingInfo = selectedService || selectedDate || selectedTime;

  return (
    <aside className="w-full lg:sticky lg:top-20 lg:w-80 lg:shrink-0 lg:self-start">
      <div className="space-y-4">
        {/* Provider Card */}

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <div className="w-full">
              <h3 className="text-sm font-semibold text-foreground">
                {providerData?.name}
              </h3>
              <EditableSubtitle
                contentKey="providerSubtitle"
                initialValue={providerData?.title}
                className="text-xs text-muted"
                placeholder="Enter provider subtitle..."
              />
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
              href={providerData?.phone ? `tel:${providerData.phone}` : undefined}
              className="flex items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              {providerData?.phone}
            </a>
            <a
              href={providerData?.email ? `mailto:${providerData.email}` : undefined}
              className="flex items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {providerData?.email}
            </a>
          </div>
          <p className="mt-3 text-xs text-muted">
            {providerData?.timezone}
          </p>
        </div>
      </div>
    </aside>

  );

}