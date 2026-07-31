"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { getTVShows, MovieOrShow } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import BannerAdRow from "@/components/BannerAdRow";

const GENRES = [
  { id: "", name: "All Genres" },
  { id: "10759", name: "Action & Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "10762", name: "Kids" },
  { id: "9648", name: "Mystery" },
  { id: "10763", name: "News" },
  { id: "10764", name: "Reality" },
  { id: "10765", name: "Sci-Fi & Fantasy" },
  { id: "10766", name: "Soap" },
  { id: "10767", name: "Talk" },
  { id: "10768", name: "War & Politics" },
  { id: "37", name: "Western" },
];

const LANGUAGES = [
  { code: "", name: "All Languages" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "es", name: "Spanish" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "it", name: "Italian" },
];

const RATINGS = [
  { value: "", name: "All Ratings" },
  { value: "8", name: "8+ ★" },
  { value: "7", name: "7+ ★" },
  { value: "6", name: "6+ ★" },
  { value: "5", name: "5+ ★" },
];

export default function TVShowsPage() {
  const [shows, setShows] = useState<MovieOrShow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
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

  // Fetch when filters change
  useEffect(() => {
    async function loadInitialShows() {
      setLoading(true);
      try {
        const data = await getTVShows({
          genre,
          language,
          year,
          rating,
          page: 1,
        });
        setShows(data.results);
        setTotalPages(data.totalPages);
        setPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialShows();
  }, [genre, language, year, rating]);

  // Fetch next page
  const loadMoreShows = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getTVShows({
        genre,
        language,
        year,
        rating,
        page: nextPage,
      });
      setShows((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const [loaderRef, setLoaderRef] = useState<HTMLDivElement | null>(null);

  // Set up IntersectionObserver for Infinite Scrolling
  useEffect(() => {
    if (!loaderRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore && !loading) {
          loadMoreShows();
        }
      },
      { rootMargin: "300px" } // Pre-load 300px before hitting bottom
    );

    observer.observe(loaderRef);
    return () => {
      observer.disconnect();
    };
  }, [loaderRef, page, totalPages, loadingMore, loading]);

  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (searchVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchVal)}&type=tv`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Explore TV Shows</h1>
        <p style={{ color: "var(--text-secondary)" }}>Browse the latest and trending television shows</p>
      </div>

      {/* TV Search Box */}
      <form onSubmit={handleSearchSubmit} className="search-input-wrapper" style={{ marginBottom: "20px" }}>
        <SearchIcon className="search-icon-inside" size={24} />
        <input
          type="text"
          className="search-input"
          placeholder="Search TV shows..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </form>

      {/* Filter Bar */}
      <div className="filters-container">
        <select
          className="filter-select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
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

      {/* Grid Library */}
      {loading ? (
        <div className="loader-container">
          <div className="loader" />
        </div>
      ) : shows.length > 0 ? (
        <>
          <div className="content-grid">
            {shows.map((item, index) => (
              <Fragment key={item.id}>
                <MovieCard item={item} type="tv" />
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
                Loading more shows...
              </span>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-secondary)" }}>
          No TV shows found matching these filters. Try adjusting your search!
        </div>
      )}
    </div>
  );
}
