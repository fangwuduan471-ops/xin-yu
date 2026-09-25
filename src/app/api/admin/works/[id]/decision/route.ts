import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { decideWork, requireModerator } from "@/server/moderation/moderation-service";
const schema = z.object({ decision: z.enum(["PUBLISHED", "REJECTED", "TAKEN_DOWN"]), reason: z.string().max(500).optional() });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) { const session = await auth(); try { requireModerator(session?.user?.role); const data = schema.parse(await request.json()); return NextResponse.json({ data: await decideWork((await params).id, data.decision, data.reason) }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "审核操作失败。" }, { status: 400 }); } }
