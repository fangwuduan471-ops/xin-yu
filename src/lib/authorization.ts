import type { Role } from "@/generated/prisma/client";

export function hasRole(role: Role | undefined, ...allowed: Role[]) {
  return role !== undefined && allowed.includes(role);
}
