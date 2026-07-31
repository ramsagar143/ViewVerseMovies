"use client";

import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { Search as SearchIcon, Star, ArrowLeft } from "lucide-react";
import { getProviderContent, OTT_PROVIDERS, MovieOrShow, getImageUrl } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import BannerAdRow from "@/components/BannerAdRow";

const GENRES = [
  { id: "", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Sci-Fi" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

const RATINGS = [
  { value: "", name: "All Ratings" },
  { value: "8", name: "8+ ★" },
  { value: "7", name: "7+ ★" },
  { value: "6", name: "6+ ★" },
  { value: "5", name: "5+ ★" },
];

interface ProviderPageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const { id: providerIdStr } = React.use(params);
  const providerId = parseInt(providerIdStr, 10);

  // Find provider details
  const provider = OTT_PROVIDERS.find((p) => p.id === providerId);
  const providerName = provider ? provider.name : "OTT Platform";

  const [items, setItems] = useState<MovieOrShow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Filters
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv" | "anime">("all");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Generate years list
  const currentYear = new Date().getFullYear();
  const years = [""];
  for (let y = currentYear; y >= 1980; y--) {
    years.push(String(y));
  }

  // Debounce search query
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  // Fetch initial content when filters or search changes
  useEffect(() => {
    async function loadInitialContent() {
      setLoading(true);
      try {
        const data = await getProviderContent({
          providerId,
          type: mediaType,
          page: 1,
          genre,
          year,
          rating,
          searchQuery: debouncedQuery,
        });
        setItems(data.results);
        setTotalPages(data.totalPages);
        setPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialContent();
  }, [providerId, mediaType, genre, year, rating, debouncedQuery]);

  // Load more next page
  const loadMoreContent = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getProviderContent({
        providerId,
        type: mediaType,
        page: nextPage,
        genre,
        year,
        rating,
        searchQuery: debouncedQuery,
      });
      setItems((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Intersection Observer for Infinite Scroll
  const [loaderRef, setLoaderRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore && !loading) {
          loadMoreContent();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(loaderRef);
    return () => observer.disconnect();
  }, [loaderRef, page, totalPages, loadingMore, loading]);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/providers"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-secondary)",
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "20px",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
      >
        <ArrowLeft size={16} />
        Back to OTT Platforms
      </Link>

      {/* Brand Header Section */}
      <div
        className="glass-panel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "24px",
          borderRadius: "20px",
          marginBottom: "30px",
          borderLeft: `5px solid ${provider?.brandColor || "var(--accent-cyan)"}`,
          boxShadow: `0 4px 20px ${provider?.brandColor ? provider.brandColor.replace("0.6", "0.15") : "rgba(0,0,0,0.3)"}`,
        }}
      >
        {provider && (
          <img
            src={getImageUrl(provider.logo, "w200")}
            alt={providerName}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          />
        )}
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>{providerName} Library</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Explore trending movies and series on {providerName}
          </p>
        </div>
      </div>

      {/* OTT Search Box */}
      <div className="search-input-wrapper" style={{ marginBottom: "20px" }}>
        <SearchIcon className="search-icon-inside" size={24} />
        <input
          type="text"
          className="search-input"
          placeholder={`Search movies or shows inside ${providerName}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>

      {/* Filter Options Bar */}
      <div className="filters-container" style={{ marginBottom: "24px" }}>
        <select
          className="filter-select"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as any)}
        >
          <option value="all">All Categories</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
          <option value="anime">Anime</option>
        </select>

        <select
          className="filter-select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={mediaType === "anime"} // Anime is fixed genre
        >
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">All Years</option>
          {years.filter(Boolean).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Results Grid */}
      {loading ? (
        <div className="loader-container">
          <div className="loader" />
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="content-grid">
            {items.map((item, index) => (
              <Fragment key={item.id}>
                <MovieCard item={item} type={item.media_type || "movie"} />
                {(index + 1) % 15 === 0 && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <BannerAdRow />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          {page < totalPages && (
            <div
              ref={setLoaderRef}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 0",
                gap: "12px",
              }}
            >
              <div className="loader" style={{ width: "24px", height: "24px" }} />
              <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500 }}>
                Loading more contents...
              </span>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-secondary)" }}>
          No content found inside {providerName} matching these criteria. Try adjusting your search!
        </div>
      )}
    </div>
  );
}
