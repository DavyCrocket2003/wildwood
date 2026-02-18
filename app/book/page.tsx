import Link from "next/link";
import Navbar from "@/components/Navbar";
import BookingWizard from "@/components/BookingWizard";
import { getAppData } from "@/lib/data";
import { Suspense } from "react";

export const runtime = 'edge';

export default async function BookPage() {
  const data = await getAppData();

  return (
    <>
      <Navbar phone={data.content.contactPhone} siteTitle={data.content.siteTitle} />
      <div className="px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-foreground"
        >
          &larr; Back to Services
        </Link>
        <Suspense fallback={<div>Loading booking wizard...</div>}>
          <BookingWizard
            bookableServices={data.bookableServices}
            providerData={data.provider}
          />
        </Suspense>
      </div>
    </>
  );
}