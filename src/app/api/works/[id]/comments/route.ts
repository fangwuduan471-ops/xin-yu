import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { InteractionError, createComment, listComments } from "@/server/interactions/interaction-service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return NextResponse.json({ data: await listComments((await params).id) }); }
  catch { return NextResponse.json({ error: "找不到公开作品。" }, { status: 404 }); }
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  try { return NextResponse.json({ data: await createComment(session.user.id, (await params).id, await request.json()) }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof ZodError || error instanceof InteractionError ? error.message : "暂时无法发布评论。" }, { status: 400 }); }
}
