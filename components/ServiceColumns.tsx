import Link from "next/link";
import { Trees, Home } from "lucide-react";
import type { DatabaseService } from "@/lib/data";

interface ServiceColumnsProps {
  studioServices?: DatabaseService[];
  natureServices?: DatabaseService[];
}

function ServiceList({
  services,
}: {
  services: DatabaseService[];
}) {
  return (
    <div className="space-y-3">
      {services.map((service) => (
        <Link
          key={service.id}
          href={`/services/${service.id}`}
          className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 no-underline transition-all duration-200 hover:border-accent/50 hover:bg-surface-hover"
        >
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {service.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{service.description}</p>
          </div>
          <span className="ml-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5">
            &#8594;
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function ServiceColumns({
  studioServices = [],
  natureServices = [],
}: ServiceColumnsProps) {
  return (
    <section className="flex-1">
      <div className="grid gap-8 md:grid-cols-2">
        {/* In Studio */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">In Studio</h2>
          </div>
          <ServiceList services={studioServices} />
        </div>

        {/* In Nature */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Trees className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">In Nature</h2>
          </div>
          <ServiceList services={natureServices} />
        </div>
      </div>
    </section>
  );
}
