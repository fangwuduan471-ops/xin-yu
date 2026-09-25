"use client";
import { useState } from "react";

export function ReportWork({ targetId, canReport }: { targetId: string; canReport: boolean }) {
  const [message, setMessage] = useState("");
  const submit = async () => { const response = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetType: "WORK", targetId, reason: "OTHER" }) }); setMessage(response.ok ? "已提交，感谢你的反馈。" : "提交失败，请登录后重试。"); };
  return <div className="report-control"><button type="button" onClick={submit} disabled={!canReport}>举报作品</button>{message && <span>{message}</span>}</div>;
}
