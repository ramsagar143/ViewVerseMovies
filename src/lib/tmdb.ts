const TMDB_READ_TOKEN = process.env.TMDB_READ_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OTE0YTcxMzA0ZjYzOTQwN2MwM2Y4M2Q1NDM0ZTRkZiIsIm5iZiI6MTc4MTQyMzM2MC45MzUwMDAyLCJzdWIiOiI2YTJlNWQwMDdiNGIzZGE5MjkyYzdkOGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.tUeErUxVysPcVgmlxo63zkcKpJggQRmD-kUY3HqvY6k";
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_CACHE_TTL_SECONDS = 60 * 60 * 6;
const BROWSER_CACHE_TTL_MS = 1000 * 60 * 10;

const tmdbCache = ((globalThis as typeof globalThis & {
  __viewVerseTmdbCache?: Map<string, { expiresAt: number; value: unknown }>
}).__viewVerseTmdbCache ??= new Map<string, { expiresAt: number; value: unknown }>());

const inflightRequests = new Map<string, Promise<unknown>>();

function getCacheKey(endpoint: string, params: Record<string, string | number | boolean>) {
  const query = new URLSearchParams();

  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([key, value]) => {
      query.append(key, String(value));
    });

  const queryString = query.toString();
  return `${endpoint}${queryString ? `?${queryString}` : ""}`;
}

function readBrowserCache<T>(key: string): T | null {
  if (typeof window === "undefined" || !window.localStorage) return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { expiresAt: number; value: T };
    if (!parsed || typeof parsed.expiresAt !== "number") return null;

    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch {
    return null;
  }
}

function writeBrowserCache<T>(key: string, value: T) {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    window.localStorage.setItem(key, JSON.stringify({
      expiresAt: Date.now() + BROWSER_CACHE_TTL_MS,
      value,
    }));
  } catch {
    // localStorage quota or privacy mode can reject; ignore silently.
  }
}

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface MovieOrShow {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface DetailResponse extends MovieOrShow {
  genres: { id: number; name: string }[];
  tagline?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: {
    id: number;
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
  }[];
  status: string;
  languages: string[];
  credits?: {
    cast: CastMember[];
  };
  recommendations?: {
    results: MovieOrShow[];
  };
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

export interface SeasonDetail {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  poster_path: string | null;
  episodes: Episode[];
}

export async function fetchFromTMDB(endpoint: string, params: Record<string, string | number | boolean> = {}) {
  const cacheKey = getCacheKey(endpoint, params);

  if (typeof window !== "undefined") {
    const cached = readBrowserCache<unknown>(cacheKey);
    if (cached !== null) return cached;

    const inFlight = inflightRequests.get(cacheKey);
    if (inFlight) return await inFlight as never;

    const request = (async () => {
      const url = new URL("/api/tmdb", window.location.origin);
      url.searchParams.append("endpoint", endpoint);
      url.searchParams.append("params", JSON.stringify(params));

      const response = await fetch(url.toString(), { method: "GET" });
      if (!response.ok) {
        throw new Error(`API proxy fetch failed for endpoint ${endpoint}: ${response.statusText}`);
      }

      const data = await response.json();
      writeBrowserCache(cacheKey, data);
      return data;
    })();

    inflightRequests.set(cacheKey, request as Promise<unknown>);
    try {
      return await request;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  }

  const cachedServerValue = tmdbCache.get(cacheKey);
  if (cachedServerValue && Date.now() < cachedServerValue.expiresAt) {
    return cachedServerValue.value as never;
  }

  const inFlightServerRequest = inflightRequests.get(cacheKey);
  if (inFlightServerRequest) return await inFlightServerRequest as never;

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.append(key, String(val));
    }
  });

  const request = (async () => {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_READ_TOKEN}`,
      },
      next: { revalidate: TMDB_CACHE_TTL_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`TMDB fetch failed for endpoint ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    tmdbCache.set(cacheKey, {
      expiresAt: Date.now() + (TMDB_CACHE_TTL_SECONDS * 1000),
      value: data,
    });

    return data;
  })();

  inflightRequests.set(cacheKey, request as Promise<unknown>);
  try {
    return await request;
  } finally {
    inflightRequests.delete(cacheKey);
  }
}

export async function getTrending(type: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "day") {
  const data = await fetchFromTMDB(`/trending/${type}/${timeWindow}`);
  return data.results as MovieOrShow[];
}

