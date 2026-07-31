import { NextRequest } from "next/server";
import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get("endpoint");
  const paramsStr = searchParams.get("params");

  if (!endpoint) {
    return Response.json({ error: "Missing endpoint parameter" }, { status: 400 });
  }

  let params = {};
  if (paramsStr) {
    try {
      params = JSON.parse(paramsStr);
    } catch (e) {
      return Response.json({ error: "Invalid params format" }, { status: 400 });
    }
  }

  try {
    const data = await fetchFromTMDB(endpoint, params);
    return Response.json(data);
  } catch (error: any) {
    console.error("Proxy TMDB error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch from TMDB" },
      { status: 500 }
    );
  }
}
