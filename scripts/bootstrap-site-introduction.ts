import { config } from "dotenv";

import { Role, WorkStatus } from "../src/generated/prisma/client";
import { getPrisma } from "../src/lib/prisma";

config({ path: ".env" });
config({ path: ".env.local" });

const introduction = {
  slug: "about-xinyu",
  title: "认识心屿",
  summary: "心屿是一处面向年轻创作者的开放文学社区，让每一段认真写下的文字，都有被看见的机会。",
  contentMarkdown: `心屿是一座由文字连起的小岛。

我们相信，一段真诚的感受、一首还在生长的诗、一个刚刚开始的故事，都值得拥有安静而认真的阅读。

这里不是只追逐热度的阅读平台。你可以自由地写小说、散文、诗歌和随笔；也可以在别人的文字里，遇见和自己相似或完全不同的心事。

每一篇公开作品都会先经过审核。我们希望这座岛始终保持友善、克制与安全，让年轻的创作者能够安心表达，也让读者拥有舒适的阅读体验。

如果你愿意，欢迎从写下第一段文字开始，和我们一起让心屿慢慢生长。`,
};

async function main() {
  const prisma = getPrisma();
  const [author, category] = await Promise.all([
    prisma.user.findFirst({ where: { role: Role.ADMIN }, select: { id: true } }),
    prisma.category.findUnique({ where: { slug: "other" }, select: { id: true } }),
  ]);

  if (!author || !category) throw new Error("需要先创建管理员账户和“其他”分类。");

  await prisma.work.upsert({
    where: { slug: introduction.slug },
    update: {
      title: introduction.title,
      summary: introduction.summary,
      contentMarkdown: introduction.contentMarkdown,
      authorId: author.id,
      categoryId: category.id,
      status: WorkStatus.PUBLISHED,
      moderationReason: null,
    },
    create: {
      ...introduction,
      authorId: author.id,
      categoryId: category.id,
      status: WorkStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  console.log("SITE_INTRODUCTION_READY");
}

main().finally(() => getPrisma().$disconnect());
