"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { assertRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

/* 1️⃣ inviter */
export async function inviteUser(data: unknown) {
  const { tenant } = await assertRole("OWNER");
  const { email, role } = inviteSchema.parse(data);

  const token = randomBytes(24).toString("hex");

  await prisma.invite.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email } },
    update: { role, token, acceptedAt: null },
    create: { email, role, token, tenantId: tenant.id },
  });

  // TODO: envoyer un email (Resend, Postmark…) contenant:
  // `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`

  revalidatePath("/dashboard/members");
}

/* 2️⃣ accepter */
export async function acceptInvite(token: string, userId: string) {
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.expiresAt < new Date()) throw new Error("INVITE_INVALID");

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

/* 3️⃣ changer de rôle */
export async function updateRole(userId: string, role: "ADMIN" | "USER") {
  const { tenant } = await assertRole("OWNER");
  await prisma.membership.update({
    where: { userId_tenantId: { userId, tenantId: tenant.id } },
    data: { role },
  });
  revalidatePath("/dashboard/members");
}

/* 4️⃣ retirer un membre */
export async function removeMember(userId: string) {
  const { tenant } = await assertRole("OWNER");
  await prisma.membership.delete({
    where: { userId_tenantId: { userId, tenantId: tenant.id } },
  });
  revalidatePath("/dashboard/members");
}
