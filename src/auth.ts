import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { getPrisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "邮箱与密码",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const user = await getPrisma().user.findUnique({
            where: { email: parsed.data.email.toLowerCase() },
            select: { id: true, username: true, email: true, passwordHash: true, role: true, status: true },
          });

          if (!user?.passwordHash || user.status !== "ACTIVE") return null;
          if (!(await compare(parsed.data.password, user.passwordHash))) return null;

          return { id: user.id, name: user.username, email: user.email, role: user.role };
        } catch (error) {
          // This is deliberately limited to safe metadata: connection strings
          // and database credentials must never be included in Vercel logs.
          const record = error as { name?: unknown; code?: unknown };
          console.error("Credential authorization database failure", {
            name: typeof record?.name === "string" ? record.name : "UnknownError",
            code: typeof record?.code === "string" ? record.code : undefined,
          });
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.username = user.name;
      }
      return token;
    },
    session({ session, token }) {
      const isRole = (value: unknown): value is "USER" | "MODERATOR" | "ADMIN" =>
        value === "USER" || value === "MODERATOR" || value === "ADMIN";

      if (
        session.user &&
        typeof token.userId === "string" &&
        typeof token.username === "string" &&
        isRole(token.role)
      ) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
});
