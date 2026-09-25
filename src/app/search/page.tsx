import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WorkCard } from "@/components/work/work-card";
import { searchPublishedWorks } from "@/server/works/public-work-service";

export const metadata = { title: "搜索" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const { q = "", sort } = await searchParams;
  const selectedSort = sort === "popular" ? "popular" : "latest";
  const works = await searchPublishedWorks(q, selectedSort);
  return <div className="site-shell"><SiteHeader /><main className="works-page"><header className="page-intro"><p className="eyebrow">FIND A VOICE</p><h1>搜索文字</h1><form className="search-form"><input name="q" defaultValue={q} maxLength={80} placeholder="搜索标题、作者或标签" aria-label="搜索标题、作者或标签" /><button className="button button-primary" type="submit">搜索</button></form></header>{q && <div className="search-result-heading"><span>“{q}” 的结果</span><nav className="sort-nav"><Link className={selectedSort === "latest" ? "active" : ""} href={`/search?q=${encodeURIComponent(q)}&sort=latest`}>最新</Link><Link className={selectedSort === "popular" ? "active" : ""} href={`/search?q=${encodeURIComponent(q)}&sort=popular`}>热门</Link></nav></div>}{q ? works.length ? <section className="public-work-grid">{works.map((work) => <WorkCard key={work.id} work={work} />)}</section> : <section className="empty-state"><h2>没有找到相符的作品</h2><p>试试标题、作者名或更简短的标签。</p></section> : <section className="empty-state"><h2>输入关键词开始寻找</h2><p>可搜索作品标题、作者和标签。</p></section>}</main><SiteFooter /></div>;
}
