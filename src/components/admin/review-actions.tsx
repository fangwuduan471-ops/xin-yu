"use client";
import { useState } from "react";

export function ReviewActions({ workId }: { workId: string }) {
  const [message, setMessage] = useState("");
  const decide = async (decision: "PUBLISHED" | "REJECTED") => { const response = await fetch(`/api/admin/works/${workId}/decision`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision }) }); setMessage(response.ok ? "已处理，刷新页面查看最新队列。" : "操作失败。" ); };
  return <div className="review-actions"><button type="button" onClick={() => decide("PUBLISHED")}>通过</button><button type="button" onClick={() => decide("REJECTED")}>拒绝</button>{message && <span>{message}</span>}</div>;
}
