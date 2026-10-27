import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Movies, TV Shows & Anime",
  description:
    "Search from thousands of movies, TV shows, and anime on ViewVerse. Find any movie, series, or anime instantly. Powered by TMDB.",
  alternates: { canonical: "https://viewverse.space/search" },
  openGraph: {
    title: "Search Movies, TV Shows & Anime | ViewVerse",
    description: "Search from thousands of movies, TV shows, and anime instantly.",
    url: "https://viewverse.space/search",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