export async function getMovies(filters: {
  genre?: string;
  year?: string;
  rating?: string;
  language?: string;
  page?: number;
  sortBy?: string;
} = {}) {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    include_adult: false,
    include_video: false,
    sort_by: filters.sortBy || "popularity.desc",
  };

  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.primary_release_year = filters.year;
  if (filters.rating) params["vote_average.gte"] = filters.rating;
  if (filters.language) params.with_original_language = filters.language;

  const data = await fetchFromTMDB("/discover/movie", params);
  return {
    results: data.results as MovieOrShow[],
    totalPages: data.total_pages as number,
    totalResults: data.total_results as number,
  };
}

export async function getTVShows(filters: {
  genre?: string;
  year?: string;
  rating?: string;
  language?: string;
  page?: number;
  sortBy?: string;
} = {}) {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    include_adult: false,
    sort_by: filters.sortBy || "popularity.desc",
  };

  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.first_air_date_year = filters.year;
  if (filters.rating) params["vote_average.gte"] = filters.rating;
  if (filters.language) params.with_original_language = filters.language;

  const data = await fetchFromTMDB("/discover/tv", params);
  return {
    results: data.results as MovieOrShow[],
    totalPages: data.total_pages as number,
    totalResults: data.total_results as number,
  };
}

export async function getAnime(filters: {
  genre?: string; // Additional genre inside anime
  year?: string;
  rating?: string;
  page?: number;
  sortBy?: string;
} = {}) {
  const params: Record<string, string | number | boolean> = {
    page: filters.page || 1,
    include_adult: false,
    with_genres: filters.genre ? `16,${filters.genre}` : "16", // 16 is Animation
    with_original_language: "ja", // Japanese language is the hallmark of Anime in TMDB
    sort_by: filters.sortBy || "popularity.desc",
  };

  if (filters.year) params.first_air_date_year = filters.year;
  if (filters.rating) params["vote_average.gte"] = filters.rating;

  const data = await fetchFromTMDB("/discover/tv", params);
  return {
    results: data.results as MovieOrShow[],
    totalPages: data.total_pages as number,
    totalResults: data.total_results as number,
  };
}

export async function getDetails(type: "movie" | "tv", id: string | number) {
  const data = await fetchFromTMDB(`/${type}/${id}`, {
    append_to_response: "credits,recommendations,videos",
  });
  return data as DetailResponse;
}

export async function getSeasonDetails(tvId: string | number, seasonNumber: number) {
  const data = await fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
  return data as SeasonDetail;
}

export async function searchMulti(query: string, page: number = 1) {
  const data = await fetchFromTMDB("/search/multi", {
    query,
    page,
    include_adult: false,
  });
  return {
    results: data.results as MovieOrShow[],
    totalPages: data.total_pages as number,
    totalResults: data.total_results as number,
  };
}

export async function getGenres(type: "movie" | "tv") {
  const data = await fetchFromTMDB(`/genre/${type}/list`);
  return data.genres as { id: number; name: string }[];
}

