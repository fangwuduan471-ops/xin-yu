import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listOpenReports, requireModerator } from "@/server/moderation/moderation-service";
export async function GET() { const session = await auth(); try { requireModerator(session?.user?.role); return NextResponse.json({ data: await listOpenReports() }); } catch { return NextResponse.json({ error: "无权访问。" }, { status: 403 }); } }
