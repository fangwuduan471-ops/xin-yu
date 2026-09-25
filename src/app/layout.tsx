import type { Metadata } from "next";
import "./globals.css";

export function generateMetadata(): Metadata {
  const isClosedBeta = process.env.BETA_MODE === "true";
  return {
    title: { default: "心屿 · 开放文学社区", template: "%s · 心屿" },
    description: "让每一段认真写下的文字，都有被看见的机会。",
    robots: isClosedBeta ? { index: false, follow: false } : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
