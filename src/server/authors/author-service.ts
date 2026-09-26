import { WorkStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

const siteIntroductionSlug = "about-xinyu";

export async function getAuthorDashboard(userId: string) {
  return getPrisma().work.findMany({
    where: { authorId: userId },
    select: { id: true, title: true, status: true, updatedAt: true, category: { select: { name: true } }, _count: { select: { likes: true, collections: true, comments: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAuthorProfile(username: string) {
  return getPrisma().user.findUnique({
    where: { username },
    select: {
      username: true, avatarUrl: true, bio: true, createdAt: true,
      works: { where: { status: WorkStatus.PUBLISHED }, orderBy: { publishedAt: "desc" }, include: { category: { select: { name: true } }, tags: { include: { tag: { select: { name: true } } } }, author: { select: { username: true } } } },
    },
  });
}

export async function listPublishedAuthors() {
  return getPrisma().user.findMany({
    where: {
      works: {
        some: {
          status: WorkStatus.PUBLISHED,
          slug: { not: siteIntroductionSlug },
        },
      },
    },
    select: { username: true, bio: true, avatarUrl: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}
