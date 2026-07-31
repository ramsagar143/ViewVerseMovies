import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Movies - Bollywood, Hollywood, Action, Comedy & More",
  description:
    "Browse and discover the largest collection of movies on ViewVerse. Filter by genre, language, year & rating. Find Bollywood, Hollywood, Action, Comedy, Thriller, Sci-Fi, Horror movies and more. Watch online for free.",
  keywords: [
    "browse movies online",
    "Bollywood movies",
    "Hollywood movies",
    "action movies",
    "comedy movies",
    "thriller movies",
    "horror movies",
    "new movies 2026",
    "watch movies free",
  ],
  alternates: { canonical: "https://view-verse-chi.vercel.app/movies" },
  openGraph: {
    title: "Explore Movies - Bollywood, Hollywood & More | ViewVerse",
    description:
      "Browse the largest collection of movies. Filter by genre, language, year and rating.",
    url: "https://view-verse-chi.vercel.app/movies",
  },
};

export default function MoviesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
