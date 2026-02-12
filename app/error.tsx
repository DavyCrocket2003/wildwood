"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-3 text-muted">
        We&apos;re having trouble loading this page. Please try again.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground no-underline transition-colors hover:bg-surface"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
