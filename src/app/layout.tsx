import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";
import TelegramFloatingButton from "@/components/TelegramFloatingButton";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://viewverse.space"),
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
    "viewverse.space",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://viewverse.space",
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
    google: "7HAZMQqSuJV8VtwX2lQ-jql9nD2LpMDLWzci8At3SpI",
  },
  alternates: {
    canonical: "https://viewverse.space",
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
              url: "https://viewverse.space",
              description:
                "Browse and stream trending movies, TV shows, anime and web series online for free.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://viewverse.space/search?q={search_term_string}",
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
        <TelegramFloatingButton />
        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "z4fa523ah3");`}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
