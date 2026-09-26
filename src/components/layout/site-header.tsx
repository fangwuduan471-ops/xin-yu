import Link from "next/link";

import { isClosedBetaEnabled } from "@/lib/beta-access";

export function SiteHeader() {
  const isClosedBeta = isClosedBetaEnabled();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="心屿首页">
        <span className="brand-mark" aria-hidden="true" /><span>心屿</span>
      </Link>
      <nav className="site-nav" aria-label="主导航">
        <Link href="/">发现</Link><Link href="/works">作品</Link><Link href="/search">搜索</Link><Link href="/authors">作者</Link><Link href="/write">写作</Link>
      </nav>
      <div className="header-actions">
        <Link className="login-link" href="/login">登录</Link>
        <Link className="button button-outline" href="/register">{isClosedBeta ? "测试注册" : "加入心屿"}</Link>
      </div>
    </header>
  );
}
