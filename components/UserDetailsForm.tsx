"use client";

import { useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface UserDetailsFormProps {
  onSubmit: () => void;
}

export default function UserDetailsForm({ onSubmit }: UserDetailsFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comments: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    onSubmit();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Phone
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border bg-surface-hover px-3 text-sm text-muted">
              +1
            </span>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="(555) 000-0000"
              className="w-full rounded-l-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Comments
          </label>
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            rows={3}
            placeholder="Any special requests or notes..."
            className="w-full resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Confirm Booking
        </button>

        <p className="text-xs leading-relaxed text-muted">
          By confirming, you agree to our cancellation policy. Cancellations
          made less than 24 hours before the appointment may be subject to a
          fee. Please contact us if you need to reschedule.
        </p>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute right-3 top-3 text-muted transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <CheckCircle className="mx-auto h-12 w-12 text-accent" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Booking Confirmed!
            </h3>
            <p className="mt-2 text-sm text-muted">
              Thank you for booking with Wildwood Wellness. We&apos;ll send a
              confirmation to your email shortly.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}