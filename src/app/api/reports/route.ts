import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { rateLimit, requestIdentity } from "@/lib/security/rate-limit";
import { reportSchema } from "@/lib/validations/report";

export async function POST(request: Request) { const session = await auth(); if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 }); if (!rateLimit(`report:${session.user.id}:${requestIdentity(request)}`, 5, 60 * 60_000)) return NextResponse.json({ error: "举报过于频繁，请稍后再试。" }, { status: 429 }); try { const data = reportSchema.parse(await request.json()); const report = await getPrisma().report.create({ data: { ...data, reporterId: session.user.id }, select: { id: true, status: true } }); return NextResponse.json({ data: report }, { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof ZodError ? error.message : "暂时无法提交举报。" }, { status: 400 }); } }
