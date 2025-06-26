"use server";

import prisma from "@/lib/prisma";
import { currentTenant } from "@/lib/tenant";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const linkSchema = z.object({
  slug: z.string().min(1),
  url: z.string().url(),
});

export async function createLink(data: unknown) {
  const { tenant } = await currentTenant();
  const { slug, url } = linkSchema.parse(data);

  await prisma.link.create({
    data: {
      slug,
      url,
      user: {
        connect: { id: tenant.members[0].userId },
      },
    },
  });

  revalidatePath("/dashboard");
}
