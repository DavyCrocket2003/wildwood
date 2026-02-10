import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SpecialOccasionsPage() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-foreground"
        >
          &larr; Back to Services
        </Link>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Special Occasions
        </h1>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />
        <p className="mt-6 leading-relaxed text-muted">
          I believe the earth offers the perfect setting to mark significant events or to support you through grief, transitions, or celebrations. I would be honored to facilitate a passage of this sort for you or your family. This is only offered as a custom experience. Please contact me to discuss your desire and vision and see if what I can offer matches your needs.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-sm font-medium text-accent-foreground no-underline transition-colors hover:bg-accent-hover"
        >
          Book This Service
        </Link>
      </div>
    </>
  );
}
