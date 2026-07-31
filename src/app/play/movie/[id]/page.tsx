import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, Film } from "lucide-react";
import { getDetails } from "@/lib/tmdb";
import StreamingPlayer from "@/components/StreamingPlayer";
import MovieCard from "@/components/MovieCard";
import BannerAdRow from "@/components/BannerAdRow";

interface MoviePlayerPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePlayerPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getDetails("movie", id);
  const title = movie.title || movie.original_title || "Untitled";
  return {
    title: `Play ${title} - Stream Online Free`,
    description: `Stream ${title} online in HD for free on ViewVerse. No signup required.`,
    robots: { index: false, follow: true },
  };
}

export default async function MoviePlayerPage({ params }: MoviePlayerPageProps) {
  const { id } = await params;
  const movie = await getDetails("movie", id);

  const title = movie.title || movie.original_title || "Untitled";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";

  const recommendations = movie.recommendations?.results?.slice(0, 12) || [];

  return (
    <div className="player-page-container">
      {/* Back to Details Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <Link href={`/movie/${id}`} className="btn btn-secondary" style={{ padding: "8px 16px" }}>
          <ArrowLeft size={16} />
          <span>Back to Details</span>
        </Link>
      </div>

      {/* Main Streaming Player (Interactive Client Component) */}
      <StreamingPlayer id={movie.id} type="movie" />

      {/* Info Panel */}
      <div className="player-info-container">
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Film size={22} className="text-accent-cyan" style={{ color: "#00f2fe" }} />
          {title}
        </h1>
        <div className="detail-meta-list" style={{ marginBottom: "16px" }}>
          {rating !== "N/A" && (
            <span className="rating-badge">
              <Star size={12} fill="currentColor" />
              {rating}
            </span>
          )}
          <span style={{ color: "var(--text-secondary)" }}>{releaseYear}</span>
          <span className="genre-tag">Movie</span>
        </div>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "14px" }}>
          {movie.overview || "No overview available for this movie."}
        </p>
      </div>

      <BannerAdRow />

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2 className="detail-section-title">More Movie Recommendations</h2>
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
