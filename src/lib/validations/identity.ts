import { z } from "zod";

const usernamePattern = /^[\p{L}\p{N}_-]{2,24}$/u;

export const registrationSchema = z.object({
  username: z.string().trim().regex(usernamePattern, "用户名须为 2–24 个字母、数字、下划线或短横线。"),
  email: z.string().trim().toLowerCase().email("请输入有效的邮箱地址。"),
  password: z.string().min(10, "密码至少需要 10 位。").max(128, "密码长度不能超过 128 位。"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
