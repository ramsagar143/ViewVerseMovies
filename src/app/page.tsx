import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star } from "lucide-react";
import { getTrending, getAnime, getMovies, getImageUrl, OTT_PROVIDERS } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import ScrollSlider from "@/components/ScrollSlider";
import HeroSlider from "@/components/HeroSlider";
import BannerAdRow from "@/components/BannerAdRow";

export const metadata: Metadata = {
  title: "ViewVerse - Watch Movies, TV Shows & Anime Online Free | Your Passport to Diverse Entertainment",
  description:
    "Discover trending movies, TV shows, anime, and web series on ViewVerse. Stream Bollywood, Hollywood, Korean dramas, Japanese anime from Netflix, Amazon Prime, JioHotstar & 20+ OTT platforms. Updated daily.",
  alternates: { canonical: "https://view-verse-chi.vercel.app" },
};

export const revalidate = 3600; // Revalidate home page data every hour

export default async function Home() {
  // Fetch lists in parallel
  const [
    trendingAll,
    trendingMovies,
    trendingTV,
    animeList,
    actionMovies,
  ] = await Promise.all([
    getTrending("all", "day").catch(() => []),
    getTrending("movie", "week").catch(() => []),
    getTrending("tv", "week").catch(() => []),
    getAnime({ sortBy: "popularity.desc" }).then(res => res.results).catch(() => []),
    getMovies({ genre: "28", sortBy: "popularity.desc" }).then(res => res.results).catch(() => []),
  ]);

  // Select the top 10 items for the Hero Slider
  const heroItems = trendingAll.length >= 10
    ? trendingAll.slice(0, 10)
    : [...trendingAll, ...trendingMovies].slice(0, 10);

  return (
    <div style={{ width: "100%" }}>
      {/* Hero Banner Slider Section */}
      {heroItems.length > 0 && <HeroSlider items={heroItems} />}

      {/* Row: Trending OTT Platforms */}
      <section className="horizontal-scroll-container" style={{ marginTop: "24px" }}>
        <div className="row-header">
          <h2 className="row-title">Explore OTT Platforms</h2>
          <Link href="/providers" style={{ fontSize: "14px", color: "var(--accent-cyan)", fontWeight: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4px" }}>
            View All OTTs →
          </Link>
        </div>
        <ScrollSlider>
          {OTT_PROVIDERS.map((prov) => (
            <Link
              key={prov.id}
              href={`/provider/${prov.id}`}
              className="ott-card"
              style={{
                "--hover-glow": prov.brandColor,
              } as React.CSSProperties}
              draggable={false}
            >
              <img
                src={getImageUrl(prov.logo, "w200")}
                alt={prov.name}
                className="ott-logo-img"
                draggable={false}
              />
              <span className="ott-card-name">{prov.name}</span>
            </Link>
          ))}
        </ScrollSlider>
      </section>
      <BannerAdRow />

      {/* Row 1: Trending Movies */}
      <section className="horizontal-scroll-container">
        <div className="row-header">
          <h2 className="row-title">Trending Movies</h2>
          <Link href="/movies" style={{ fontSize: "14px", color: "var(--accent-cyan)", fontWeight: 600 }}>
            See All
          </Link>
        </div>
        <ScrollSlider>
          {trendingMovies.map((item) => (
            <MovieCard key={item.id} item={item} type="movie" />
          ))}
        </ScrollSlider>
      </section>
      <BannerAdRow />

      {/* Row 2: Trending TV Shows */}
      <section className="horizontal-scroll-container">
        <div className="row-header">
          <h2 className="row-title">Trending TV Shows</h2>
          <Link href="/tv-shows" style={{ fontSize: "14px", color: "var(--accent-cyan)", fontWeight: 600 }}>
            See All
          </Link>
        </div>
        <ScrollSlider>
          {trendingTV.map((item) => (
            <MovieCard key={item.id} item={item} type="tv" />
          ))}
        </ScrollSlider>
      </section>
      <BannerAdRow />

      {/* Row 3: Trending Anime */}
      <section className="horizontal-scroll-container">
        <div className="row-header">
          <h2 className="row-title">Trending Anime</h2>
          <Link href="/anime" style={{ fontSize: "14px", color: "var(--accent-cyan)", fontWeight: 600 }}>
            See All
          </Link>
        </div>
        <ScrollSlider>
          {animeList.map((item) => (
            <MovieCard key={item.id} item={item} type="tv" />
          ))}
        </ScrollSlider>
      </section>
      <BannerAdRow />

      {/* Row 4: Popular Action Movies */}
      <section className="horizontal-scroll-container">
        <div className="row-header">
          <h2 className="row-title">Action Movies</h2>
        </div>
        <ScrollSlider>
          {actionMovies.map((item) => (
            <MovieCard key={item.id} item={item} type="movie" />
          ))}
        </ScrollSlider>
      </section>
      <BannerAdRow />
    </div>
  );
}
