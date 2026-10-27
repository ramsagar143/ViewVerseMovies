import { NextRequest } from "next/server";
import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get("endpoint");
  const paramsStr = searchParams.get("params");

  if (!endpoint) {
    return Response.json({ error: "Missing endpoint parameter" }, { status: 400 });
  }

  let params: Record<string, string | number | boolean> = {};
  if (paramsStr) {
    try {
      params = JSON.parse(paramsStr) as Record<string, string | number | boolean>;
    } catch {
      return Response.json({ error: "Invalid params format" }, { status: 400 });
    }
  }

  try {
    const data = await fetchFromTMDB(endpoint, params);
    return Response.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch from TMDB";
    console.error("Proxy TMDB error:", error);
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
