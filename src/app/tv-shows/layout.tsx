import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore TV Shows - Trending Series, Web Shows & Dramas",
  description:
    "Discover trending TV shows, web series, Korean dramas, and binge-worthy series on ViewVerse. Browse by genre, language, year and rating. Stream from Netflix, Prime, Hotstar and more.",
  keywords: [
    "watch TV shows online",
    "trending TV series",
    "web series",
    "Korean drama",
    "Netflix shows",
    "Amazon Prime series",
    "new TV shows 2026",
    "best web series",
    "drama series",
  ],
  alternates: { canonical: "https://viewverse.space/tv-shows" },
  openGraph: {
    title: "Explore TV Shows - Trending Series & Web Shows | ViewVerse",
    description:
      "Browse trending TV shows, web series, Korean dramas and more. Filter by genre, language and year.",
    url: "https://viewverse.space/tv-shows",
  },
};

export default function TVShowsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
