import { getTenantContext } from "@/lib/tenant";
import prisma from "@/lib/prisma";
import LinkForm from "../LinkForm";
import LinkRow from "../LinkRow";
import { LiveHitsProvider } from "../LiveHitsContext";
import LiveTotalClicks from "../LiveTotalClicks";

export default async function TenantDashboard({
  params,
}: {
  params: { tenant: string };
}) {
  const { tenant: slug } = params;
  const ctx = await getTenantContext(slug);
  const { current: tenant, role } = ctx;

  /* Tous les liens du workspace (plus de filtre userId) */
  const links = await prisma.link.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  const initialHits = Object.fromEntries(links.map((l) => [l.id, l.clicks]));
  const canEdit = role === "OWNER" || role === "ADMIN";

  return (
    <LiveHitsProvider tenantSlug={tenant.slug} initial={initialHits}>
      <main className="p-8 space-y-8">
        <section className="space-y-2">
          <h2 className="font-semibold">Clics en temps réel</h2>
          <LiveTotalClicks />
        </section>

        {canEdit && (
          <section className="max-w-sm">
            <LinkForm tenantSlug={tenant.slug} />
          </section>
        )}

        <section>
          {links.length ? (
            <ul className="space-y-3">
              {links.map((l) => (
                <LinkRow
                  key={l.id}
                  link={l}
                  tenantSlug={tenant.slug}
                  canEdit={canEdit}
                />
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
