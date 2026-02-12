import {
  services as fallbackServices,
  reviews as fallbackReviews,
  provider as fallbackProvider,
  type Service,
  type Review,
} from "./mock-data";

// ── OpenSheet endpoint ──────────────────────────────────────────────
const SHEET_ID = "1EOCihY-_YXcwlWB3kFpc6kuSLLn5WfG1hko3g0cWd7U";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;

// ISR revalidation interval in seconds (15 minutes)
export const REVALIDATE_SECONDS = 900;

// ── Raw row shape from the Google Sheet ─────────────────────────────
interface SheetRow {
  site_title: string;
  hero_title: string;
  hero_subtitle: string;
  contact_phone: string;
  contact_email: string;
  [key: string]: string; // studio_N_* and nature_N_* fields
}

// ── Transformed types ───────────────────────────────────────────────
export interface SiteContent {
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
}

export interface SheetService {
  slug: string;
  name: string;
  about: string;
  detailTitle: string;
  detailText: string;
  price: number | null;
  duration: number | null;
  category: "studio" | "nature";
}

export interface SheetData {
  content: SiteContent;
  studioServices: SheetService[];
  natureServices: SheetService[];
  bookableServices: Service[];
  reviews: Review[];
  provider: typeof fallbackProvider;
}

// ── Slug generation ─────────────────────────────────────────────────
function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Parse numbered service fields from the flat row ─────────────────
function parseServices(
  row: SheetRow,
  prefix: "studio" | "nature",
): SheetService[] {
  const services: SheetService[] = [];

  for (let i = 1; i <= 10; i++) {
    const title = row[`${prefix}_${i}_title`];
    if (!title) break;

    const priceStr = row[`${prefix}_${i}_price`];
    const lengthStr = row[`${prefix}_${i}_length`];

    services.push({
      slug: toSlug(title),
      name: title,
      about: row[`${prefix}_${i}_about`] || "",
      detailTitle: row[`${prefix}_${i}_detail_title`] || title,
      detailText: row[`${prefix}_${i}_detail_text`] || "",
      price: priceStr ? Number(priceStr) : null,
      duration: lengthStr ? Number(lengthStr) : null,
      category: prefix,
    });
  }

  return services;
}

// ── Convert SheetService[] → bookable Service[] (for BookingWizard) ─
function toBookableServices(services: SheetService[]): Service[] {
  return services
    .filter((s) => s.price !== null && s.price > 0 && s.duration !== null)
    .map((s) => ({
      id: s.slug,
      name: s.name,
      duration: s.duration!,
      price: s.price!,
      description: s.about,
    }));
}

// ── Main fetch function (cached via Cloudflare edge) ────────────────
export async function getSheetData(): Promise<SheetData> {
  try {
    const res = await fetch(SHEET_URL, {
      cf: { cacheTtl: REVALIDATE_SECONDS, cacheEverything: true },
    } as RequestInit);

    if (!res.ok) {
      console.error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
      return fallbackData();
    }

    const rows: SheetRow[] = await res.json();

    if (!rows.length) {
      console.error("Sheet returned empty array");
      return fallbackData();
    }

    const row = rows[0];
    const studioServices = parseServices(row, "studio");
    const natureServices = parseServices(row, "nature");
    const allServices = [...studioServices, ...natureServices];

    return {
      content: {
        siteTitle: row.site_title || "WildWoods Studio",
        heroTitle: row.hero_title || "WildWoods Studio",
        heroSubtitle:
          row.hero_subtitle ||
          "Connecting you to yourself, others, and the Earth.",
        contactPhone: row.contact_phone || fallbackProvider.phone,
        contactEmail: row.contact_email || fallbackProvider.email,
      },
      studioServices,
      natureServices,
      bookableServices: toBookableServices(allServices),
      reviews: fallbackReviews,
      provider: {
        ...fallbackProvider,
        phone: row.contact_phone || fallbackProvider.phone,
        email: row.contact_email || fallbackProvider.email,
      },
    };
  } catch (err) {
    console.error("Failed to fetch sheet data:", err);
    return fallbackData();
  }
}

// ── Fallback using existing mock data ───────────────────────────────
function fallbackData(): SheetData {
  return {
    content: {
      siteTitle: "WildWoods Studio",
      heroTitle: "WildWoods Studio",
      heroSubtitle: "Connecting you to yourself, others, and the Earth.",
      contactPhone: fallbackProvider.phone,
      contactEmail: fallbackProvider.email,
    },
    studioServices: fallbackServices.map((s) => ({
      slug: s.id,
      name: s.name,
      about: s.description,
      detailTitle: s.name,
      detailText: s.description,
      price: s.price,
      duration: s.duration,
      category: "studio" as const,
    })),
    natureServices: [],
    bookableServices: fallbackServices,
    reviews: fallbackReviews,
    provider: fallbackProvider,
  };
}

// ── Lookup a single service by slug ─────────────────────────────────
export async function getServiceBySlug(
  slug: string,
): Promise<SheetService | null> {
  const data = await getSheetData();
  const all = [...data.studioServices, ...data.natureServices];
  return all.find((s) => s.slug === slug) ?? null;
}
