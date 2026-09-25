import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© 2026 心屿 · 让文字被看见</span>
      <nav aria-label="页脚导航">
        <Link href="/guidelines">社区规范</Link><Link href="/privacy">隐私说明</Link><Link href="/feedback">反馈建议</Link>
      </nav>
    </footer>
  );
}
