"use server";

import prisma from "@/lib/prisma";
import { currentTenant } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const linkSchema = z.object({
  id: z.number().optional(),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/i),
  url: z.string().url(),
});

/* ─────── CREATE ─────── */
export async function createLink(data: unknown) {
  const { tenant, userId } = await currentTenant();
  const { slug, url } = linkSchema.parse(data);

  await prisma.link.create({
    data: {
      slug,
      url,
      tenantId: tenant.id,
      userId,
    },
  });

  revalidatePath("/dashboard");
}

/* ─────── UPDATE ─────── */
export async function updateLink(data: unknown) {
  const { tenant } = await currentTenant();
  const { id, slug, url } = linkSchema.parse(data);

  await prisma.link.updateMany({
    where: { id, tenantId: tenant.id },
    data:  { slug, url },
  });

  revalidatePath("/dashboard");
}

/* ─────── DELETE ─────── */
export async function deleteLink(formData: FormData) {
  const { tenant } = await currentTenant();
  const id = Number(formData.get("id"));

  await prisma.link.deleteMany({
    where: { id, tenantId: tenant.id },
  });

  revalidatePath("/dashboard");
}
