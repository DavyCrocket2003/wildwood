import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DoterraPage() {
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
          Essential Oils by DōTerra
        </h1>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />
        <p className="mt-6 leading-relaxed text-muted">
          I use essential oils in every session as I have found the results to be noticeably and often dramatically more positive and powerful. I occasionally teach classes about how to use the oils to improve your health and quality of life. My oils shop is found at <a href="https://referral.doterra.me/10479" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://referral.doterra.me/10479</a>
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
