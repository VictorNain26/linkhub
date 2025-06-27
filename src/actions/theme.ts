"use server";
import prisma from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";

export async function saveTheme(tenantSlug: string, theme: any) {
  await assertRole("ADMIN", tenantSlug);
  await prisma.tenant.update({
    where: { slug: tenantSlug },
    data: { theme },
  });
}
