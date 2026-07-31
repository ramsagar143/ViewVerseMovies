"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { MovieOrShow, getImageUrl } from "@/lib/tmdb";

interface MovieCardProps {
  item: MovieOrShow;
  type?: "movie" | "tv";
}

export default function MovieCard({ item, type }: MovieCardProps) {
  // Determine if it is a movie or TV show
  const isTv = type === "tv" || item.media_type === "tv" || (!item.title && !!item.name);
  const pathPrefix = isTv ? "tv" : "movie";
  const title = item.title || item.name || "Untitled";
  const date = item.release_date || item.first_air_date;
  const year = date ? new Date(date).getFullYear() : "N/A";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Open Smartlink in new tab
    window.open("https://interventioncopiedloitering.com/ucx2qnm2?key=76291fbf1d15cbf95bf6d27764f47697", "_blank");

    // Smoothly route current tab to content details
    router.push(`/${pathPrefix}/${item.id}`);
  };

  return (
    <Link href={`/${pathPrefix}/${item.id}`} onClick={handleClick}>
      <div className="movie-card">
        <div className="movie-card-img-container">
          {item.poster_path ? (
            <Image
              src={getImageUrl(item.poster_path, "w500")}
              alt={title}
              fill
              unoptimized
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              style={{ objectFit: "cover" }}
              className="movie-card-img"
              loading="lazy"
            />
          ) : (
            <div className="card-fallback">
              <span className="card-fallback-title">{title}</span>
              <span className="card-fallback-subtitle">{year}</span>
            </div>
          )}
        </div>
        <div className="movie-card-info">
          <h3 className="movie-card-title">{title}</h3>
          <div className="movie-card-meta">
            <span>{year}</span>
            {rating !== "N/A" && (
              <span className="rating-badge">
                <Star size={10} fill="currentColor" />
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
