import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar, Clock, Globe } from "lucide-react";
import { getDetails, getImageUrl } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import ScrollSlider from "@/components/ScrollSlider";
import BannerAdRow from "@/components/BannerAdRow";
import PlayButton from "@/components/PlayButton";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getDetails("movie", id);
  const title = movie.title || movie.original_title || "Untitled";
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";
  const genres = movie.genres?.map((g) => g.name).join(", ") || "";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined;

  return {
    title: `Watch ${title}${year ? ` (${year})` : ""} Online Free`,
    description: movie.overview
      ? `${movie.overview.slice(0, 155)}... Watch ${title} online for free on ViewVerse. ${genres ? `Genres: ${genres}.` : ""}`
      : `Watch ${title} online for free on ViewVerse. Stream now in HD.`,
    keywords: [title, `watch ${title} online`, `${title} full movie`, genres, `${title} ${year}`, "free movie streaming"].filter(Boolean),
    openGraph: {
      title: `${title}${year ? ` (${year})` : ""} - Watch Online Free | ViewVerse`,
      description: movie.overview?.slice(0, 200) || `Watch ${title} online for free.`,
      url: `https://view-verse-chi.vercel.app/movie/${id}`,
      type: "video.movie",
      images: posterUrl ? [{ url: posterUrl, width: 500, height: 750, alt: title }] : [],
    },
    alternates: { canonical: `https://view-verse-chi.vercel.app/movie/${id}` },
  };
}

export const revalidate = 3600; // Cache detailed page for 1 hour

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getDetails("movie", id);

  const title = movie.title || movie.original_title || "Untitled";
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";
  const originalLanguage = movie.languages?.[0]?.toUpperCase() || movie.original_language?.toUpperCase() || "EN";
  const bannerUrl = getImageUrl(movie.backdrop_path, "original");
  const posterUrl = getImageUrl(movie.poster_path, "w500");

  const cast = movie.credits?.cast?.slice(0, 15) || [];
  const recommendations = movie.recommendations?.results?.slice(0, 12) || [];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Blurred Backdrop Banner */}
      <div className="detail-banner">
        {movie.backdrop_path && (
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
          {movie.tagline && <p className="detail-tagline">&ldquo;{movie.tagline}&rdquo;</p>}

          {/* Quick Meta */}
          <div className="detail-meta-list">
            {rating !== "N/A" && (
              <span className="rating-badge">
                <Star size={14} fill="currentColor" />
                {rating} ({movie.vote_count} votes)
              </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <Calendar size={14} />
              {releaseYear}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <Clock size={14} />
              {runtime}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <Globe size={14} />
              {originalLanguage}
            </span>
          </div>

          {/* Genres */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div style={{ marginTop: "12px" }}>
            <h2 className="detail-section-title">Overview</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "15px" }}>
              {movie.overview || "No synopsis available."}
            </p>
          </div>

          {/* Play Button */}
          <div style={{ marginTop: "16px" }}>
            <PlayButton movieId={movie.id} />
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

      {/* More Recommendations */}
      {recommendations.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2 className="detail-section-title">More Like This</h2>
          <div className="content-grid">
            {recommendations.map((item) => (
              <MovieCard key={item.id} item={item} type="movie" />
            ))}
          </div>
        </section>
      )}

      <BannerAdRow />
    </div>
  );
}
