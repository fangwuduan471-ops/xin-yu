import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { InteractionControls } from "@/components/work/interaction-controls";
import { ReportWork } from "@/components/work/report-work";
import { auth } from "@/auth";
import { getPublishedWork } from "@/server/works/public-work-service";

function paragraphs(markdown: string) {
  return markdown.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const work = await getPublishedWork((await params).slug);
  return work ? { title: work.title, description: work.summary } : { title: "作品未找到" };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const [work, session] = await Promise.all([getPublishedWork((await params).slug), auth()]);
  if (!work) notFound();

  return (
    <div className="site-shell"><SiteHeader /><main className="reading-page">
      <article>
        <header className="reading-header"><p className="work-category">{work.category.name}</p><h1>{work.title}</h1><p className="reading-summary">{work.summary}</p><div className="reading-byline"><span>{work.author.username}</span><span>·</span><time dateTime={work.publishedAt?.toISOString()}>{work.publishedAt?.toLocaleDateString("zh-CN")}</time></div><div className="tag-row">{work.tags.map(({ tag }) => <span key={tag.name}>#{tag.name}</span>)}</div></header>
        <div className="reading-content">{paragraphs(work.contentMarkdown).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <InteractionControls workId={work.id} canInteract={Boolean(session?.user)} likeCount={work._count.likes} collectionCount={work._count.collections} />
        <ReportWork targetId={work.id} canReport={Boolean(session?.user)} />
        <footer className="author-panel"><span className="avatar avatar-pale">{work.author.username.slice(0, 1)}</span><div><p>作者</p><h2>{work.author.username}</h2><span>{work.author.bio || "在心屿留下自己的文字。"}</span></div></footer>
      </article>
    </main><SiteFooter /></div>
  );
}
