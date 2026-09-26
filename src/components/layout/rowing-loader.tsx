"use client";

import { useEffect, useState } from "react";

import { RowingScene } from "./rowing-scene";

export function RowingLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return <div className="intro-loader" role="status" aria-live="polite"><RowingScene /><p>正在驶向心屿…</p><span className="sr-only">页面加载中</span></div>;
}
