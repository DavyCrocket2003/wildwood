"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EditableServiceColumns from "@/components/EditableServiceColumns";
import AboutSidebar from "@/components/AboutSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Mail, Phone } from "lucide-react";

interface Service {
  id: number;
  category: "studio" | "nature";
  title: string;
  description: string;
  price: number;
  duration: number;
  detail_text: string;
  is_active: boolean;
}

interface Content {
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
}

interface HomeData {
  content: Content;
  studioServices: Service[];
  natureServices: Service[];
}

export default function HomeClient() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<HomeData>({
    content: {
      siteTitle: "Wildwoods Studio",
      heroTitle: "Wildwoods Studio",
      heroSubtitle: "Connecting you to yourself, others, and the Earth.",
      contactPhone: "",
      contactEmail: "",
    },
    studioServices: [],
    natureServices: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch services from database
      const servicesResponse = await fetch("/api/services");
      const servicesData = await servicesResponse.json() as { services: Service[] };
      const services = servicesData.services || [];
      
      // Fetch content
      const contentResponse = await fetch("/api/content");
      const contentData = await contentResponse.json() as { [key: string]: string };
      
      setData({
        content: {
          siteTitle: contentData.site_title || "Wildwoods Studio",
          heroTitle: contentData.hero_title || "Wildwoods Studio",
          heroSubtitle: contentData.hero_subtitle || "Connecting you to yourself, others, and the Earth.",
          contactPhone: contentData.contact_phone || "",
          contactEmail: contentData.contact_email || "",
        },
        studioServices: services.filter(s => s.category === "studio" && s.is_active),
        natureServices: services.filter(s => s.category === "nature" && s.is_active),
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar phone={data.content.contactPhone} siteTitle={data.content.siteTitle} />
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
              onUpdate={fetchData}
            />
          </div>

          {/* Main content: service columns */}
          <EditableServiceColumns
            studioServices={data.studioServices}
            natureServices={data.natureServices}
          />

          {/* Desktop: sidebar on the right */}
          <div className="hidden lg:block">
            <AboutSidebar
              phone={data.content.contactPhone}
              email={data.content.contactEmail}
              onUpdate={fetchData}
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
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Wildwoods Studio. All rights
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
