"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EditableServiceColumns from "@/components/EditableServiceColumns";
import AboutSidebar from "@/components/AboutSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Mail, Phone } from "lucide-react";
import { DatabaseService } from "@/lib/data";

interface Content {
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
}

interface HomeData {
  content: Content;
  studioServices: DatabaseService[];
  natureServices: DatabaseService[];
}

export default function HomeClient() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<HomeData>({
    content: {
      siteTitle: "",
      heroTitle: "",
      heroSubtitle: "",
      contactPhone: "",
      contactEmail: "",
    },
    studioServices: [],
    natureServices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      console.log("🚀 Starting fetchData...");

      // Services
      const servicesResponse = await fetch("/api/services");
      console.log("📡 /api/services status:", servicesResponse.status);
      if (!servicesResponse.ok) throw new Error(`Services failed: ${servicesResponse.status}`);
      const servicesData = await servicesResponse.json() as { services: DatabaseService[] };
      const services = servicesData.services || [];

      // Content - fetch each content key individually
      const [siteTitleResponse, heroTitleResponse, heroSubtitleResponse, contactPhoneResponse, contactEmailResponse] = await Promise.all([
        fetch("/api/content/site_title"),
        fetch("/api/content/hero_title"), 
        fetch("/api/content/hero_subtitle"),
        fetch("/api/content/contact_phone"),
        fetch("/api/content/contact_email")
      ]);

      // Check if any content requests failed
      const contentResponses = [siteTitleResponse, heroTitleResponse, heroSubtitleResponse, contactPhoneResponse, contactEmailResponse];
      const contentKeys = ['site_title', 'hero_title', 'hero_subtitle', 'contact_phone', 'contact_email'];
      
      for (let i = 0; i < contentResponses.length; i++) {
        if (!contentResponses[i].ok) {
          throw new Error(`Content ${contentKeys[i]} failed: ${contentResponses[i].status}`);
        }
      }

      const [siteTitleData, heroTitleData, heroSubtitleData, contactPhoneData, contactEmailData] = await Promise.all([
        siteTitleResponse.json() as Promise<{ value: string }>,
        heroTitleResponse.json() as Promise<{ value: string }>,
        heroSubtitleResponse.json() as Promise<{ value: string }>,
        contactPhoneResponse.json() as Promise<{ value: string }>,
        contactEmailResponse.json() as Promise<{ value: string }>
      ]);

      setData({
        content: {
          siteTitle: siteTitleData.value || "",
          heroTitle: heroTitleData.value || "",
          heroSubtitle: heroSubtitleData.value || "",
          contactPhone: contactPhoneData.value || "",
          contactEmail: contactEmailData.value || "",
        },
        studioServices: services.filter(s => s.category === "studio" && s.is_active),
        natureServices: services.filter(s => s.category === "nature" && s.is_active),
      });
    } catch (err: any) {
      console.error("❌ fetchData failed:", err);
      setError(err.message || "Unknown error loading data");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-center px-4">
        <div>
          <p className="text-xl font-bold mb-2">⚠️ Error loading page</p>
          <p>{error}</p>
          <p className="text-sm mt-4 text-muted">Check browser console for details</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // ←←← Your original return JSX stays exactly the same from here down
  return (
    <>
      <Navbar phone={data.content.contactPhone} siteTitle={data.content.siteTitle} />
      <Hero title={data.content.heroTitle} subtitle={data.content.heroSubtitle} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-10 lg:flex-row">
          <div className="lg:hidden">
            <AboutSidebar phone={data.content.contactPhone} email={data.content.contactEmail} onUpdate={fetchData} />
          </div>
          <EditableServiceColumns studioServices={data.studioServices} natureServices={data.natureServices} />
          <div className="hidden lg:block">
            <AboutSidebar phone={data.content.contactPhone} email={data.content.contactEmail} onUpdate={fetchData} />
          </div>
        </div>
      </div>

      <footer className="relative border-t border-border py-10 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/flowers-forest.jpg')" }} />
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted">&copy; {new Date().getFullYear()}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
            {data.content.contactPhone && (
              <a href={`tel:${data.content.contactPhone}`} className="inline-flex items-center gap-1.5 no-underline transition-colors hover:text-foreground">
                <Phone className="h-3.5 w-3.5" /> {data.content.contactPhone}
              </a>
            )}
            {data.content.contactEmail && (
              <a href={`mailto:${data.content.contactEmail}`} className="inline-flex items-center gap-1.5 no-underline transition-colors hover:text-foreground">
                <Mail className="h-3.5 w-3.5" /> {data.content.contactEmail}
              </a>
            )}
          </div>
        </div>
      </footer>
    </>
  );
} 