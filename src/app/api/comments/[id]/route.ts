import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { InteractionError, deleteComment } from "@/server/interactions/interaction-service";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  try { await deleteComment(session.user.id, session.user.role, (await params).id); return new NextResponse(null, { status: 204 }); }
  catch (error) { return NextResponse.json({ error: error instanceof InteractionError ? error.message : "删除失败。" }, { status: 400 }); }
}
