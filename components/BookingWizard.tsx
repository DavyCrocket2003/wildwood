"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { services as defaultServices, type Service } from "@/lib/mock-data";
import ServiceCard from "@/components/ServiceCard";
import CalendarMock from "@/components/CalendarMock";
import UserDetailsForm from "@/components/UserDetailsForm";
import Sidebar from "@/components/Sidebar";

const steps = ["Service", "Time", "Details"];

interface BookingWizardProps {
  bookableServices?: Service[];
  providerData?: {
    name: string;
    title: string;
    phone: string;
    email: string;
    timezone: string;
  };
}

export default function BookingWizard({
  bookableServices,
  providerData,
}: BookingWizardProps) {
  const services = bookableServices || defaultServices;
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Deep-link: if ?service=slug is present, auto-select and skip to step 1
  useEffect(() => {
    const serviceSlug = searchParams.get("service");
    if (serviceSlug) {
      const match = services.find((s) => s.id === serviceSlug);
      if (match) {
        setSelectedService(match);
        setStep(1);
      }
    }
  }, [searchParams, services]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(1);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(2);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <h1 className="text-2xl font-semibold text-foreground">
              Book an Appointment
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                      i <= step
                        ? "bg-accent text-accent-foreground"
                        : "bg-surface text-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      i <= step
                        ? "font-medium text-foreground"
                        : "text-muted"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-1 h-px w-8 sm:w-12 ${
                      i < step ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Select a Service
              </h2>
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onClick={() => handleServiceSelect(service)}
                />
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Choose a Date &amp; Time
              </h2>
              <CalendarMock
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={handleDateSelect}
                onSelectTime={handleTimeSelect}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Your Details
              </h2>
              <UserDetailsForm onSubmit={() => {}} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar
          selectedService={selectedService}
          selectedDate={
            selectedDate ? format(selectedDate, "MMMM d, yyyy") : null
          }
          selectedTime={selectedTime}
          providerData={providerData}
        />
      </div>
    </div>
  );
}