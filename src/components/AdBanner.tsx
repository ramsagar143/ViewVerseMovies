"use client";

import { Play } from "lucide-react";

export default function AdBanner() {
  const handleAdClick = () => {
    window.open("https://interventioncopiedloitering.com/ucx2qnm2?key=76291fbf1d15cbf95bf6d27764f47697", "_blank");
  };

  return (
    <div className="upcoming-ad-banner" onClick={handleAdClick}>
      <div className="ad-content">
        <span className="ad-badge">UPCOMING</span>
        <div className="ad-title-container">
          <span className="ad-movie-tag">Money Heist 6</span>
          <span className="ad-movie-tag">From Season 4</span>
          <span className="ad-movie-tag">KGF Chapter 3</span>
          <span className="ad-movie-tag">Pushpa 3</span>
        </div>
      </div>
      <button className="ad-btn">
        <Play size={14} fill="currentColor" />
        Watch Now
      </button>
    </div>
  );
}
