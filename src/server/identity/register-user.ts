import { hash } from "bcryptjs";

import { requireValidInviteCode } from "@/lib/beta-access";
import { getPrisma } from "@/lib/prisma";
import { registrationSchema, type RegistrationInput } from "@/lib/validations/identity";
import { RegistrationError } from "./registration-error";

export { RegistrationError } from "./registration-error";

export async function registerUser(input: RegistrationInput, inviteCode?: unknown) {
  requireValidInviteCode(inviteCode);
  const data = registrationSchema.parse(input);
  const prisma = getPrisma();
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
    select: { id: true },
  });

  if (existingUser) throw new RegistrationError("该邮箱或用户名已被使用。");

  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: await hash(data.password, 12),
    },
    select: { id: true, username: true, email: true, role: true },
  });
}
