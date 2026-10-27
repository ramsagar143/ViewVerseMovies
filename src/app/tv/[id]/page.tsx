import type { Metadata } from "next";
import Image from "next/image";
import { Star, Calendar, Tv, Globe } from "lucide-react";
import { getDetails, getImageUrl } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import SeasonSelector from "@/components/SeasonSelector";
import ScrollSlider from "@/components/ScrollSlider";
import BannerAdRow from "@/components/BannerAdRow";

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TVPageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getDetails("tv", id);
  const title = show.name || show.original_name || "Untitled";
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : "";
  const genres = show.genres?.map((g) => g.name).join(", ") || "";
  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : undefined;

  return {
    title: `Watch ${title}${year ? ` (${year})` : ""} Online Free`,
    description: show.overview
      ? `${show.overview.slice(0, 155)}... Watch ${title} TV show online for free on ViewVerse. ${genres ? `Genres: ${genres}.` : ""} ${show.number_of_seasons ? `${show.number_of_seasons} Seasons.` : ""}`
      : `Watch ${title} TV show online for free on ViewVerse. Stream all seasons and episodes.`,
    keywords: [title, `watch ${title} online`, `${title} all seasons`, `${title} episodes`, genres, "free TV show streaming"].filter(Boolean),
    openGraph: {
      title: `${title}${year ? ` (${year})` : ""} - Watch Online Free | ViewVerse`,
      description: show.overview?.slice(0, 200) || `Watch ${title} online for free.`,
      url: `https://viewverse.space/tv/${id}`,
      type: "video.tv_show",
      images: posterUrl ? [{ url: posterUrl, width: 500, height: 750, alt: title }] : [],
    },
    alternates: { canonical: `https://viewverse.space/tv/${id}` },
  };
}

export const revalidate = 3600; // Cache detailed page for 1 hour

export default async function TVDetailPage({ params }: TVPageProps) {
  const { id } = await params;
  const show = await getDetails("tv", id);

  const title = show.name || show.original_name || "Untitled";
  const releaseYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : "N/A";
  const rating = show.vote_average ? show.vote_average.toFixed(1) : "N/A";
  const totalSeasons = show.number_of_seasons ? `${show.number_of_seasons} Seasons` : "N/A";
  const originalLanguage = show.languages?.[0]?.toUpperCase() || show.original_language?.toUpperCase() || "EN";
  const bannerUrl = getImageUrl(show.backdrop_path, "original");
  const posterUrl = getImageUrl(show.poster_path, "w500");

  const cast = show.credits?.cast?.slice(0, 15) || [];
  const recommendations = show.recommendations?.results?.slice(0, 12) || [];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Blurred Backdrop Banner */}
      <div className="detail-banner">
        {show.backdrop_path && (
          <Image
            src={bannerUrl}
            alt={title}
            fill
            unoptimized
            priority
            className="detail-banner-img"
          />
        )}
      </div>

      {/* Main Container */}
      <div className="detail-header-wrapper">
        {/* Poster Grid */}
        <div className="detail-poster-container">
          <Image
            src={posterUrl}
            alt={title}
            width={300}
            height={450}
            unoptimized
            priority
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>

        {/* Info Column */}
        <div className="detail-info">
          <h1 className="detail-title">{title}</h1>
          {show.tagline && <p className="detail-tagline">&ldquo;{show.tagline}&rdquo;</p>}

          {/* Quick Meta */}
          <div className="detail-meta-list">
            {rating !== "N/A" && (
              <span className="rating-badge">
                <Star size={14} fill="currentColor" />
                {rating} ({show.vote_count} votes)
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <Calendar size={14} />
              {releaseYear}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <Tv size={14} />
              {totalSeasons}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <Globe size={14} />
              {originalLanguage}
            </span>
          </div>

          {/* Genres */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {show.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div style={{ marginTop: "12px" }}>
            <h2 className="detail-section-title">Overview</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "15px" }}>
              {show.overview || "No synopsis available."}
            </p>
          </div>
        </div>
      </div>

      {/* Cast Carousel Section */}
      {cast.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <h2 className="detail-section-title">Top Billed Cast</h2>
          <ScrollSlider>
            {cast.map((actor) => (
              <div key={actor.id} className="cast-card" style={{ flex: "0 0 100px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div className="cast-img-container">
                  {actor.profile_path ? (
                    <Image
                      src={getImageUrl(actor.profile_path, "w200")}
                      alt={actor.name}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#1b1633" }} />
                  )}
                </div>
                <span className="cast-name">{actor.name}</span>
                <span className="cast-character">{actor.character}</span>
              </div>
            ))}
          </ScrollSlider>
        </section>
      )}

      <BannerAdRow />

      {/* Season & Episode Selector */}
      {show.seasons && show.seasons.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <SeasonSelector tvId={show.id} seasons={show.seasons} />
        </section>
      )}

      {/* More Recommendations */}
      {recommendations.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2 className="detail-section-title">More Like This</h2>
          <div className="content-grid">
            {recommendations.map((item) => (
              <MovieCard key={item.id} item={item} type="tv" />
            ))}
          </div>
        </section>
      )}

      <BannerAdRow />
    </div>
  );
}
