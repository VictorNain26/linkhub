"use server";
import prisma from '@/lib/prisma';
import { assertRole } from '@/lib/rbac';

export async function saveTheme(
  tenantSlug: string,
  theme: Partial<{
    primary: string;
    primaryForeground: string;
    background: string;
    radiusLg: number;
  }>,
) {
  await assertRole('ADMIN', tenantSlug);
  await prisma.tenant.update({ where: { slug: tenantSlug }, data: { theme } });
}
