import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getConnectionString() {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error("DATABASE_URL is required before database features can be used.");
  }

  // Supabase requires TLS for connections made from Vercel. Keeping this here
  // avoids depending on a manually-added query parameter in every environment.
  const url = new URL(value);
  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", "require");
  }

  // pg 8 treats sslmode=require as certificate verification unless this
  // compatibility flag is present. Supabase's pooled connection uses TLS but
  // does not provide a chain Node can verify in this configuration.
  url.searchParams.set("uselibpqcompat", "true");
  return url.toString();
}

export function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const prisma = new PrismaClient({
    // A Vercel function may create many short-lived instances. One connection
    // per instance avoids exhausting the Supabase connection pool.
    adapter: new PrismaPg({
      connectionString: getConnectionString(),
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    }),
  });

  // Reuse the client within a warm serverless instance as well as in development.
  globalForPrisma.prisma = prisma;
  return prisma;
}
