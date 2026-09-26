import { randomUUID } from "crypto";

import { WorkStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { workInputSchema, type WorkInput } from "@/lib/validations/work";
import { assessContent } from "@/lib/security/content-safety";

export class WorkError extends Error {}

function makeSlug() {
  return `work-${randomUUID()}`;
}

function normalizeTagNames(tagNames: string[]) {
  return [...new Set(tagNames.map((tag) => tag.trim()).filter(Boolean))];
}

function parseWorkInput(input: WorkInput) {
  // A blank tags field arrives from HTML forms as [""]. Normalize before Zod
  // validates each tag so tags remain optional as intended.
  return workInputSchema.parse({ ...input, tagNames: normalizeTagNames(input.tagNames ?? []) });
}

async function requireActiveCategory(categoryId: string) {
  const category = await getPrisma().category.findFirst({ where: { id: categoryId, isActive: true } });
  if (!category) throw new WorkError("所选分类不可用。");
}

function tagConnections(tagNames: string[]) {
  return normalizeTagNames(tagNames).map((name) => ({
    where: { name },
    create: { name, slug: `tag-${randomUUID()}` },
  }));
}

export async function createDraft(authorId: string, input: WorkInput) {
  const data = parseWorkInput(input);
  await requireActiveCategory(data.categoryId);

  return getPrisma().work.create({
    data: {
      title: data.title,
      slug: makeSlug(),
      summary: data.summary,
      contentMarkdown: data.contentMarkdown,
      authorId,
      categoryId: data.categoryId,
      status: WorkStatus.DRAFT,
      tags: { create: tagConnections(data.tagNames).map((tag) => ({ tag: { connectOrCreate: tag } })) },
    },
    select: { id: true, status: true, updatedAt: true },
  });
}

export async function updateDraft(authorId: string, workId: string, input: WorkInput) {
  const data = parseWorkInput(input);
  const prisma = getPrisma();
  const work = await prisma.work.findFirst({ where: { id: workId, authorId } });
  if (!work) throw new WorkError("找不到这篇作品。");
  if (work.status !== WorkStatus.DRAFT && work.status !== WorkStatus.REJECTED) {
    throw new WorkError("只有草稿或被拒绝的作品可以编辑。");
  }
  await requireActiveCategory(data.categoryId);

  return prisma.work.update({
    where: { id: workId },
    data: {
      title: data.title,
      summary: data.summary,
      contentMarkdown: data.contentMarkdown,
      contentHtml: null,
      categoryId: data.categoryId,
      moderationReason: null,
      tags: {
        deleteMany: {},
        create: tagConnections(data.tagNames).map((tag) => ({ tag: { connectOrCreate: tag } })),
      },
    },
    select: { id: true, status: true, updatedAt: true },
  });
}

export async function deleteDraft(authorId: string, workId: string) {
  const prisma = getPrisma();
  const work = await prisma.work.findFirst({
    where: { id: workId, authorId, status: WorkStatus.DRAFT },
    select: { id: true },
  });

  if (!work) throw new WorkError("只能删除自己的草稿。审核中或已发布的作品无法删除。");

  await prisma.work.delete({ where: { id: work.id } });
}

export async function submitForReview(authorId: string, workId: string) {
  const prisma = getPrisma();
  const work = await prisma.work.findFirst({ where: { id: workId, authorId } });
  if (!work) throw new WorkError("找不到这篇作品。");
  if (work.status !== WorkStatus.DRAFT && work.status !== WorkStatus.REJECTED) {
    throw new WorkError("当前状态不能提交审核。");
  }
  if (work.contentMarkdown.trim().length < 20) throw new WorkError("正文至少需要 20 个字符才能提交审核。");

  const safety = assessContent(`${work.title}\n${work.summary}\n${work.contentMarkdown}`);
  return prisma.$transaction(async (tx) => {
    await tx.workVersion.create({
      data: { workId: work.id, title: work.title, summary: work.summary, contentMarkdown: work.contentMarkdown },
    });
    return tx.work.update({
      where: { id: work.id },
      data: { status: WorkStatus.PENDING_REVIEW, moderationReason: safety.reasons.join(" ") || null },
      select: { id: true, status: true, updatedAt: true },
    });
  });
}
