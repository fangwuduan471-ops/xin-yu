import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { WorkError, submitForReview } from "@/server/works/work-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "请先登录。" }, { status: 401 });

  try {
    const { id } = await params;
    return NextResponse.json({ data: await submitForReview(session.user.id, id) });
  } catch (error) {
    if (error instanceof WorkError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Submit work failed", error);
    return NextResponse.json({ error: "暂时无法提交审核。" }, { status: 500 });
  }
}
