"use server";

import prisma from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const linkSchema = z.object({
  id: z.number().optional(),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/i),
  url: z.string().url(),
});

/* ─────── créer ─────── */
export async function createLink(data: unknown, tenantSlug: string) {
  // OWNER ou ADMIN seulement
  const { tenant, userId } = await assertRole("ADMIN", tenantSlug);
  const { slug, url } = linkSchema.parse(data);

  await prisma.link.create({
    data: { slug, url, tenantId: tenant.id, userId },
  });

  revalidatePath(`/dashboard/${tenant.slug}`);
}

/* ─────── mettre à jour ─────── */
export async function updateLink(data: unknown, tenantSlug: string) {
  const { tenant } = await assertRole("ADMIN", tenantSlug);
  const { id, slug, url } = linkSchema.parse(data);

  await prisma.link.updateMany({
    where: { id, tenantId: tenant.id },
    data: { slug, url },
  });

  revalidatePath(`/dashboard/${tenant.slug}`);
}

/* ─────── supprimer ─────── */
export async function deleteLink(formData: FormData, tenantSlug: string) {
  const { tenant } = await assertRole("ADMIN", tenantSlug);
  const id = Number(formData.get("id"));

  await prisma.link.deleteMany({
    where: { id, tenantId: tenant.id },
  });

  revalidatePath(`/dashboard/${tenant.slug}`);
}
