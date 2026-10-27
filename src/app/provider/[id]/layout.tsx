import type { Metadata } from "next";
import { OTT_PROVIDERS } from "@/lib/tmdb";

interface ProviderLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const provider = OTT_PROVIDERS.find((p) => p.id === Number(id));
  const name = provider?.name || "OTT Platform";

  return {
    title: `${name} - Browse Movies & TV Shows on ${name}`,
    description: `Browse and discover movies, TV shows, and anime available on ${name}. Filter by genre, year, and rating. Stream content from ${name} on ViewVerse.`,
    keywords: [name, `${name} movies`, `${name} TV shows`, `${name} streaming`, "OTT platform"],
    alternates: { canonical: `https://viewversetv.netlify.app/provider/${id}` },
    openGraph: {
      title: `${name} - Movies & TV Shows | ViewVerse`,
      description: `Discover movies, TV shows, and anime on ${name}. Stream now on ViewVerse.`,
      url: `https://viewversetv.netlify.app/provider/${id}`,
    },
  };
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  return <>{children}</>;
}
