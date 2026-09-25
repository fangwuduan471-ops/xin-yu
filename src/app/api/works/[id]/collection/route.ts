import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { InteractionError, setCollection } from "@/server/interactions/interaction-service";

async function changeCollection(collected: boolean, params: Promise<{ id: string }>) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 });
  try { await setCollection(session.user.id, (await params).id, collected); return new NextResponse(null, { status: 204 }); }
  catch (error) { return NextResponse.json({ error: error instanceof InteractionError ? error.message : "操作失败。" }, { status: 400 }); }
}
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) { return changeCollection(true, params); }
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) { return changeCollection(false, params); }
