"use client";

import { useState } from "react";

type InteractionControlsProps = { workId: string; canInteract: boolean; likeCount: number; collectionCount: number };

export function InteractionControls({ workId, canInteract, likeCount, collectionCount }: InteractionControlsProps) {
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [busy, setBusy] = useState(false);
  const toggle = async (kind: "like" | "collection", active: boolean, setter: (value: boolean) => void) => {
    if (!canInteract || busy) return;
    setBusy(true);
    const response = await fetch(`/api/works/${workId}/${kind}`, { method: active ? "DELETE" : "POST" });
    if (response.ok) setter(!active);
    setBusy(false);
  };
  return <div className="interaction-controls"><button type="button" disabled={!canInteract || busy} onClick={() => toggle("like", liked, setLiked)}>{liked ? "已喜欢" : "喜欢"} {likeCount + Number(liked)}</button><button type="button" disabled={!canInteract || busy} onClick={() => toggle("collection", collected, setCollected)}>{collected ? "已收藏" : "收藏"} {collectionCount + Number(collected)}</button>{!canInteract && <span>登录后可互动</span>}</div>;
}
