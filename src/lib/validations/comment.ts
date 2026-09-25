import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().trim().min(1, "评论不能为空。").max(1000, "评论不能超过 1000 字。"),
});
