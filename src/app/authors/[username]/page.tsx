import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WorkCard } from "@/components/work/work-card";
import { getAuthorProfile } from "@/server/authors/author-service";

export default async function AuthorPage({ params }: { params: Promise<{ username: string }> }) {
  const author = await getAuthorProfile((await params).username);
  if (!author) notFound();
  return <div className="site-shell"><SiteHeader /><main className="works-page"><header className="author-hero"><span className="avatar avatar-pale">{author.username.slice(0, 1)}</span><div><p className="eyebrow">AUTHOR</p><h1>{author.username}</h1><p>{author.bio || "在心屿留下自己的文字。"}</p></div></header><h2 className="author-work-title">公开作品</h2>{author.works.length ? <section className="public-work-grid">{author.works.map((work) => <WorkCard key={work.id} work={work} />)}</section> : <section className="empty-state"><h2>还没有公开作品</h2></section>}</main><SiteFooter /></div>;
}
