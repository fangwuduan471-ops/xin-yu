import { config } from "dotenv";
import { hash } from "bcryptjs";
import { getPrisma } from "../src/lib/prisma";

config({ path: ".env" });
config({ path: ".env.local" });

async function main() {
  const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD before creating the first admin.");
  }
  if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

  const prisma = getPrisma();
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
    if (existingAdmin) throw new Error("An administrator already exists; this bootstrap script will not create another one.");

    const collision = await prisma.user.findFirst({ where: { OR: [{ email: ADMIN_EMAIL.toLowerCase() }, { username: ADMIN_USERNAME }] }, select: { id: true } });
    if (collision) throw new Error("The requested administrator email or username is already in use.");

    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL.toLowerCase(),
        username: ADMIN_USERNAME,
        passwordHash: await hash(ADMIN_PASSWORD, 12),
        role: "ADMIN",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
