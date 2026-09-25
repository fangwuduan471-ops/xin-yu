import { WorkStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";

const publicWorkInclude = {
  author: { select: { username: true, avatarUrl: true, bio: true } },
  category: { select: { name: true, slug: true } },
  tags: { include: { tag: { select: { name: true, slug: true } } } },
  _count: { select: { likes: true, collections: true, comments: true } },
} as const;

export type PublicWorkSort = "latest" | "popular";

export async function listPublishedWorks(options: { categorySlug?: string; sort?: PublicWorkSort } = {}) {
  if (!process.env.DATABASE_URL) return [];
  const { categorySlug, sort = "latest" } = options;
  return getPrisma().work.findMany({
    where: {
      status: WorkStatus.PUBLISHED,
      ...(categorySlug ? { category: { slug: categorySlug, isActive: true } } : {}),
    },
    include: publicWorkInclude,
    orderBy: sort === "popular" ? [{ likes: { _count: "desc" } }, { publishedAt: "desc" }] : { publishedAt: "desc" },
    take: 24,
  });
}

export async function searchPublishedWorks(query: string, sort: PublicWorkSort = "latest") {
  if (!process.env.DATABASE_URL || !query.trim()) return [];
  const keyword = query.trim().slice(0, 80);
  return getPrisma().work.findMany({
    where: {
      status: WorkStatus.PUBLISHED,
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { summary: { contains: keyword, mode: "insensitive" } },
        { author: { username: { contains: keyword, mode: "insensitive" } } },
        { tags: { some: { tag: { name: { contains: keyword, mode: "insensitive" } } } } },
      ],
    },
    include: publicWorkInclude,
    orderBy: sort === "popular" ? [{ likes: { _count: "desc" } }, { publishedAt: "desc" }] : { publishedAt: "desc" },
    take: 24,
  });
}

export async function getPublishedWork(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  return getPrisma().work.findFirst({
    where: { slug, status: WorkStatus.PUBLISHED },
    include: publicWorkInclude,
  });
}

export async function listPublicCategories() {
  if (!process.env.DATABASE_URL) return [];
  return getPrisma().category.findMany({
    where: { isActive: true },
    select: { name: true, slug: true },
    orderBy: { sortOrder: "asc" },
  });
}
