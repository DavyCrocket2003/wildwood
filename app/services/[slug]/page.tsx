import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSheetData, getServiceBySlug } from "@/lib/sheet-data";

export const runtime = "edge";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const data = await getSheetData();

  // Use detailText if available, fall back to the detail_title field for
  // services like Forest School where the long text is in detail_title
  const bodyText = service.detailText || service.detailTitle || service.about;
  const title = service.detailText
    ? service.detailTitle
    : service.detailTitle || service.name;

  return (
    <>
      <Navbar phone={data.content.contactPhone} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted no-underline hover:text-foreground"
        >
          &larr; Back to Services
        </Link>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {title}
        </h1>
        <div className="mt-3 h-0.5 w-12 rounded-full bg-accent" />

        {service.price !== null && service.duration !== null && (
          <div className="mt-4 flex items-center gap-4 text-sm text-muted">
            <span>{service.duration} min</span>
            <span className="font-medium text-accent">${service.price}</span>
          </div>
        )}

        <div className="mt-6 space-y-4 leading-relaxed text-muted">
          {bodyText.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {service.price !== null && service.price > 0 && (
          <Link
            href={`/book?service=${service.slug}`}
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-sm font-medium text-accent-foreground no-underline transition-colors hover:bg-accent-hover"
          >
            Book This Service
          </Link>
        )}
      </div>
    </>
  );
}
