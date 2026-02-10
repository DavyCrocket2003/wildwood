import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServiceColumns from "@/components/ServiceColumns";
import AboutSidebar from "@/components/AboutSidebar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-10 lg:flex-row">
          {/* Mobile: sidebar first */}
          <div className="lg:hidden">
            <AboutSidebar />
          </div>

          {/* Main content: service columns */}
          <ServiceColumns />

          {/* Desktop: sidebar on the right */}
          <div className="hidden lg:block">
            <AboutSidebar />
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <img
            src="/images/logo-swirl.svg"
            alt="WildWoods"
            className="mx-auto mb-3 h-8 w-8 opacity-60"
          />
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} WildWoods Studio. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
