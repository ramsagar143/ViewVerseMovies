"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Tv, List, ChevronRight } from "lucide-react";
import { getSeasonDetails, Episode, getImageUrl, SeasonDetail } from "@/lib/tmdb";
import StreamingPlayer from "@/components/StreamingPlayer";

interface TVEpisodePlayerLayoutProps {
  tvId: number;
  showTitle: string;
  seasons: {
    id: number;
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
  }[];
  initialSeasonData: SeasonDetail | null;
  activeSeason: number;
  activeEpisode: number;
}

export default function TVEpisodePlayerLayout({
  tvId,
  showTitle,
  seasons,
  initialSeasonData,
  activeSeason,
  activeEpisode,
}: TVEpisodePlayerLayoutProps) {
  const router = useRouter();

  // Filter out special episodes (season 0)
  const filteredSeasons = seasons.filter(
    (s) => s.season_number > 0 || seasons.length === 1
  );

  const [selectedSeason, setSelectedSeason] = useState(activeSeason);
  const [episodes, setEpisodes] = useState<Episode[]>(initialSeasonData?.episodes || []);
  const [loading, setLoading] = useState(false);

  // Fetch episodes when user selects a different season in the sidebar dropdown
  useEffect(() => {
    if (selectedSeason === activeSeason) {
      if (initialSeasonData) {
        setEpisodes(initialSeasonData.episodes);
      }
      return;
    }

    async function loadEpisodes() {
      setLoading(true);
      try {
        const details = await getSeasonDetails(tvId, selectedSeason);
        setEpisodes(details.episodes || []);
      } catch (err) {
        console.error("Error loading season details in player sidebar:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEpisodes();
  }, [tvId, selectedSeason, activeSeason, initialSeasonData]);

  // Find info about the current playing episode
  const currentPlayingEpisode =
    selectedSeason === activeSeason
      ? episodes.find((ep) => ep.episode_number === activeEpisode)
      : null;

  const currentEpTitle = currentPlayingEpisode
    ? `S${activeSeason} E${activeEpisode}: ${currentPlayingEpisode.name || "Episode " + activeEpisode}`
    : `Season ${activeSeason}, Episode ${activeEpisode}`;

  const currentEpOverview = currentPlayingEpisode?.overview || "No overview description available for this episode.";

  const handleEpisodeSelect = (episodeNum: number) => {
    // Navigate to the player URL for the selected episode
    router.push(`/play/tv/${tvId}/${selectedSeason}/${episodeNum}`);
  };

  return (
    <div className="player-layout">
      {/* Left side: Video Player & Episode Info */}
      <div className="player-left">
        <StreamingPlayer
          id={tvId}
          type="tv"
          season={activeSeason}
          episode={activeEpisode}
        />

        {/* Current Episode Metadata */}
        <div className="player-info-container" style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "14px", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
            {showTitle}
          </h2>
          <h1 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>
            {currentEpTitle}
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "14px" }}>
            {currentEpOverview}
          </p>
        </div>
      </div>

      {/* Right side: Interactive Episode Switcher Sidebar */}
      <aside className="player-right-sidebar glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
          <List size={18} className="text-accent-cyan" style={{ color: "#00f2fe" }} />
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Episodes Guide</h3>
        </div>

        {/* Season Dropdown Selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
            Select Season
          </label>
          <select
            className="filter-select"
            style={{ width: "100%", padding: "10px 14px" }}
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
          >
            {filteredSeasons.map((s) => (
              <option key={s.id} value={s.season_number}>
                {s.name} ({s.episode_count} Episodes)
              </option>
            ))}
          </select>
        </div>

        {/* Scrollable list of episodes */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <div className="loader" style={{ width: "24px", height: "24px" }} />
            </div>
          ) : episodes.length > 0 ? (
            episodes.map((ep) => {
              const isPlaying = selectedSeason === activeSeason && ep.episode_number === activeEpisode;
              const epThumbUrl = getImageUrl(ep.still_path, "w200");

              return (
                <div
                  key={ep.id}
                  onClick={() => handleEpisodeSelect(ep.episode_number)}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "8px",
                    borderRadius: "8px",
                    background: isPlaying ? "rgba(0, 242, 254, 0.1)" : "rgba(255, 255, 255, 0.02)",
                    border: `1px solid ${isPlaying ? "rgba(0, 242, 254, 0.4)" : "rgba(255,255,255,0.05)"}`,
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                  }}
                  className="sidebar-episode-item"
                >
                  {/* Miniature Episode Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      width: "80px",
                      aspectRatio: "16/9",
                      borderRadius: "4px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {ep.still_path ? (
                      <Image
                        src={epThumbUrl}
                        alt={ep.name}
                        fill
                        unoptimized
                        sizes="80px"
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
                        <Play size={10} style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                  </div>

                  {/* Title & Ep Number */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px", minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isPlaying ? "var(--accent-cyan)" : "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {ep.episode_number}. {ep.name || `Episode ${ep.episode_number}`}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {ep.overview || "No description."}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)", fontSize: "12px" }}>
              No episodes found.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
