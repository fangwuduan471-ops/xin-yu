import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { InteractionError, setLike } from "@/server/interactions/interaction-service";

async function changeLike(request: Request, liked: boolean, params: Promise<{ id: string }>) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  try { await setLike(session.user.id, (await params).id, liked); return new NextResponse(null, { status: 204 }); }
  catch (error) { return NextResponse.json({ error: error instanceof InteractionError ? error.message : "操作失败。" }, { status: 400 }); }
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) { return changeLike(request, true, params); }
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) { return changeLike(request, false, params); }
