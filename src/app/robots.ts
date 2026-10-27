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
    sitemap: "https://viewversetv.netlify.app/sitemap.xml",
    host: "https://viewversetv.netlify.app",
  };
}
