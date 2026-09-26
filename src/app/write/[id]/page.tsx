import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { WorkEditorForm } from "@/components/works/work-editor-form";
import { getPrisma } from "@/lib/prisma";

import { updateWorkAction } from "../actions";

type EditWorkPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function EditWorkPage({ params, searchParams }: EditWorkPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const { error } = await searchParams;
  const prisma = getPrisma();
  const [work, categories] = await Promise.all([
    prisma.work.findFirst({
      where: { id, authorId: session.user.id, status: { in: ["DRAFT", "REJECTED"] } },
      include: { tags: { include: { tag: { select: { name: true } } } } },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!work) notFound();
  const errorMessage = typeof error === "string" ? error : undefined;
  return (
    <main className="editor-page">
      <header className="editor-header">
        <Link className="brand" href="/"><span className="brand-mark">心</span><span>心屿</span></Link>
        <Link className="editor-header-link" href="/dashboard">返回作者中心</Link>
      </header>
      <WorkEditorForm
        action={updateWorkAction}
        categories={categories}
        errorMessage={errorMessage}
        values={{ title: work.title, summary: work.summary, categoryId: work.categoryId, tagNames: work.tags.map(({ tag }) => tag.name), contentMarkdown: work.contentMarkdown }}
        workId={work.id}
      />
    </main>
  );
}
