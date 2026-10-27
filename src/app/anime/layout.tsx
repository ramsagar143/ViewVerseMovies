import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Anime - Japanese Animation, Manga Series & More",
  description:
    "Browse the best Japanese anime series on ViewVerse. Discover popular anime like One Piece, Naruto, Dragon Ball, Attack on Titan, Jujutsu Kaisen, Demon Slayer and more. Filter by genre, year and rating.",
  keywords: [
    "watch anime online free",
    "Japanese anime",
    "anime streaming",
    "One Piece",
    "Naruto",
    "Dragon Ball",
    "Attack on Titan",
    "Jujutsu Kaisen",
    "Demon Slayer",
    "anime series",
    "best anime 2026",
    "Crunchyroll anime",
  ],
  alternates: { canonical: "https://viewverse.space/anime" },
  openGraph: {
    title: "Explore Anime - Japanese Animation & Manga Series | ViewVerse",
    description:
      "Discover popular anime series. One Piece, Naruto, Dragon Ball, Attack on Titan and more.",
    url: "https://viewverse.space/anime",
  },
};

export default function AnimeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
