"use server";

import prisma from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";

/* ─── créer un lien d’invite ─── */
export async function createInvite(role: "ADMIN" | "USER", slug: string) {
  const { tenant } = await assertRole("OWNER", slug);
  const token = randomBytes(24).toString("hex");

  await prisma.invite.create({
    data: { tenantId: tenant.id, token, role },
  });

  revalidatePath(`/dashboard/${tenant.slug}/members`);
  return token;
}

/* ─── accepter l’invitation ─── */
export async function acceptInvite(token: string, userId: string) {
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.expiresAt < new Date() || invite.uses >= invite.maxUses)
    throw new Error("INVITE_INVALID");

  await prisma.$transaction([
    prisma.membership.create({
      data: { tenantId: invite.tenantId, userId, role: invite.role },
    }),
    prisma.invite.update({
      where: { token },
      data: { uses: { increment: 1 } },
    }),
  ]);
}

/* ─── changer rôle ─── */
export async function updateRole(
  userId: string,
  role: "ADMIN" | "USER",
  slug: string,
) {
  const { tenant } = await assertRole("OWNER", slug);
  await prisma.membership.update({
    where: { userId_tenantId: { userId, tenantId: tenant.id } },
    data: { role },
  });
  revalidatePath(`/dashboard/${tenant.slug}/members`);
}

/* ─── retirer membre ─── */
export async function removeMember(userId: string, slug: string) {
  const { tenant } = await assertRole("OWNER", slug);
  await prisma.membership.delete({
    where: { userId_tenantId: { userId, tenantId: tenant.id } },
  });
  revalidatePath(`/dashboard/${tenant.slug}/members`);
}
