import { redirect } from "next/navigation";
import { currentTenant } from "@/lib/tenant";
import prisma from "@/lib/prisma";
import LinkForm from "./LinkForm";
import LinkRow from "./LinkRow";
import CopyPublicLink from "./CopyPublicLink";
import LiveClicks from "./LiveClicks";

export default async function Dashboard() {
  let ctx;
  try {
    ctx = await currentTenant();
  } catch {
    redirect("/login");
  }

  const { tenant, role, userId } = ctx;

  const links = await prisma.link.findMany({
    where: { tenantId: tenant.id, userId },
    orderBy: { createdAt: "desc" },
  });

  const initialHits = Object.fromEntries(
    links.map((l) => [l.id, l.clicks]),
  );

  return (
    <main className="p-8 space-y-8">
      {/* header */}
      <header className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{tenant.name}</h1>
        <a
          href={`/${tenant.slug}`}
          target="_blank"
          rel="noopener"
          className="text-sm underline text-blue-600"
        >
          Page publique
        </a>
        <CopyPublicLink slug={tenant.slug} />
        <span className="ml-auto text-xs text-gray-500">role: {role}</span>
      </header>

      {/* live analytics */}
      <section>
        <h2 className="font-semibold mb-2">Clics en temps réel</h2>
        <LiveClicks tenantSlug={tenant.slug} initial={initialHits} />
      </section>

      {/* création */}
      <section className="max-w-sm">
        <LinkForm />
      </section>

      {/* liste */}
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
  );
}
