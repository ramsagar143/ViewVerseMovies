"use client";

import Link from "next/link";
import { OTT_PROVIDERS, getImageUrl } from "@/lib/tmdb";

export default function ProvidersPage() {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Explore OTT Platforms</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Browse movies, TV shows, and anime across your favorite streaming services
        </p>
      </div>

      <div className="providers-grid">
        {OTT_PROVIDERS.map((prov) => (
          <Link
            key={prov.id}
            href={`/provider/${prov.id}`}
            className="ott-card"
            style={{
              width: "100%",
              height: "140px",
              "--hover-glow": prov.brandColor,
            } as React.CSSProperties}
          >
            <img
              src={getImageUrl(prov.logo, "w200")}
              alt={prov.name}
              className="ott-logo-img"
              style={{ width: "64px", height: "64px" }}
            />
            <span className="ott-card-name" style={{ fontSize: "14px" }}>
              {prov.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
