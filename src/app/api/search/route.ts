import { NextResponse } from "next/server";

import { searchPublishedWorks } from "@/server/works/public-work-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") === "popular" ? "popular" : "latest";
  return NextResponse.json({ data: await searchPublishedWorks(q, sort), meta: { q, sort } });
}
