import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WorkCard } from "@/components/work/work-card";
import { listPublicCategories, listPublishedWorks } from "@/server/works/public-work-service";

export const metadata = { title: "作品" };

export default async function WorksPage({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string }> }) {
  const { category, sort: requestedSort } = await searchParams;
  const sort = requestedSort === "popular" ? "popular" : "latest";
  const [categories, works] = await Promise.all([listPublicCategories(), listPublishedWorks({ categorySlug: category, sort })]);

  return (
    <div className="site-shell"><SiteHeader /><main className="works-page">
      <header className="page-intro"><p className="eyebrow">READ AT YOUR OWN PACE</p><h1>作品</h1><p>这里仅展示审核通过、已公开发布的作品。</p></header>
      <div className="browse-controls"><nav className="filter-nav" aria-label="作品分类"><Link className={!category ? "active" : ""} href={`/works?sort=${sort}`}>全部</Link>{categories.map((item) => <Link className={category === item.slug ? "active" : ""} href={`/works?category=${item.slug}&sort=${sort}`} key={item.slug}>{item.name}</Link>)}</nav><nav className="sort-nav" aria-label="排序方式"><Link className={sort === "latest" ? "active" : ""} href={`/works${category ? `?category=${category}&` : "?"}sort=latest`}>最新</Link><Link className={sort === "popular" ? "active" : ""} href={`/works${category ? `?category=${category}&` : "?"}sort=popular`}>热门</Link></nav></div>
      {works.length ? <section className="public-work-grid">{works.map((work) => <WorkCard key={work.id} work={work} />)}</section> : <section className="empty-state"><h2>{process.env.DATABASE_URL ? "还没有公开作品" : "数据库尚未初始化"}</h2><p>{process.env.DATABASE_URL ? "第一篇通过审核的作品，会从这里开始被看见。" : "配置 DATABASE_URL 并完成迁移后，公开作品会显示在这里。"}</p></section>}
    </main><SiteFooter /></div>
  );
}
