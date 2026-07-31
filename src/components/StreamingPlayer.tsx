"use client";

import { useState } from "react";
import { Server } from "lucide-react";

interface StreamingPlayerProps {
  id: number;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
}

export default function StreamingPlayer({ id, type, season = 1, episode = 1 }: StreamingPlayerProps) {
  // Available streaming sources (placeholder removed, ScreenScape is now Server 1, Peachify is Server 2)
  const servers = [
    {
      id: "server1",
      name: "Server 1 (ScreenScape)",
      getUrl: () =>
        type === "movie"
          ? `https://screenscape.me/embed?tmdb=${id}&type=movie`
          : `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${season}&e=${episode}`,
    },
    {
      id: "server2",
      name: "Server 2 (Peachify)",
      getUrl: () =>
        type === "movie"
          ? `https://peachify.pro/embed/movie/${id}`
          : `https://peachify.pro/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: "server3",
      name: "Server 3 (Nxsha)",
      getUrl: () =>
        type === "movie"
          ? `https://nxsha.space/embed/movie/${id}`
          : `https://nxsha.space/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: "server4",
      name: "Server 4 (VidSrc.me)",
      getUrl: () =>
        type === "movie"
          ? `https://vidsrc.me/embed/movie/${id}`
          : `https://vidsrc.me/embed/tv/${id}/${season}/${episode}`,
    },
  ];

  const [activeServer, setActiveServer] = useState(servers[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Player Screen Area - directly renders active stream */}
      <div className="player-wrapper">
        <iframe
          src={activeServer.getUrl()}
          className="player-iframe"
          allowFullScreen
          scrolling="no"
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      </div>

      {/* Server Selector Bar */}
      <div
        className="glass-panel"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
          padding: "12px 18px",
          borderRadius: "12px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginRight: "10px",
          }}
        >
          <Server size={14} />
          Streaming Servers:
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {servers.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setActiveServer(srv)}
              className={`btn`}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                borderRadius: "8px",
                background: activeServer.id === srv.id ? "var(--accent-cyan)" : "rgba(255,255,255,0.05)",
                color: activeServer.id === srv.id ? "#000000" : "var(--text-primary)",
                border: activeServer.id === srv.id ? "none" : "1px solid var(--glass-border)",
                fontWeight: 700,
              }}
            >
              {srv.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
