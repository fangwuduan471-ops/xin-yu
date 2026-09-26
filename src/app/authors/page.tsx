import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { listPublishedAuthors } from "@/server/authors/author-service";

export default async function AuthorsPage() {
  const authors = await listPublishedAuthors();

  return (
    <div className="site-shell"><SiteHeader /><main className="works-page">
      <header className="page-intro"><p className="eyebrow">VOICES OF XINYU</p><h1>作者</h1><p>在这里，认识每一位把文字留在心屿的人。</p></header>
      {authors.length ? <section className="author-list">{authors.map((author) => <Link href={`/authors/${encodeURIComponent(author.username)}`} key={author.username}><span className="avatar avatar-pale">{author.username.slice(0, 1)}</span><div><h2>{author.username}</h2><p>{author.bio || "在心屿留下自己的文字。"}</p></div><span className="newcomer-work-count">{author._count.works} 篇公开作品</span></Link>)}</section> : <section className="empty-state"><h2>暂无作者</h2><p>首批公开作品发布后，作者会在这里出现。</p></section>}
    </main><SiteFooter /></div>
  );
}
