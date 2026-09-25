import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js keeps local secrets in .env.local. Production platforms inject their
// variables into the process, so this only supplements values that are absent.
config({ path: ".env" });
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
