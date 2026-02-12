import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServiceColumns from "@/components/ServiceColumns";
import AboutSidebar from "@/components/AboutSidebar";
import { getSheetData } from "@/lib/sheet-data";
import { Mail, Phone } from "lucide-react";

export const runtime = "edge";

export default async function Home() {
  const data = await getSheetData();

  return (
    <>
      <Navbar phone={data.content.contactPhone} />
      <Hero
        title={data.content.heroTitle}
        subtitle={data.content.heroSubtitle}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-10 lg:flex-row">
          {/* Mobile: sidebar first */}
          <div className="lg:hidden">
            <AboutSidebar
              phone={data.content.contactPhone}
              email={data.content.contactEmail}
            />
          </div>

          {/* Main content: service columns */}
          <ServiceColumns
            studioServices={data.studioServices}
            natureServices={data.natureServices}
          />

          {/* Desktop: sidebar on the right */}
          <div className="hidden lg:block">
            <AboutSidebar
              phone={data.content.contactPhone}
              email={data.content.contactEmail}
            />
          </div>
        </div>
      </div>

      <footer className="relative border-t border-border py-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/flowers-forest.jpg')" }}
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <img
            src="/images/logo-swirl.svg"
            alt="WildWoods"
            className="mx-auto mb-3 h-8 w-8 opacity-60"
          />
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} WildWoods Studio. All rights
            reserved.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
            {data.content.contactPhone && (
              <a
                href={`tel:${data.content.contactPhone}`}
                className="inline-flex items-center gap-1.5 no-underline transition-colors hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
                {data.content.contactPhone}
              </a>
            )}
            {data.content.contactEmail && (
              <a
                href={`mailto:${data.content.contactEmail}`}
                className="inline-flex items-center gap-1.5 no-underline transition-colors hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                {data.content.contactEmail}
              </a>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
