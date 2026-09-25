import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { WorkError, createDraft } from "@/server/works/work-service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 });

  try {
    const work = await createDraft(session.user.id, await request.json());
    return NextResponse.json({ data: work }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError || error instanceof WorkError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Create work failed", error);
    return NextResponse.json({ error: "暂时无法保存作品。" }, { status: 500 });
  }
}
