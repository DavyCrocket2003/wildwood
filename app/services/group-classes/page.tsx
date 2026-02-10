import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function GroupClassesPage() {
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
          Group Class Education
        </h1>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />
        <p className="mt-6 leading-relaxed text-muted">
          In a group class, you can learn about and experience a variety of simple ways to adjust the way you live to create more ease and joy in your life. Topics range from Human Design, using touch to connect and improve bonding and trust with your family, essential oil basics, and breathwork and grounding techniques with the idea that you can grow in self love, gain clarity and discernment, and strengthen your ability to choose a life filled with value and beauty in every moment.
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
