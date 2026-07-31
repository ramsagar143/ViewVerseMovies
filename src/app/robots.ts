import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://view-verse-chi.vercel.app/sitemap.xml",
    host: "https://view-verse-chi.vercel.app",
  };
}
