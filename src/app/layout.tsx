import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://view-verse-chi.vercel.app"),
  title: {
    default: "ViewVerse - Watch Movies, TV Shows & Anime Online Free",
    template: "%s | ViewVerse",
  },
  description:
    "ViewVerse is your ultimate destination to browse and watch movies, TV shows, anime, and web series online for free. Explore trending Bollywood, Hollywood, Korean dramas, Japanese anime, and content from Netflix, Amazon Prime, JioHotstar & more OTT platforms.",
  keywords: [
    "watch movies online free",
    "free movie streaming",
    "watch TV shows online",
    "anime streaming",
    "Bollywood movies",
    "Hollywood movies",
    "Korean drama",
    "Japanese anime",
    "web series",
    "Netflix movies",
    "Amazon Prime shows",
    "JioHotstar",
    "OTT platforms",
    "trending movies 2026",
    "new movies",
    "watch anime free",
    "free TV shows",
    "movie streaming site",
    "ViewVerse",
    "view-verse-chi.vercel.app",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://view-verse-chi.vercel.app",
    siteName: "ViewVerse",
    title: "ViewVerse - Watch Movies, TV Shows & Anime Online Free",
    description:
      "Browse and stream trending movies, TV shows, anime and web series from Netflix, Prime, Hotstar & 20+ OTT platforms. All in one place.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "ViewVerse Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViewVerse - Watch Movies, TV Shows & Anime Online Free",
    description:
      "Browse and stream trending movies, TV shows, anime and web series. All in one place on ViewVerse.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "a2TFH7POli_BcLon4TsyuagDySR3CYY_bNdWtO8fdX0",
  },
  alternates: {
    canonical: "https://view-verse-chi.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ViewVerse",
              url: "https://view-verse-chi.vercel.app",
              description:
                "Browse and stream trending movies, TV shows, anime and web series online for free.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://view-verse-chi.vercel.app/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            {children}
            <AdBanner />
          </main>
        </div>
        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xe6a2jlp93");`}
        </Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VP830LENEH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-VP830LENEH');`}
        </Script>
        {/* Adsterra Popunder Script */}
        <Script
          src="https://interventioncopiedloitering.com/81/02/1a/81021a81026c7f83ac60e985567058be.js"
          strategy="afterInteractive"
        />
        {/* Adsterra Socialbar Script */}
        <Script
          src="https://interventioncopiedloitering.com/c7/8c/51/c78c514ce0f6be9f06a8ccca81143361.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

