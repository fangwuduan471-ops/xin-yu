import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAuthorDashboard } from "@/server/authors/author-service";
export async function GET() { const session = await auth(); if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 }); return NextResponse.json({ data: await getAuthorDashboard(session.user.id) }); }
