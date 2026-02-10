import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ForestBathingPage() {
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
          Forest Bathing
        </h1>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />
        <p className="mt-6 leading-relaxed text-muted">
          This is adult and teen focused and is customizable for private groups or you can join a scheduled group outing. The basic structure consists of traveling to a forest location, participating in a forest bathing activity intended to bring you in direct contact with the earth, practice guided meditation and breathing activities, reflect as a group, and return home. My most enjoyable versions of this begin with simply hiking to a unique geographical location, cross country skiing out and sitting in hammocks, or going out at a full moon or a new moon for different night light experience and then participating in the forest bathing activity. Check the calendar to join a scheduled event or contact Emily to set up a private outing.
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
