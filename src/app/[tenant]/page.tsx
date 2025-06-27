import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: { tenant: string } };

// -------- Métadonnées dynamiques
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await prisma.tenant.findUnique({
    where: { slug: params.tenant },
    select: { name: true },
  });
  return { title: t ? `${t.name} — LinkHub` : "Page inexistante" };
}

// -------- Page publique
export default async function TenantPage({ params }: Props) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.tenant },
    select: {
      id: true,
      slug: true,
      name: true,
      links: {
        orderBy: { createdAt: "asc" },
        select: { id: true, slug: true, url: true },
      },
    },
  });

    if (!tenant) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 p-8">
      <h1 className="text-3xl font-bold">{tenant.name}</h1>

      <ul className="w-full max-w-sm space-y-3">
        {tenant.links.map((l) => (
          <li key={l.id}>
            <a
              href={`/p/${tenant.slug}/${l.slug}`}
              className="block w-full bg-black text-white rounded py-3 text-center hover:opacity-90"
            >
              {l.slug}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
