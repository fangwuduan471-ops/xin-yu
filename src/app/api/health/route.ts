import { NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getSafeFailureReason(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "DATABASE_URL is required before database features can be used."
  ) {
    return "database_url_missing";
  }

  if (error instanceof TypeError) return "database_url_invalid";
  return "database_connection_failed";
}

function getSafeErrorCode(error: unknown) {
  const code = (error as { code?: unknown })?.code;
  return typeof code === "string" && /^[A-Z0-9_]{2,32}$/.test(code) ? code : undefined;
}

export async function GET() {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      service: "xin-yu",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health-check database failure", {
      name: error instanceof Error ? error.name : "UnknownError",
      code: getSafeErrorCode(error),
    });

    return NextResponse.json(
      {
        status: "unavailable",
        service: "xin-yu",
        database: "unavailable",
        reason: getSafeFailureReason(error),
        code: getSafeErrorCode(error),
      },
      { status: 503 },
    );
  }
}
