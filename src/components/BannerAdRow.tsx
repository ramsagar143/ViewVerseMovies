"use client";

export default function BannerAdRow() {
  return (
    <div className="banner-ad-row-container">
      {/* Ad 1 (Always visible on mobile & desktop) */}
      <div className="banner-ad-box">
        <iframe
          src="/ad320x50.html"
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          style={{ border: "none", overflow: "hidden" }}
        />
      </div>
      
      {/* Ad 2 (Desktop only) */}
      <div className="banner-ad-box desktop-only-ad">
        <iframe
          src="/ad320x50.html"
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          style={{ border: "none", overflow: "hidden" }}
        />
      </div>

      {/* Ad 3 (Desktop only) */}
      <div className="banner-ad-box desktop-only-ad">
        <iframe
          src="/ad320x50.html"
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          style={{ border: "none", overflow: "hidden" }}
        />
      </div>

      {/* Ad 4 (Desktop only) */}
      <div className="banner-ad-box desktop-only-ad">
        <iframe
          src="/ad320x50.html"
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          style={{ border: "none", overflow: "hidden" }}
        />
      </div>
    </div>
  );
}
