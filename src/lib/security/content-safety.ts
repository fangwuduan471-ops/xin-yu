export type ContentRisk = "LOW" | "MEDIUM" | "HIGH";

export function assessContent(text: string): { risk: ContentRisk; reasons: string[] } {
  const normalized = text.toLowerCase();
  const reasons: string[] = [];
  if (/(?:https?:\/\/|www\.)/.test(normalized)) reasons.push("包含外部链接，需排查广告或引流。");
  if (/(?:微信|vx|qq)\s*[:：]?\s*\d{5,}/i.test(normalized)) reasons.push("包含可能的站外联系方式。");
  if (/(?:裸聊|招嫖|赌博|代孕)/.test(normalized)) reasons.push("命中高风险内容关键词。");
  return { risk: reasons.some((reason) => reason.includes("高风险")) ? "HIGH" : reasons.length ? "MEDIUM" : "LOW", reasons };
}
