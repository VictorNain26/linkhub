import { redirect } from "next/navigation";
import { currentTenant } from "@/lib/tenant";
import prisma from "@/lib/prisma";
import LinkForm from "./LinkForm";
import LinkRow from "./LinkRow";
import CopyPublicLink from "./CopyPublicLink";
import { LiveHitsProvider } from "./LiveHitsContext";
import LiveTotalClicks from "./LiveTotalClicks";

export default async function Dashboard() {
  /* ────── Contexte et données ------------------------------------ */
  let ctx;
  try {
    ctx = await currentTenant();     // lève si non authentifié
  } catch {
    redirect("/login");
  }

  const { tenant, role, userId } = ctx;

  const links = await prisma.link.findMany({
    where: { tenantId: tenant.id, userId },
    orderBy: { createdAt: "desc" },
  });

  const initialHits = Object.fromEntries(links.map((l) => [l.id, l.clicks]));

  /* ────── Render -------------------------------------------------- */
  return (
    <LiveHitsProvider tenantSlug={tenant.slug} initial={initialHits}>
      <main className="p-8 space-y-8">
        {/* Header */}
        <header className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold">{tenant.name}</h1>

          {/* lien page publique */}
          <a
            href={`/${tenant.slug}`}
            target="_blank"
            rel="noopener"
            className="text-sm underline text-blue-600"
          >
            Page publique
          </a>

          {/* bouton copier */}
          <CopyPublicLink slug={tenant.slug} />

          {/* lien membres (OWNER / ADMIN) */}
          {["OWNER", "ADMIN"].includes(role) && (
            <a
              href="/dashboard/members"
              className="text-sm underline text-blue-600"
            >
              Membres
            </a>
          )}

          <span className="ml-auto text-xs text-gray-500">role: {role}</span>
        </header>

        {/* Analytics live */}
        <section className="space-y-2">
          <h2 className="font-semibold">Clics en temps réel</h2>
          <LiveTotalClicks />
        </section>

        {/* Création de lien */}
        <section className="max-w-sm">
          <LinkForm />
        </section>

        {/* Liste des liens */}
        <section>
          {links.length ? (
            <ul className="space-y-3">
              {links.map((l) => (
                <LinkRow key={l.id} link={l} tenantSlug={tenant.slug} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun lien.</p>
          )}
        </section>
      </main>
    </LiveHitsProvider>
  );
}
