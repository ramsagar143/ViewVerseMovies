"use client";

import React, { useState, useEffect, useCallback, Suspense, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { searchMulti, searchMovies, searchTV, searchAnime, MovieOrShow } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import BannerAdRow from "@/components/BannerAdRow";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialType = (searchParams.get("type") as "all" | "movie" | "tv" | "anime") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<"all" | "movie" | "tv" | "anime">(initialType);
  const [results, setResults] = useState<MovieOrShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sync state if search params change (e.g. from redirect)
  useEffect(() => {
    const q = searchParams.get("q");
    const t = searchParams.get("type") as "all" | "movie" | "tv" | "anime";
    if (q !== null) setQuery(q);
    if (t !== null && ["all", "movie", "tv", "anime"].includes(t)) {
      setSearchType(t);
    }
  }, [searchParams]);

  // Search logic
  const performSearch = useCallback(async (searchQuery: string, type: "all" | "movie" | "tv" | "anime", pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalPages(1);
      return;
    }

    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let data;
      if (type === "movie") {
        data = await searchMovies(searchQuery, pageNum);
      } else if (type === "tv") {
        data = await searchTV(searchQuery, pageNum);
      } else if (type === "anime") {
        data = await searchAnime(searchQuery, pageNum);
      } else {
        // "all"
        const rawData = await searchMulti(searchQuery, pageNum);
        const filtered = rawData.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
        data = { results: filtered, totalPages: rawData.totalPages };
      }

      if (pageNum === 1) {
        setResults(data.results);
      } else {
        setResults((prev) => [...prev, ...data.results]);
      }
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced effect for live typing search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      performSearch(query, searchType, 1);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, searchType, performSearch]);

  const loadMoreResults = async () => {
    if (page >= totalPages || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await performSearch(query, searchType, nextPage);
  };

  const [loaderRef, setLoaderRef] = useState<HTMLDivElement | null>(null);

  // Set up IntersectionObserver for Infinite Scrolling
  useEffect(() => {
    if (!loaderRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore && !loading) {
          loadMoreResults();
        }
      },
      { rootMargin: "300px" } // Pre-load 300px before hitting bottom
    );

    observer.observe(loaderRef);
    return () => {
      observer.disconnect();
    };
  }, [loaderRef, page, totalPages, loadingMore, loading, query, searchType]);

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Instant Search</h1>
        <p style={{ color: "var(--text-secondary)" }}>Search from thousands of movies, TV shows, and anime</p>
      </div>

      {/* Search Input Box */}
      <div className="search-input-wrapper" style={{ marginBottom: "20px" }}>
        <SearchIcon className="search-icon-inside" size={24} />
        <input
          type="text"
          className="search-input"
          placeholder="Type movie, show, or anime name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
          autoFocus
        />
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
        {(["all", "movie", "tv", "anime"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            className="btn"
            style={{
              padding: "6px 16px",
              fontSize: "13px",
              borderRadius: "20px",
              background: searchType === type ? "var(--accent-cyan)" : "rgba(255,255,255,0.05)",
              color: searchType === type ? "#000000" : "var(--text-secondary)",
              fontWeight: 700,
              textTransform: "capitalize",
              border: searchType === type ? "none" : "1px solid var(--glass-border)",
            }}
          >
            {type === "all" ? "All Results" : type === "movie" ? "Movies" : type === "tv" ? "TV Shows" : "Anime"}
          </button>
        ))}
      </div>

      {/* Search Output Grid */}
      {loading ? (
        <div className="loader-container">
          <div className="loader" />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="content-grid">
            {results.map((item, index) => (
              <Fragment key={item.id}>
                <MovieCard key={item.id} item={item} type={item.media_type || "movie"} />
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
                Loading more results...
              </span>
            </div>
          )}
        </>
      ) : (
        query.trim() && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-secondary)" }}>
            No results found matching "{query}". Try adjusting your search keywords!
          </div>
        )
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loader-container"><div className="loader" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
