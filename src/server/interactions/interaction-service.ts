import { CommentStatus, WorkStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations/comment";

export class InteractionError extends Error {}

async function requirePublishedWork(workId: string) {
  const work = await getPrisma().work.findFirst({ where: { id: workId, status: WorkStatus.PUBLISHED }, select: { id: true } });
  if (!work) throw new InteractionError("这篇作品暂时无法互动。");
}

export async function setLike(userId: string, workId: string, liked: boolean) {
  const prisma = getPrisma();
  await requirePublishedWork(workId);
  if (liked) await prisma.workLike.upsert({ where: { userId_workId: { userId, workId } }, update: {}, create: { userId, workId } });
  else await prisma.workLike.deleteMany({ where: { userId, workId } });
}

export async function setCollection(userId: string, workId: string, collected: boolean) {
  const prisma = getPrisma();
  await requirePublishedWork(workId);
  if (collected) await prisma.collection.upsert({ where: { userId_workId: { userId, workId } }, update: {}, create: { userId, workId } });
  else await prisma.collection.deleteMany({ where: { userId, workId } });
}

export async function listComments(workId: string) {
  await requirePublishedWork(workId);
  return getPrisma().comment.findMany({
    where: { workId, status: CommentStatus.VISIBLE },
    select: { id: true, content: true, createdAt: true, author: { select: { username: true, avatarUrl: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function createComment(userId: string, workId: string, input: unknown) {
  const { content } = commentSchema.parse(input);
  await requirePublishedWork(workId);
  return getPrisma().comment.create({
    data: { authorId: userId, workId, content },
    select: { id: true, content: true, createdAt: true },
  });
}

export async function deleteComment(userId: string, role: string, commentId: string) {
  const comment = await getPrisma().comment.findUnique({ where: { id: commentId }, select: { authorId: true } });
  if (!comment) throw new InteractionError("找不到这条评论。");
  if (comment.authorId !== userId && role !== "ADMIN" && role !== "MODERATOR") throw new InteractionError("无权删除这条评论。");
  await getPrisma().comment.update({ where: { id: commentId }, data: { status: CommentStatus.DELETED, deletedAt: new Date() } });
}
