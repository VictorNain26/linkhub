"use server";

import prisma from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomBytes } from "node:crypto";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

/* 1️⃣ Générer un lien d’invitation */
export async function inviteUser(data: unknown): Promise<string> {
  const { tenant, userId } = await assertRole("OWNER");
  const { email, role } = inviteSchema.parse(data);

  // empêche l’owner de s’auto-inviter
  const owner = await prisma.user.findUnique({ where: { id: userId } });
  if (owner?.email?.toLowerCase() === email.toLowerCase()) {
    throw new Error("Vous êtes déjà le propriétaire de ce workspace.");
  }

  const token = randomBytes(24).toString("hex");

  await prisma.invite.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email } },
    update: { role, token, acceptedAt: null },
    create: { email, role, token, tenantId: tenant.id },
  });

  revalidatePath("/dashboard/members");
  return token; // renvoyé au client
}

/* 2️⃣ Acceptation */
export async function acceptInvite(token: string, userId: string) {
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.expiresAt < new Date())
    throw new Error("INVITE_INVALID");

  await prisma.$transaction([
    prisma.membership.create({
      data: {
        userId,
        tenantId: invite.tenantId,
        role: invite.role,
      },
    }),
    prisma.invite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    }),
  ]);
}

/* 3️⃣ Changer le rôle d’un membre */
export async function updateRole(userId: string, role: "ADMIN" | "USER") {
  const { tenant } = await assertRole("OWNER");
  await prisma.membership.update({
    where: { userId_tenantId: { userId, tenantId: tenant.id } },
    data: { role },
  });
  revalidatePath("/dashboard/members");
}

/* 4️⃣ Retirer un membre */
export async function removeMember(userId: string) {
  const { tenant } = await assertRole("OWNER");
  await prisma.membership.delete({
    where: { userId_tenantId: { userId, tenantId: tenant.id } },
  });
  revalidatePath("/dashboard/members");
}
