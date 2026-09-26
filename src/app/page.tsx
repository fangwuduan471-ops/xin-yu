import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WorkCard } from "@/components/work/work-card";
import { isClosedBetaEnabled } from "@/lib/beta-access";
import { listPublishedAuthors } from "@/server/authors/author-service";
import { getPublishedWork, listPublishedWorks, listPublicCategories } from "@/server/works/public-work-service";

const siteIntroductionSlug = "about-xinyu";

export default async function Home() {
  const isClosedBeta = isClosedBetaEnabled();
  const [introduction, publishedWorks, categories, authors] = await Promise.all([
    getPublishedWork(siteIntroductionSlug),
    listPublishedWorks(),
    listPublicCategories(),
    listPublishedAuthors(),
  ]);
  const recommendedWorks = publishedWorks.filter((work) => work.slug !== siteIntroductionSlug).slice(0, 3);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <p className="eyebrow">XINYU · {isClosedBeta ? "CLOSED BETA" : "OPEN LITERARY COMMUNITY"}</p>
          <h1 id="hero-heading">让每一段认真写下的文字，<br />都有被看见的机会。</h1>
          <p className="hero-copy">{isClosedBeta ? "心屿正在进行小范围测试。受邀作者可以写下感受，读见彼此。" : "心屿是为年轻创作者准备的一处安静角落。写下感受，读见彼此。"}</p>
          <div className="hero-actions"><Link className="button button-primary" href="/register">{isClosedBeta ? "受邀加入测试" : "开始创作"}</Link><Link className="text-link" href="/works">去读一读 <span aria-hidden="true">→</span></Link></div>
        </section>

        <section className="home-section" aria-labelledby="introduction-heading">
          <div className="section-heading"><div><p className="eyebrow">WELCOME TO XINYU</p><h2 id="introduction-heading">认识心屿</h2></div></div>
          {introduction ? (
            <Link className="featured-work featured-work-link" href={`/works/${introduction.slug}`} aria-label={`阅读：${introduction.title}`}>
              <div className="featured-art" aria-hidden="true"><span className="landscape-title">心屿</span><i className="landscape-sun" /><i className="landscape-mountain mountain-far" /><i className="landscape-mountain mountain-near" /><i className="landscape-lake lake-one" /><i className="landscape-lake lake-two" /><i className="landscape-boat"><i /></i></div>
              <div className="featured-content"><p className="work-category">{introduction.category.name}</p><h3>{introduction.title}</h3><p className="featured-excerpt">{introduction.summary}</p><div className="work-byline"><span className="avatar">心</span><span>心屿</span><span>·</span><span>点击进入阅读</span></div><span className="button button-quiet">阅读介绍 <span aria-hidden="true">→</span></span></div>
            </Link>
          ) : <section className="empty-state"><h2>介绍正在抵达</h2><p>心屿的第一篇介绍将在这里与读者见面。</p></section>}
        </section>

        <section className="home-section" aria-labelledby="recommendation-heading">
          <div className="section-heading"><div><p className="eyebrow">EDITOR&apos;S CHOICE</p><h2 id="recommendation-heading">今日推荐</h2></div><Link className="text-link" href="/works?sort=latest">查看全部 →</Link></div>
          {recommendedWorks.length ? <section className="public-work-grid">{recommendedWorks.map((work) => <WorkCard key={work.id} work={work} />)}</section> : <section className="empty-recommendation"><span aria-hidden="true">⌇</span><div><h3>还没有作品喔</h3><p>第一篇来自创作者的公开作品，会在这里与大家见面。</p></div></section>}
        </section>

        <section className="home-section discovery-section" aria-labelledby="discovery-heading">
          <div><p className="eyebrow">EXPLORE</p><h2 id="discovery-heading">从一段文字开始，<br />抵达另一个心屿。</h2></div>
          <nav className="category-list" aria-label="作品分类">{categories.map((category, index) => <Link href={`/works?category=${category.slug}&sort=latest`} key={category.slug}><span>{String(index + 1).padStart(2, "0")}</span>{category.name}<b aria-hidden="true">↗</b></Link>)}</nav>
        </section>

        <section className="home-section" aria-labelledby="newcomer-heading">
          <div className="section-heading"><div><p className="eyebrow">FIRST LIGHT</p><h2 id="newcomer-heading">初来乍到的作者</h2></div><p className="section-note">让新的声音，也有自己的位置。</p></div>
          {authors.length ? (
            <div className="newcomer-list">{authors.map((author) => <Link className="newcomer-card" href={`/authors/${encodeURIComponent(author.username)}`} key={author.username}><span className="avatar avatar-pale">{author.username.slice(0, 1)}</span><div><h3>{author.username}</h3><p>{author.bio || "在心屿留下自己的文字。"}</p></div><span aria-hidden="true">↗</span></Link>)}</div>
          ) : <section className="empty-author-state"><p>暂无作者。</p><span>首批作者发布公开作品后，这里将可以直接进入他们的个人主页。</span></section>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
