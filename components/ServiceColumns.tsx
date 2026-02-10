import Link from "next/link";
import { Trees, Home } from "lucide-react";

const studioServices = [
  {
    name: "Stickwork Training",
    slug: "stickwork-training",
    description: "Learn the art of natural stick construction and creative building with foraged materials.",
  },
  {
    name: "doTERRA",
    slug: "doterra",
    description: "Essential oil wellness consultations and aromatherapy experiences.",
  },
  {
    name: "Group Classes",
    slug: "group-classes",
    description: "Community-centered group sessions for movement, mindfulness, and connection.",
  },
];

const natureServices = [
  {
    name: "Forest School",
    slug: "forest-school",
    description: "Outdoor learning experiences rooted in nature-based education and exploration.",
  },
  {
    name: "Forest Bathing Therapy",
    slug: "forest-bathing",
    description: "Guided sensory immersion in nature for deep relaxation and mental clarity.",
  },
  {
    name: "Special Occasions",
    slug: "special-occasions",
    description: "Unique nature-based gatherings for birthdays, retreats, and celebrations.",
  },
];

function ServiceList({
  services,
}: {
  services: { name: string; slug: string; description: string }[];
}) {
  return (
    <div className="space-y-3">
      {services.map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 no-underline transition-all duration-200 hover:border-accent/50 hover:bg-surface-hover"
        >
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {service.name}
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

export default function ServiceColumns() {
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
