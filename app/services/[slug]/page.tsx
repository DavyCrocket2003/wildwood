import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ServiceDetail from "@/components/ServiceDetail";
import { getAppData, getServiceBySlug } from "@/lib/data";

export const runtime = 'edge';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  
  // Get service from database
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const data = await getAppData();

  return (
    <>
      <Navbar phone={data.content.contactPhone} />
      <ServiceDetail service={service} />
    </>
  );
}
