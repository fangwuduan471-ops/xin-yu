import { Role, WorkStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

export class ModerationError extends Error {}
export function requireModerator(role: string | undefined) { if (role !== Role.ADMIN && role !== Role.MODERATOR) throw new ModerationError("需要审核权限。"); }

export async function listReviewQueue() {
  return getPrisma().work.findMany({ where: { status: WorkStatus.PENDING_REVIEW }, select: { id: true, title: true, summary: true, createdAt: true, author: { select: { username: true } }, category: { select: { name: true } } }, orderBy: { createdAt: "asc" } });
}
export async function decideWork(workId: string, decision: "PUBLISHED" | "REJECTED" | "TAKEN_DOWN", reason?: string) {
  const work = await getPrisma().work.findUnique({ where: { id: workId }, select: { id: true } });
  if (!work) throw new ModerationError("找不到作品。");
  return getPrisma().work.update({ where: { id: workId }, data: { status: decision, moderationReason: reason?.slice(0, 500) || null, publishedAt: decision === "PUBLISHED" ? new Date() : undefined }, select: { id: true, status: true } });
}
export async function listOpenReports() { return getPrisma().report.findMany({ where: { status: { in: ["OPEN", "IN_REVIEW"] } }, select: { id: true, targetType: true, targetId: true, reason: true, description: true, createdAt: true, reporter: { select: { username: true } } }, orderBy: { createdAt: "asc" } }); }
export async function resolveReport(reportId: string, handlerId: string, resolution: string, dismissed = false) { return getPrisma().report.update({ where: { id: reportId }, data: { status: dismissed ? "DISMISSED" : "RESOLVED", handlerId, resolution: resolution.slice(0, 500), resolvedAt: new Date() } }); }
