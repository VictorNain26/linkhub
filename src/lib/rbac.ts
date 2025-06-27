import { currentTenant } from "@/lib/tenant";

export async function assertRole(
  min: "OWNER" | "ADMIN",
  slug: string | undefined,
) {
  const ctx = await currentTenant(slug);
  const order = { OWNER: 3, ADMIN: 2, USER: 1 } as const;
  if (order[ctx.role] < order[min]) throw new Error("FORBIDDEN");
  return ctx;
}
