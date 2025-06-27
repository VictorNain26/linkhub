import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getTenantContext(slug?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  const userId = session.user.id;

  // Récupère toutes les memberships
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { tenant: true },
  });

  /* A. aucun membership ⇒ première connexion ; crée son tenant perso */
  if (memberships.length === 0) {
    const tenant = await prisma.tenant.create({
      data: {
        name: session.user.name ?? "Mon espace",
        slug: userId.slice(0, 8),
        members: { create: { userId, role: "OWNER" } },
      },
    });
    return { userId, memberships: [{ tenant, role: "OWNER" }], current: tenant };
  }

  /* B. on choisit le tenant courant */
  const current =
    memberships.find((m) => m.tenant.slug === slug)?.tenant ??
    memberships.find((m) => m.role === "OWNER")?.tenant ??
    memberships[0].tenant;

  const roleOfCurrent =
    memberships.find((m) => m.tenant.id === current.id)!.role;

  return {
    userId,
    memberships,
    current,
    role: roleOfCurrent,
  };
}
