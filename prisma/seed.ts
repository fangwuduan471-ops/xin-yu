import { config } from "dotenv";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env" });
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed the database.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const categories = [
  { name: "小说", slug: "fiction", description: "虚构故事与人物" },
  { name: "散文", slug: "prose", description: "日常、感受与思考" },
  { name: "诗歌", slug: "poetry", description: "自由诗与现代诗" },
  { name: "随笔", slug: "essay", description: "片段灵感与短章" },
  { name: "其他", slug: "other", description: "尚未归类的创作" },
];

async function main() {
  await Promise.all(categories.map((category, sortOrder) => prisma.category.upsert({
    where: { slug: category.slug },
    update: { name: category.name, description: category.description, sortOrder, isActive: true },
    create: { ...category, sortOrder },
  })));
}

main().finally(() => prisma.$disconnect());
