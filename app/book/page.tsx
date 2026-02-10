"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import BookingWizard from "@/components/BookingWizard";

export default function BookPage() {
  return (
    <>
      <Navbar />
      <div className="px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-foreground"
        >
          &larr; Back to Services
        </Link>
        <BookingWizard />
      </div>
    </>
  );
}