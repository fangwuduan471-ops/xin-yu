import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { WorkEditorForm } from "@/components/works/work-editor-form";
import { getPrisma } from "@/lib/prisma";

import { saveWorkAction } from "./actions";

export default async function WritePage({ searchParams }: PageProps<"/write">) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { error } = await searchParams;
  const errorMessage = typeof error === "string" ? error : undefined;
  const categories = await getPrisma().category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });

  return (
    <main className="editor-page">
      <header className="editor-header"><span className="brand"><span className="brand-mark" aria-hidden="true" /><span>心屿</span></span><span>写作草稿</span></header>
      <WorkEditorForm action={saveWorkAction} categories={categories} errorMessage={errorMessage} />
    </main>
  );
}
