import { RowingScene } from "@/components/layout/rowing-scene";

export default function Loading() {
  return <div className="site-loader" role="status" aria-live="polite"><RowingScene /><p>正在驶向心屿…</p><span className="sr-only">页面加载中</span></div>;
}