export function getImageUrl(path: string | null, size: "w200" | "w300" | "w500" | "w1280" | "original" = "w500"): string {
  if (!path) return "/placeholder-poster.png"; // Fallback placeholder
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export interface OTTProvider {
  id: number;
  name: string;
  logo: string;
  brandColor: string;
}

export const OTT_PROVIDERS: OTTProvider[] = [
  // Tier 1 – Most popular
  { id: 8, name: "Netflix", logo: "/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg", brandColor: "rgba(229, 9, 20, 0.6)" },
  { id: 119, name: "Amazon Prime", logo: "/pvske1MyAoymrs5bguRfVqYiM9a.jpg", brandColor: "rgba(0, 168, 225, 0.6)" },
  { id: 2336, name: "JioHotstar", logo: "/kVqjgpcwvDJOhCupjcLzwwtOp52.jpg", brandColor: "rgba(0, 92, 191, 0.6)" },
  { id: 350, name: "Apple TV+", logo: "/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg", brandColor: "rgba(255, 255, 255, 0.45)" },
  { id: 237, name: "Sony LIV", logo: "/3973zlBbBXdXxaWqRWzGG2GYxbT.jpg", brandColor: "rgba(206, 172, 90, 0.6)" },
  { id: 232, name: "Zee5", logo: "/gP67NRy1ShUJilrzMsbOmEmdmcv.jpg", brandColor: "rgba(130, 29, 142, 0.6)" },
  { id: 283, name: "Crunchyroll", logo: "/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg", brandColor: "rgba(244, 117, 33, 0.6)" },
  { id: 510, name: "Discovery+", logo: "/eMTnWwNVtThkjvQA6zwxaoJG9NE.jpg", brandColor: "rgba(5, 163, 244, 0.6)" },
  // Tier 2 – Popular Indian + Intl
  { id: 11, name: "MUBI", logo: "/x570VpH2C9EKDf1riP83rYc5dnL.jpg", brandColor: "rgba(0, 0, 0, 0.6)" },
  { id: 192, name: "YouTube", logo: "/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg", brandColor: "rgba(255, 0, 0, 0.5)" },
  { id: 309, name: "Sun NXT", logo: "/6KEQzITx2RrCAQt5Nw9WrL1OI8z.jpg", brandColor: "rgba(255, 174, 0, 0.6)" },
  { id: 315, name: "Hoichoi", logo: "/u7dwMceEbjxd1N3TLEUBILSK2x6.jpg", brandColor: "rgba(239, 79, 89, 0.6)" },
  { id: 532, name: "aha", logo: "/8WerMI8XcZXqPpkHTZNtzMzousF.jpg", brandColor: "rgba(255, 119, 0, 0.6)" },
  { id: 437, name: "Hungama Play", logo: "/pMTVKAUyjMb0xdMnHqfNj73MGH6.jpg", brandColor: "rgba(250, 200, 0, 0.6)" },
  { id: 175, name: "Netflix Kids", logo: "/kwVegvKCinXTPuzZmYT1J3i1HJz.jpg", brandColor: "rgba(229, 9, 20, 0.5)" },
  { id: 73, name: "Tubi TV", logo: "/zLYr7OPvpskMA4S79E3vlCi71iC.jpg", brandColor: "rgba(250, 0, 117, 0.5)" },
  { id: 515, name: "MX Player", logo: "/ayHY6wKxvCKj2PU8eRPFxnPc6B0.jpg", brandColor: "rgba(0, 152, 218, 0.6)" },
  { id: 1898, name: "Amazon MX Player", logo: "/yfIWD2zJNHla5RD4xjQNzvKMEwP.jpg", brandColor: "rgba(0, 168, 225, 0.5)" },
  { id: 502, name: "Tata Play", logo: "/5VLMQDq6LWfftQCl7sYrtTseXRA.jpg", brandColor: "rgba(93, 45, 175, 0.6)" },
  { id: 561, name: "Lionsgate Play", logo: "/e2hCUg2Z3sJ6yWF9NLU24SIKeWa.jpg", brandColor: "rgba(255, 182, 18, 0.55)" },
  { id: 476, name: "EPIC ON", logo: "/ymlo2k6RlX0zF5Te1AYwXRQ7Pra.jpg", brandColor: "rgba(226, 186, 66, 0.6)" },
  { id: 474, name: "ShemarooMe", logo: "/ec3kgfQ6YXbT3AFRh8bkQZQFLb2.jpg", brandColor: "rgba(255, 0, 68, 0.5)" },
  { id: 538, name: "Plex", logo: "/vLZKlXUNDcZR7ilvfY9Wr9k80FZ.jpg", brandColor: "rgba(229, 164, 0, 0.6)" },
  { id: 190, name: "Curiosity Stream", logo: "/oR1aNm1Qu9jQBkW4VrGPWhqbC3P.jpg", brandColor: "rgba(23, 130, 194, 0.6)" },
  { id: 614, name: "VI movies and tv", logo: "/9YJY5OwsIPMoX3xC3TdtZVbKBpE.jpg", brandColor: "rgba(217, 40, 48, 0.55)" },
  { id: 482, name: "ManoramaMax", logo: "/tFkqZYsDhNe6hJCx50Aw6oma24w.jpg", brandColor: "rgba(17, 95, 178, 0.6)" },
  { id: 124, name: "BookMyShow", logo: "/hAKPOEwWdjE9evzxByVdF8QUMH3.jpg", brandColor: "rgba(226, 40, 52, 0.55)" },
  { id: 1715, name: "Shahid VIP", logo: "/7qZED0kLBtiV8mLRNBtW4PQCAqW.jpg", brandColor: "rgba(0, 200, 120, 0.5)" },
];

export async function getProviderContent({
  providerId,
  type = "all",
  page = 1,
  genre = "",
  year = "",
  rating = "",
  searchQuery = "",
}: {
  providerId: number;
  type?: "all" | "movie" | "tv" | "anime";
  page?: number;
  genre?: string;
  year?: string;
  rating?: string;
  searchQuery?: string;
}) {
  const region = "IN";
  const genreParam = genre ? `&with_genres=${genre}` : "";
  const ratingParam = rating ? `&vote_average.gte=${rating}` : "";
  const searchParam = searchQuery ? `&with_text_query=${encodeURIComponent(searchQuery)}` : "";

  let results: MovieOrShow[] = [];
  let totalPages = 1;

  if (type === "movie") {
    const yearParam = year ? `&primary_release_year=${year}` : "";
    const url = `/discover/movie?with_watch_providers=${providerId}&watch_region=${region}${genreParam}${yearParam}${ratingParam}${searchParam}&page=${page}&sort_by=popularity.desc`;
    const data = await fetchFromTMDB(url);
    results = (data.results || []).map((item: any) => ({ ...item, media_type: "movie" }));
    totalPages = data.total_pages || 1;
  } else if (type === "tv") {
    const yearParam = year ? `&first_air_date_year=${year}` : "";
    const url = `/discover/tv?with_watch_providers=${providerId}&watch_region=${region}${genreParam}${yearParam}${ratingParam}${searchParam}&page=${page}&sort_by=popularity.desc`;
    const data = await fetchFromTMDB(url);
    results = (data.results || []).map((item: any) => ({ ...item, media_type: "tv" }));
    totalPages = data.total_pages || 1;
  } else if (type === "anime") {
    const yearParam = year ? `&first_air_date_year=${year}` : "";
    const url = `/discover/tv?with_watch_providers=${providerId}&watch_region=${region}&with_genres=16&with_original_language=ja${yearParam}${ratingParam}${searchParam}&page=${page}&sort_by=popularity.desc`;
    const data = await fetchFromTMDB(url);
    results = (data.results || []).map((item: any) => ({ ...item, media_type: "tv" }));
    totalPages = data.total_pages || 1;
  } else {
    const yearMovie = year ? `&primary_release_year=${year}` : "";
    const yearTv = year ? `&first_air_date_year=${year}` : "";
    
    const [movieData, tvData] = await Promise.all([
      fetchFromTMDB(`/discover/movie?with_watch_providers=${providerId}&watch_region=${region}${genreParam}${yearMovie}${ratingParam}${searchParam}&page=${page}&sort_by=popularity.desc`),
      fetchFromTMDB(`/discover/tv?with_watch_providers=${providerId}&watch_region=${region}${genreParam}${yearTv}${ratingParam}${searchParam}&page=${page}&sort_by=popularity.desc`),
    ]);
    
    const movies = (movieData.results || []).map((item: any) => ({ ...item, media_type: "movie" }));
    const tv = (tvData.results || []).map((item: any) => ({ ...item, media_type: "tv" }));
    
    results = [...movies, ...tv].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    totalPages = Math.max(movieData.total_pages || 1, tvData.total_pages || 1);
  }

  return { results, totalPages };
}

export async function searchMovies(query: string, page: number = 1) {
  const data = await fetchFromTMDB("/search/movie", { query, page, include_adult: false });
  return {
    results: (data.results || []).map((item: any) => ({ ...item, media_type: "movie" })),
    totalPages: data.total_pages || 1,
  };
}

export async function searchTV(query: string, page: number = 1) {
  const data = await fetchFromTMDB("/search/tv", { query, page, include_adult: false });
  return {
    results: (data.results || []).map((item: any) => ({ ...item, media_type: "tv" })),
    totalPages: data.total_pages || 1,
  };
}

export async function searchAnime(query: string, page: number = 1) {
  const data = await fetchFromTMDB("/discover/tv", {
    with_genres: "16",
    with_original_language: "ja",
    with_text_query: query,
    page,
    sort_by: "popularity.desc",
  });
  return {
    results: (data.results || []).map((item: any) => ({ ...item, media_type: "tv" })),
    totalPages: data.total_pages || 1,
  };
}

