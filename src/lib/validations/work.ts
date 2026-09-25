import { z } from "zod";

export const workInputSchema = z.object({
  title: z.string().trim().min(1, "标题不能为空。").max(120, "标题不能超过 120 字。"),
  summary: z.string().trim().min(1, "简介不能为空。").max(300, "简介不能超过 300 字。"),
  contentMarkdown: z.string().trim().min(1, "正文不能为空。").max(100_000, "正文不能超过 100,000 字。"),
  categoryId: z.string().cuid("请选择有效的分类。"),
  tagNames: z.array(z.string().trim().min(1).max(32)).max(8, "最多添加 8 个标签。").default([]),
});

export type WorkInput = z.infer<typeof workInputSchema>;
