import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Retourne le tenant courant + role, à partir de la session Next-Auth.
 * Si aucun tenant, en crée un (cas première connexion).
 */
export async function currentTenant() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");

  const userId = session.user.id;

  let membership = await prisma.membership.findFirst({
    where: { userId },
    include: { tenant: true },
  });

  if (!membership) {
    const tenant = await prisma.tenant.create({
      data: {
        name: session.user.name ?? "Mon espace",
        slug: userId.slice(0, 8),
        members: { create: { userId, role: "OWNER" } },
      },
    });
    membership = {
      userId,
      tenantId: tenant.id,
      role: "OWNER",
      tenant,
    };
  }

  // ✅ plus jamais null
  return {
    userId,
    role: membership.role,
    tenant: membership.tenant,
  };
}

