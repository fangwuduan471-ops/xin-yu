export default function Loading() {
  return (
    <div className="site-loader" role="status" aria-live="polite">
      <div className="rowing-scene" aria-hidden="true">
        <span className="rowing-moon" />
        <span className="rowing-water water-back" />
        <span className="rowing-water water-front" />
        <span className="rowing-boat"><i className="rowing-person" /><i className="rowing-oar" /></span>
      </div>
      <p>正在驶向心屿…</p>
      <span className="sr-only">页面加载中</span>
    </div>
  );
}
