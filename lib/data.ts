// lib/data.ts
import { getDB } from "./db";

// ISR revalidation interval in seconds (15 minutes)
export const REVALIDATE_SECONDS = 900;

// ── Database-based types ───────────────────────────────────────────────
export interface SiteContent {
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  providerSubtitle: string;
}

export interface DatabaseService {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: "studio" | "nature";
  detail_text: string;
  is_active: boolean;
  has_detail_page: boolean;
}

export interface AppData {
  content: SiteContent;
  studioServices: DatabaseService[];
  natureServices: DatabaseService[];
  bookableServices: { id: string; name: string; duration: number; price: number; description: string }[];
  reviews: unknown[];
  provider: { name: string; title: string; phone: string; email: string; image: string; timezone: string };
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

// ── Convert DatabaseService → bookable Service[] (for BookingWizard) ─
function toBookableServices(services: DatabaseService[]): { id: string; name: string; duration: number; price: number; description: string }[] {
  return services
    .filter((s) => s.is_active && s.price > 0 && s.duration > 0)
    .map((s) => ({
      id: s.id.toString(),
      name: s.title,
      duration: s.duration,
      price: s.price,
      description: s.description,
    }));
}

// ── Main data fetch function (database only) ────────────────────────
export async function getAppData(): Promise<AppData> {
  try {
    const db = getDB();

    if (!db) {
      throw new Error("D1 database binding 'DB' not found. Check wrangler.toml + dashboard.");
    }

    // Get content from database
    const contentResult = await db.prepare(
      "SELECT key, value FROM content"
    ).bind().all();
    
    // Get services from database
    const servicesResult = await db.prepare(
      "SELECT id, category, title, description, price, duration, detail_text, is_active, has_detail_page FROM services ORDER BY category, title"
    ).bind().all();
    
    // Process content data - start with empty values
    const contentData: SiteContent = {
      siteTitle: "",
      heroTitle: "", 
      heroSubtitle: "",
      contactPhone: "",
      contactEmail: "",
      providerSubtitle: "",
    };
    
    if (contentResult.results && contentResult.results.length > 0) {
      contentResult.results.forEach((row: any) => {
        const camelKey = row.key.replace(/_([a-z])/g, (match: string, letter: string) => 
          letter.toUpperCase()
        );
        (contentData as any)[camelKey] = row.value;
      });
    }
    
    // Process services data
    const dbServices: DatabaseService[] = [];
    if (servicesResult.results && servicesResult.results.length > 0) {
      servicesResult.results.forEach((row: any) => {
        dbServices.push({
          id: Number(row.id),
          title: row.title,
          description: row.description || "",
          price: Number(row.price),
          duration: Number(row.duration),
          category: row.category,
          detail_text: row.detail_text || "",
          is_active: Boolean(row.is_active),
          has_detail_page: Boolean(row.has_detail_page ?? true),
        });
      });
    }
    
    // Separate by category
    const studioServices = dbServices.filter(s => s.category === "studio");
    const natureServices = dbServices.filter(s => s.category === "nature");
    
    return {
      content: contentData,
      studioServices,
      natureServices,
      bookableServices: toBookableServices(dbServices),
      reviews: [],
      provider: {
        name: "",
        title: contentData.providerSubtitle,
        phone: contentData.contactPhone,
        email: contentData.contactEmail,
        image: "",
        timezone: "America/Denver",
      },
    };
  } catch (err) {
    console.error("Failed to fetch data from database:", err);
    throw err;
  }
}

// ── Lookup a single service by slug/id ─────────────────────────────────
export async function getServiceBySlug(
  slug: string,
): Promise<DatabaseService | null> {
  try {
    const db = getDB();

    if (!db) {
      throw new Error("D1 database binding 'DB' not found.");
    }

    const result = await db.prepare(
      "SELECT id, category, title, description, price, duration, detail_text, is_active, has_detail_page FROM services WHERE id = ?"
    ).bind(Number(slug)).first();
    
    if (result) {
      const row = result as Record<string, unknown>;
      return {
        id: Number(row.id),
        title: row.title as string,
        description: (row.description as string) || "",
        price: Number(row.price),
        duration: Number(row.duration),
        category: row.category as "studio" | "nature",
        detail_text: (row.detail_text as string) || "",
        is_active: Boolean(row.is_active),
        has_detail_page: Boolean(row.has_detail_page ?? true),
      };
    }
    
    return null;
  } catch (err) {
    console.error("Failed to fetch service from database:", err);
    throw err;
  }
}