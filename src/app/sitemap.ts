import type { MetadataRoute } from "next";
import { getTrending, getAnime, OTT_PROVIDERS } from "@/lib/tmdb";

const BASE_URL = "https://viewversetv.netlify.app";

export const revalidate = 3600; // Regenerate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tv-shows`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/anime`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/providers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // OTT Provider pages
  const providerPages: MetadataRoute.Sitemap = OTT_PROVIDERS.map((provider) => ({
    url: `${BASE_URL}/provider/${provider.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Fetch trending content for dynamic URLs
  let trendingMoviePages: MetadataRoute.Sitemap = [];
  let trendingTVPages: MetadataRoute.Sitemap = [];
  let trendingAnimePages: MetadataRoute.Sitemap = [];

  try {
    const [trendingMovies, trendingTV, trendingAnime] = await Promise.all([
      getTrending("movie", "week"),
      getTrending("tv", "week"),
      getAnime(),
    ]);

    trendingMoviePages = trendingMovies.slice(0, 20).map((movie) => ({
      url: `${BASE_URL}/movie/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    trendingTVPages = trendingTV.slice(0, 20).map((show) => ({
      url: `${BASE_URL}/tv/${show.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    trendingAnimePages = trendingAnime.results.slice(0, 20).map((anime) => ({
      url: `${BASE_URL}/tv/${anime.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching trending content for sitemap:", error);
  }

  // Deduplicate TV and anime URLs (anime are also TV type)
  const allTVUrls = new Map<string, MetadataRoute.Sitemap[number]>();
  [...trendingTVPages, ...trendingAnimePages].forEach((entry) => {
    if (!allTVUrls.has(entry.url)) {
      allTVUrls.set(entry.url, entry);
    }
  });

  return [
    ...staticPages,
    ...providerPages,
    ...trendingMoviePages,
    ...Array.from(allTVUrls.values()),
  ];
}
