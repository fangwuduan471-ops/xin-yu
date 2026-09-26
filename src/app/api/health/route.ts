import { NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    const record = error as { name?: unknown; code?: unknown };
    console.error("Health-check database failure", {
      name: typeof record?.name === "string" ? record.name : "UnknownError",
      code: typeof record?.code === "string" ? record.code : undefined,
    });

    return NextResponse.json(
      { status: "unavailable", service: "xin-yu", database: "unavailable" },
      { status: 503 },
    );
  }
}
