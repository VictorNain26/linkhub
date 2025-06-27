import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type TenantCtx = {
  userId: string;
  role: "OWNER" | "ADMIN" | "USER";
  current: {
    id: string;
    slug: string;
    name: string;
    createdAt: Date;
  };
  memberships: {
    tenant: { id: string; slug: string; name: string };
    role: "OWNER" | "ADMIN" | "USER";
  }[];
};

/* ───────── Contexte multi-tenant ───────── */
export async function getTenantContext(slug?: string): Promise<TenantCtx> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");

  const userId = session.user.id;

  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { tenant: true },
  });

  // Création auto du workspace perso si aucun membership
  if (memberships.length === 0) {
    const tenant = await prisma.tenant.create({
      data: {
        name: session.user.name ?? "Mon espace",
        slug: userId.slice(0, 8),
        members: { create: { userId, role: "OWNER" } },
      },
    });
    return {
      userId,
      role: "OWNER",
      current: tenant,
      memberships: [{ tenant, role: "OWNER" }],
    };
  }

  const current =
    memberships.find((m) => m.tenant.slug === slug)?.tenant ??
    memberships.find((m) => m.role === "OWNER")?.tenant ??
    memberships[0]!.tenant;

  const role = memberships.find((m) => m.tenant.id === current.id)!.role;

  return { userId, role, current, memberships };
}

/* ───────── Wrapper rétro-compatible ─────────
   (pour le code qui appelait encore currentTenant) */
export async function currentTenant() {
  const ctx = await getTenantContext();
  return {
    userId: ctx.userId,
    role: ctx.role,
    tenant: ctx.current,
  };
}
