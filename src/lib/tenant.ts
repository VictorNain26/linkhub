import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Retourne le tenant courant + role, à partir de la session Next-Auth.
 * Si aucun tenant, en crée un (cas première connexion).
 */
export async function currentTenant() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  // 1) essaie de récupérer membership
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
  });

  if (membership) return membership; // { role, tenant }

  // 2) première connexion → créer tenant + membership OWNER
  const tenant = await prisma.tenant.create({
    data: {
      name: session.user.name ?? "Mon espace",
      slug: session.user.id.slice(0, 8), // simple slug unique
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
  });

  return {
    role: "OWNER",
    tenant,
  };
}
