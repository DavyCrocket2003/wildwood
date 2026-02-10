import Link from "next/link";
import { Phone } from "lucide-react";
import { provider } from "@/lib/mock-data";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src="/images/logo-swirl.svg"
            alt="Wildwood"
            className="h-8 w-8"
          />
          <span className="text-lg font-semibold text-foreground">
            WildWoods
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${provider.phone}`}
            className="hidden items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground sm:flex"
          >
            <Phone className="h-4 w-4" />
            {provider.phone}
          </a>
          <Link
            href="/book"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground no-underline transition-colors hover:bg-accent-hover"
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}