import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p className="eyebrow">404 · LOST AT SEA</p>
      <h1>这里暂时没有文字。</h1>
      <p>你访问的页面可能已移动，或从未抵达过心屿。</p>
      <Link className="button button-primary" href="/">返回首页</Link>
    </main>
  );
}
