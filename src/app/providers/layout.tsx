import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore OTT Platforms - Netflix, Prime, Hotstar, Crunchyroll & More",
  description:
    "Browse movies and TV shows from all major OTT platforms on ViewVerse. Netflix, Amazon Prime Video, JioHotstar, Apple TV+, Sony LIV, Zee5, Crunchyroll, MUBI, Discovery+ and 20+ streaming services.",
  keywords: [
    "OTT platforms",
    "Netflix India",
    "Amazon Prime Video",
    "JioHotstar",
    "Crunchyroll",
    "Sony LIV",
    "Zee5",
    "streaming platforms India",
    "OTT streaming services",
  ],
  alternates: { canonical: "https://view-verse-chi.vercel.app/providers" },
  openGraph: {
    title: "Explore OTT Platforms - Netflix, Prime, Hotstar & More | ViewVerse",
    description: "Browse movies and shows from Netflix, Prime, Hotstar, Crunchyroll & 20+ OTT platforms.",
    url: "https://view-verse-chi.vercel.app/providers",
  },
};

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
