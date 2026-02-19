import Link from "next/link";
import { Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface ServicesGridProps {
  services?: Service[];
}

export default function ServicesGrid({
  services,
}: ServicesGridProps) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold text-foreground">Services</h2>
        <div className="mx-auto mt-2 h-0.5 w-10 rounded-full bg-accent-soft" />

        <div className="mt-8 space-y-4">
          {services.map((service) => (
            <Link
              key={service.id}
              href="/book"
              className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 no-underline transition-all duration-200 hover:border-accent/50 hover:bg-surface-hover"
            >
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {service.name}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {service.duration} min
                  </span>
                  {service.price > 0 && (
                    <span className="font-medium text-accent">
                      ${service.price}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted">
                  {service.description}
                </p>
              </div>
              <span className="ml-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5">
                &#8594;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}