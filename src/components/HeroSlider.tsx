"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { MovieOrShow, getImageUrl } from "@/lib/tmdb";

interface HeroSliderProps {
  items: MovieOrShow[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-play cycle
  const resetTimer = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    if (!isHovered) {
      autoPlayTimer.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 6000); // Rotate every 6 seconds
    }
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [activeIndex, isHovered, items.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Pointer drag swiping handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const touchEndX = e.clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <section
      className="hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        cursor: "grab",
        userSelect: "none",
        position: "relative",
      }}
    >
      {items.map((item, idx) => {
        const isActive = idx === activeIndex;
        const title = item.title || item.name || "Untitled";
        const date = item.release_date || item.first_air_date;
        const year = date ? new Date(date).getFullYear() : "";
        const rating = item.vote_average ? item.vote_average.toFixed(1) : "";
        const isTv = item.media_type === "tv" || (!item.title && !!item.name);
        const detailPath = `/${isTv ? "tv" : "movie"}/${item.id}`;
        const playPath = isTv ? `/play/tv/${item.id}/1/1` : `/play/movie/${item.id}`;

        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              transition: "opacity 0.8s ease-in-out",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            {item.backdrop_path ? (
              <Image
                src={getImageUrl(item.backdrop_path, "original")}
                alt={title}
                fill
                unoptimized
                priority={idx === 0}
                className="hero-img"
                style={{ objectFit: "cover" }}
                draggable={false}
              />
            ) : (
              <div
                className="hero-img"
                style={{ background: "linear-gradient(135deg, #1b1633, #050409)" }}
              />
            )}
            <div className="hero-overlay" />
            <div
              className="hero-content"
              style={{
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                opacity: isActive ? 1 : 0,
                transition: "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) 0.2s",
              }}
            >
              <h1 className="hero-title">{title}</h1>
              <div className="hero-meta">
                {year && <span>{year}</span>}
                {rating && (
                  <span className="rating-badge">
                    <Star size={12} fill="currentColor" />
                    {rating}
                  </span>
                )}
                <span className="genre-tag" style={{ textTransform: "uppercase" }}>
                  {item.media_type || (isTv ? "tv" : "movie")}
                </span>
              </div>
              <p className="hero-overview">{item.overview || "No description available."}</p>
              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <Link href={playPath} className="btn btn-primary" draggable={false}>
                  <Play size={18} fill="currentColor" />
                  Play Now
                </Link>
                <Link href={detailPath} className="btn btn-secondary" draggable={false}>
                  <Info size={18} />
                  Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Desktop hover) */}
      <button
        className="slider-arrow slider-arrow-left hero-nav-arrow"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        style={{ zIndex: 10, opacity: isHovered ? 1 : 0, display: "flex" }}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="slider-arrow slider-arrow-right hero-nav-arrow"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        style={{ zIndex: 10, opacity: isHovered ? 1 : 0, display: "flex" }}
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(idx);
            }}
            style={{
              width: activeIndex === idx ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              border: "none",
              background: activeIndex === idx ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.3)",
              boxShadow: activeIndex === idx ? "var(--glow-cyan)" : "none",
              cursor: "pointer",
              transition: "var(--transition-smooth)",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
