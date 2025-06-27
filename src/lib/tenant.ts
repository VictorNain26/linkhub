import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { randomBytes } from "node:crypto";

/* ─── Types ─── */
export type TenantCtx = {
  userId: string;
  role: "OWNER" | "ADMIN" | "USER";
  current: { id: string; slug: string; name: string; createdAt: Date };
  memberships: {
    userId: string;
    tenantId: string;
    role: "OWNER" | "ADMIN" | "USER";
    tenant: { id: string; slug: string; name: string; createdAt: Date };
  }[];
};

/* ─── Helper principal ─── */
export async function getTenantContext(slug?: string): Promise<TenantCtx> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  const userId = session.user.id;

  let memberships = await prisma.membership.findMany({
    where: { userId },
    include: { tenant: true },
  });

  /* première connexion : crée un workspace perso */
  if (memberships.length === 0) {
    let slugCandidate = userId.slice(0, 8);
    while (await prisma.tenant.findUnique({ where: { slug: slugCandidate } })) {
      slugCandidate = randomBytes(4).toString("hex");
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: session.user.name ?? "Mon espace",
        slug: slugCandidate,
        members: { create: { userId, role: "OWNER" } },
      },
    });

    memberships = [
      {
        userId,
        tenantId: tenant.id,
        role: "OWNER",
        tenant: {
          id: tenant.id,
          slug: tenant.slug,
          name: tenant.name,
          createdAt: tenant.createdAt,
        },
      },
    ];
  }

  const current =
    memberships.find((m) => m.tenant.slug === slug)?.tenant ??
    memberships.find((m) => m.role === "OWNER")?.tenant ??
    memberships[0]!.tenant;

  const role = memberships.find((m) => m.tenant.id === current.id)!.role;

  return { userId, role, current, memberships };
}

/* Wrapper rétro-compatibilité */
export async function currentTenant() {
  const ctx = await getTenantContext();
  return { userId: ctx.userId, role: ctx.role, tenant: ctx.current };
}
