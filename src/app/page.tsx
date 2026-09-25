import Link from "next/link";
import { isClosedBetaEnabled } from "@/lib/beta-access";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const latestWorks = [
  ["散文", "月亮落在晚自习的窗台", "那一晚的风很轻，我们在题目与沉默之间，悄悄长大。", "林见山", "6 分钟阅读 · 今日推荐"],
  ["诗歌", "给十七岁的海", "潮声把未说出口的话，一次次推向岸边。", "陈晚", "2 分钟阅读 · 新作"],
  ["小说", "雨停之后，我们绕过操场", "他把伞收起来时，云层正好裂开一条银色的缝。", "周予安", "12 分钟阅读 · 校园"],
] as const;

export default function Home() {
  const isClosedBeta = isClosedBetaEnabled();
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
        <section className="home-section" aria-labelledby="featured-heading">
          <div className="section-heading"><div><p className="eyebrow">EDITOR&apos;S CHOICE</p><h2 id="featured-heading">今日推荐</h2></div><Link className="text-link" href="/works?sort=featured">查看全部 →</Link></div>
          <article className="featured-work">
            <div className="featured-art" aria-hidden="true"><span>01</span></div>
            <div className="featured-content"><p className="work-category">散文</p><h3>在没有晚风的夏天，我们学会告别</h3><p className="featured-excerpt">“毕业照拍完的那个午后，走廊空得像一张尚未写满的纸。我们把校服叠好，把没来得及说的话留给蝉鸣。”</p><div className="work-byline"><span className="avatar">许</span><span>许知遥</span><span>·</span><span>8 分钟阅读</span></div><Link className="button button-quiet" href="/works">浏览公开作品</Link></div>
          </article>
        </section>
        <section className="home-section" aria-labelledby="latest-heading">
          <div className="section-heading"><div><p className="eyebrow">JUST PUBLISHED</p><h2 id="latest-heading">最新作品</h2></div><Link className="text-link" href="/works?sort=latest">全部新作 →</Link></div>
          <div className="work-grid">{latestWorks.map(([category, title, excerpt, author, meta]) => <article className="work-card" key={title}><p className="work-category">{category}</p><h3>{title}</h3><p>{excerpt}</p><footer><span>{author}</span><span>{meta}</span></footer></article>)}</div>
        </section>
        <section className="home-section discovery-section" aria-labelledby="discovery-heading">
          <div><p className="eyebrow">EXPLORE</p><h2 id="discovery-heading">从一段文字开始，<br />抵达另一个心屿。</h2></div>
          <div className="category-list">{["小说", "散文", "诗歌", "随笔", "其他"].map((category, index) => <Link href={`/works?category=${encodeURIComponent(category)}`} key={category}><span>0{index + 1}</span>{category}<b aria-hidden="true">↗</b></Link>)}</div>
        </section>
        <section className="home-section" aria-labelledby="newcomer-heading">
          <div className="section-heading"><div><p className="eyebrow">FIRST LIGHT</p><h2 id="newcomer-heading">初来乍到的作者</h2></div><p className="section-note">让新的声音，也有自己的位置。</p></div>
          <div className="newcomer-list">{[["夏", "夏望", "在写一篇关于故乡与远行的小说。"], ["顾", "顾野", "把日常的微光，写成短诗。"], ["沈", "沈青禾", "记录那些没有名字的心事。"]].map(([initial, name, bio]) => <article key={name}><span className="avatar avatar-pale">{initial}</span><div><h3>{name}</h3><p>{bio}</p></div></article>)}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
