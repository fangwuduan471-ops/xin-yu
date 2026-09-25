import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { WorkError, updateDraft } from "@/server/works/work-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 });

  try {
    const { id } = await params;
    const work = await updateDraft(session.user.id, id, await request.json());
    return NextResponse.json({ data: work });
  } catch (error) {
    if (error instanceof ZodError || error instanceof WorkError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Update work failed", error);
    return NextResponse.json({ error: "暂时无法更新作品。" }, { status: 500 });
  }
}
