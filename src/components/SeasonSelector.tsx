"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { getSeasonDetails, Episode, getImageUrl } from "@/lib/tmdb";
import ScrollSlider from "@/components/ScrollSlider";

interface SeasonSelectorProps {
  tvId: number;
  seasons: {
    id: number;
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
  }[];
}

export default function SeasonSelector({ tvId, seasons }: SeasonSelectorProps) {
  const router = useRouter();

  // Filter out specials (season_number: 0) unless it is the only season
  const filteredSeasons = seasons.filter(
    (s) => s.season_number > 0 || seasons.length === 1
  );

  const [activeSeason, setActiveSeason] = useState(
    filteredSeasons[0]?.season_number || 1
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEpisodes() {
      setLoading(true);
      try {
        const details = await getSeasonDetails(tvId, activeSeason);
        setEpisodes(details.episodes || []);
      } catch (err) {
        console.error("Error loading season episodes:", err);
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    }
    loadEpisodes();
  }, [tvId, activeSeason]);

  return (
    <div className="season-selector-wrapper">
      <h2 className="detail-section-title">Seasons &amp; Episodes</h2>

      {/* Season Tab Selectors */}
      <ScrollSlider>
        {filteredSeasons.map((season) => (
          <button
            key={season.id}
            className={`season-tab ${activeSeason === season.season_number ? "active" : ""}`}
            onClick={() => setActiveSeason(season.season_number)}
          >
            {season.name} ({season.episode_count} Ep)
          </button>
        ))}
      </ScrollSlider>

      {/* Episode Listings */}
      {loading ? (
        <div style={{ padding: "40px 0", display: "flex", justifyContent: "center" }}>
          <div className="loader" style={{ width: "30px", height: "30px" }} />
        </div>
      ) : episodes.length > 0 ? (
        <div className="episode-list">
          {episodes.map((episode) => {
            const thumbUrl = getImageUrl(episode.still_path, "w300");
            const episodePath = `/play/tv/${tvId}/${activeSeason}/${episode.episode_number}`;

            return (
              <a
                href={episodePath}
                key={episode.id}
                onClick={(e) => {
                  e.preventDefault();
                  window.open("https://interventioncopiedloitering.com/ucx2qnm2?key=76291fbf1d15cbf95bf6d27764f47697", "_blank");
                  router.push(episodePath);
                }}
              >
                <div className="episode-card">
                  <div className="episode-thumb-container">
                    {episode.still_path ? (
                      <Image
                        src={thumbUrl}
                        alt={episode.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 120px, 180px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(135deg, #1b1633, #0d0a1b)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Play size={18} className="text-secondary" />
                      </div>
                    )}
                  </div>
                  <div className="episode-card-content">
                    <h3 className="episode-title">
                      Ep {episode.episode_number}: {episode.name || `Episode ${episode.episode_number}`}
                    </h3>
                    <p className="episode-overview">
                      {episode.overview || "No description available for this episode."}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "20px 0", color: "var(--text-secondary)", textAlign: "center" }}>
          No episodes found for this season.
        </div>
      )}
    </div>
  );
}
