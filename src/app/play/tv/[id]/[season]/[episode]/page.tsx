import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDetails, getSeasonDetails } from "@/lib/tmdb";
import TVEpisodePlayerLayout from "@/components/TVEpisodePlayerLayout";
import MovieCard from "@/components/MovieCard";
import BannerAdRow from "@/components/BannerAdRow";

interface TVPlayerPageProps {
  params: Promise<{
    id: string;
    season: string;
    episode: string;
  }>;
}

export async function generateMetadata({ params }: TVPlayerPageProps): Promise<Metadata> {
  const { id, season, episode } = await params;
  const show = await getDetails("tv", Number(id));
  const title = show.name || show.original_name || "Untitled";
  return {
    title: `Watch ${title} S${season}E${episode} - Stream Online Free`,
    description: `Stream ${title} Season ${season} Episode ${episode} online in HD for free on ViewVerse.`,
    robots: { index: false, follow: true },
  };
}

export default async function TVPlayerPage({ params }: TVPlayerPageProps) {
  const { id, season, episode } = await params;
  const tvId = Number(id);
  const seasonNum = Number(season);
  const episodeNum = Number(episode);

  // Fetch show details & season details in parallel
  const [show, seasonData] = await Promise.all([
    getDetails("tv", tvId),
    getSeasonDetails(tvId, seasonNum).catch(() => null),
  ]);

  const showTitle = show.name || show.original_name || "Untitled";
  const seasonList = show.seasons || [];
  const recommendations = show.recommendations?.results?.slice(0, 12) || [];

  return (
    <div className="player-page-container" style={{maxWidth: "1400px"}}>
      {/* Back to Show Page */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <Link href={`/tv/${id}`} className="btn btn-secondary" style={{ padding: "8px 16px" }}>
          <ArrowLeft size={16} />
          <span>Back to Series details</span>
        </Link>
      </div>

      {/* Responsive player & episodes panel layout */}
      <TVEpisodePlayerLayout
        tvId={tvId}
        showTitle={showTitle}
        seasons={seasonList}
        initialSeasonData={seasonData}
        activeSeason={seasonNum}
        activeEpisode={episodeNum}
      />

      <BannerAdRow />

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2 className="detail-section-title">More Series Recommendations</h2>
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
